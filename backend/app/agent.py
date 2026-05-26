from __future__ import annotations

import asyncio
import json
import os
import shlex
import subprocess
from dataclasses import dataclass, field

from .models import IssueSummary, TriageEvent, TriageResult, TriageRun, now_iso
from .store import AppStore


@dataclass
class AgentHub:
    queues: set[asyncio.Queue[str]] = field(default_factory=set)
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def subscribe(self) -> asyncio.Queue[str]:
        queue: asyncio.Queue[str] = asyncio.Queue()
        async with self.lock:
            self.queues.add(queue)
        return queue

    async def unsubscribe(self, queue: asyncio.Queue[str]) -> None:
        async with self.lock:
            self.queues.discard(queue)

    async def publish(self, payload: dict[str, object]) -> None:
        message = json.dumps(payload)
        async with self.lock:
            for queue in list(self.queues):
                await queue.put(message)


def _issue_text(issue: IssueSummary) -> str:
    return f"{issue.title}\n{issue.body_preview}\n{' '.join(issue.labels)}"


def _guess_severity(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["security", "exploit", "credential", "data loss"]):
        return "P0"
    if any(word in lowered for word in ["crash", "freeze", "duplicate", "broken", "failure"]):
        return "P1"
    if any(word in lowered for word in ["timeout", "slow", "performance", "latency", "retry"]):
        return "P2"
    if any(word in lowered for word in ["layout", "responsive", "style", "ui", "ux"]):
        return "P3"
    return "P4"


def _guess_bug_type(text: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ["layout", "ui", "ux", "drawer", "button", "sidebar", "mobile"]):
        return "UI"
    if any(word in lowered for word in ["api", "webhook", "backend", "server", "database"]):
        return "Backend"
    if any(word in lowered for word in ["timeout", "slow", "latency", "performance"]):
        return "Performance"
    if any(word in lowered for word in ["security", "credential", "auth", "token"]):
        return "Security"
    return "Logic"


def _guess_module(issue: IssueSummary, text: str) -> str:
    lowered = text.lower()
    if "frontend" in lowered or "ui" in lowered or "sidebar" in lowered or "drawer" in lowered:
        return "frontend/ui"
    if "backend" in lowered or "webhook" in lowered or "api" in lowered:
        return "backend/api"
    if "mobile" in lowered or "responsive" in lowered:
        return "frontend/responsive"
    if issue.labels:
        return issue.labels[0]
    return "unknown"


def _confidence(issue: IssueSummary) -> str:
    if issue.comments >= 5 or len(issue.labels) >= 3:
        return "High"
    if issue.comments >= 2:
        return "Medium"
    return "Low"


def _heuristic_result(issue: IssueSummary, repository_full_name: str) -> TriageResult:
    text = _issue_text(issue)
    severity = _guess_severity(text)
    bug_type = _guess_bug_type(text)
    module = _guess_module(issue, text)
    confidence = _confidence(issue)
    rationale = (
        f"The issue in {repository_full_name} contains cues that map to {severity} {bug_type} behavior."
    )
    return TriageResult(
        issue_number=issue.number,
        severity=severity,
        bug_type=bug_type,
        affected_module=module,
        root_cause=f"Likely a {bug_type.lower()} path in {module} that fails under the reported conditions.",
        fix_suggestion=f"Reproduce the bug in {module}, patch the failing path, and add a regression test.",
        confidence=confidence,
        rationale=rationale,
        source="heuristic",
    )


def _codex_command() -> list[str] | None:
    command = os.getenv("CODEX_COMMAND")
    if not command:
        return None
    return shlex.split(command)


async def analyze_issue(issue: IssueSummary, repository_full_name: str) -> TriageResult:
    command = _codex_command()
    if not command:
        await asyncio.sleep(0.35)
        return _heuristic_result(issue, repository_full_name)

    payload = {
        "repository": repository_full_name,
        "issue": issue.model_dump(),
        "instructions": "Return JSON with severity, bug_type, affected_module, root_cause, fix_suggestion, confidence, rationale, source.",
    }

    def _run_subprocess() -> str:
        completed = subprocess.run(
            command,
            input=json.dumps(payload),
            text=True,
            capture_output=True,
            timeout=60,
            check=True,
        )
        return completed.stdout

    try:
        stdout = await asyncio.to_thread(_run_subprocess)
        raw = json.loads(stdout)
        return TriageResult(
            issue_number=issue.number,
            severity=raw.get("severity", "P3"),
            bug_type=raw.get("bug_type", "Logic"),
            affected_module=raw.get("affected_module", "unknown"),
            root_cause=raw.get("root_cause", "Codex output did not include a root cause."),
            fix_suggestion=raw.get("fix_suggestion", "Review the Codex recommendation and patch accordingly."),
            confidence=raw.get("confidence", "Medium"),
            rationale=raw.get("rationale", "Codex CLI generated this result."),
            source=raw.get("source", "codex"),
        )
    except Exception:
        await asyncio.sleep(0.35)
        return _heuristic_result(issue, repository_full_name)


async def run_triage(store: AppStore, hub: AgentHub, run: TriageRun) -> TriageRun:
    store.update_triage_run(run.run_id, status="running")
    await hub.publish(
        TriageEvent(
            timestamp=now_iso(),
            run_id=run.run_id,
            level="info",
            message=f"Started triage run for {run.repository_full_name} with {run.total_issues} issues.",
        ).model_dump()
    )

    issues = list(store.issues)
    for issue in issues:
        await hub.publish(
            TriageEvent(
                timestamp=now_iso(),
                run_id=run.run_id,
                level="info",
                message=f"Analyzing issue #{issue.number}: {issue.title}",
                issue_number=issue.number,
            ).model_dump()
        )

        result = await analyze_issue(issue, run.repository_full_name)
        store.append_triage_result(run.run_id, result)
        await hub.publish(
            TriageEvent(
                timestamp=now_iso(),
                run_id=run.run_id,
                level="success",
                message=f"Triaged issue #{issue.number} as {result.severity} with {result.confidence} confidence.",
                issue_number=issue.number,
            ).model_dump()
        )
        await asyncio.sleep(0.2)

    finished = store.update_triage_run(run.run_id, status="completed")
    await hub.publish(
        TriageEvent(
            timestamp=now_iso(),
            run_id=run.run_id,
            level="success",
            message=f"Completed triage run for {run.repository_full_name}.",
        ).model_dump()
    )
    return finished or run
