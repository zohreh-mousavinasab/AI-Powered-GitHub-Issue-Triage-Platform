from __future__ import annotations

from dataclasses import dataclass, field
from threading import RLock

from .models import (
    ConnectionState,
    DashboardResponse,
    DashboardStats,
    IssueSummary,
    TriageEvent,
    TriageResult,
    TriageRun,
    RepositorySummary,
    now_iso,
)


def _demo_repositories() -> list[RepositorySummary]:
    return [
        RepositorySummary(
            full_name="kimai/kimai",
            name="kimai",
            owner="kimai",
            description="Kimai time-tracking repository used as the live GitHub demo target.",
            language="TypeScript",
            stars=2400,
            open_issues=48,
            html_url="https://github.com/kimai/kimai",
            updated_at="2026-05-19T08:00:00Z",
        ),
        RepositorySummary(
            full_name="openai/evals",
            name="evals",
            owner="openai",
            description="Framework for evaluating model behavior, prompts, and agent workflows.",
            language="Python",
            stars=18100,
            open_issues=137,
            html_url="https://github.com/openai/evals",
            updated_at="2026-05-19T06:00:00Z",
        ),
        RepositorySummary(
            full_name="vercel/next.js",
            name="next.js",
            owner="vercel",
            description="Production-ready React framework with fast refresh and server rendering.",
            language="TypeScript",
            stars=130000,
            open_issues=1800,
            html_url="https://github.com/vercel/next.js",
            updated_at="2026-05-19T07:30:00Z",
        ),
    ]


def _demo_issues() -> list[IssueSummary]:
    return [
        IssueSummary(
            number=142,
            title="Crash when opening the issue details drawer",
            state="open",
            labels=["ui", "regression", "triage-ready"],
            comments=7,
            updated_at="2026-05-19T07:45:00Z",
            html_url="https://github.com/kimai/kimai/issues",
            body_preview="Clicking the details drawer on a narrow viewport causes the page to freeze and the overlay never closes.",
            author="maria",
        ),
        IssueSummary(
            number=138,
            title="Webhook payloads are duplicated during triage runs",
            state="open",
            labels=["backend", "webhook", "duplicate"],
            comments=4,
            updated_at="2026-05-19T07:10:00Z",
            html_url="https://github.com/kimai/kimai/issues",
            body_preview="The same GitHub issue is ingested multiple times when webhook retries happen during a busy run.",
            author="devon",
        ),
        IssueSummary(
            number=126,
            title="Low-confidence classification for API timeout reports",
            state="open",
            labels=["agent", "prompt", "confidence"],
            comments=2,
            updated_at="2026-05-19T06:25:00Z",
            html_url="https://github.com/kimai/kimai/issues",
            body_preview="The agent does not have enough context to distinguish infrastructure timeouts from application timeouts.",
            author="sam",
        ),
        IssueSummary(
            number=119,
            title="Sidebar labels exceed available width on mobile",
            state="open",
            labels=["responsive", "ux"],
            comments=1,
            updated_at="2026-05-19T06:05:00Z",
            html_url="https://github.com/kimai/kimai/issues",
            body_preview="Long label text in the issue sidebar breaks the layout on smaller screens.",
            author="alex",
        ),
    ]


@dataclass
class AppStore:
    lock: RLock = field(default_factory=RLock)
    connection: ConnectionState | None = None
    repositories: list[RepositorySummary] = field(default_factory=_demo_repositories)
    issues: list[IssueSummary] = field(default_factory=_demo_issues)
    triage_runs: list[TriageRun] = field(default_factory=list)
    triage_events: list[TriageEvent] = field(default_factory=list)
    source: str = "demo"
    token: str | None = None
    message: str | None = "Loaded demo repository data."

    def dashboard(self) -> DashboardResponse:
        with self.lock:
            stats = DashboardStats(
                open_issues=len(self.issues),
                labels=len({label for issue in self.issues for label in issue.labels}),
                comments=sum(issue.comments for issue in self.issues),
                sync_status=self.message or "Ready",
                source=self.source,
            )
            return DashboardResponse(
                connection=self.connection,
                repositories=self.repositories,
                issues=self.issues,
                stats=stats,
                source=self.source,
                message=self.message,
            )

    def set_demo(self, message: str = "Loaded demo repository data.") -> DashboardResponse:
        with self.lock:
            self.connection = ConnectionState(
                full_name=self.repositories[0].full_name,
                source="demo",
                status="connected",
                connected_at=now_iso(),
                last_sync_at=now_iso(),
                repository=self.repositories[0],
            )
            self.issues = _demo_issues()
            self.source = "demo"
            self.message = message
            return self.dashboard()

    def set_connection(
        self,
        repository: RepositorySummary,
        issues: list[IssueSummary],
        source: str,
        token: str | None = None,
        message: str | None = None,
    ) -> DashboardResponse:
        with self.lock:
            timestamp = now_iso()
            self.connection = ConnectionState(
                full_name=repository.full_name,
                source=source,
                status="connected",
                connected_at=timestamp,
                last_sync_at=timestamp,
                repository=repository,
            )
            self.repositories = [repository] + [repo for repo in self.repositories if repo.full_name != repository.full_name]
            self.issues = issues
            self.source = source
            self.token = token
            self.message = message or f"Connected to {repository.full_name}."
            return self.dashboard()

    def refresh_issues(self, issues: list[IssueSummary], message: str | None = None) -> DashboardResponse:
        with self.lock:
            timestamp = now_iso()
            if self.connection is not None:
                self.connection = ConnectionState(
                    full_name=self.connection.full_name,
                    source=self.connection.source,
                    status=self.connection.status,
                    connected_at=self.connection.connected_at,
                    last_sync_at=timestamp,
                    repository=self.connection.repository,
                )
            self.issues = issues
            self.message = message or self.message
            return self.dashboard()

    def search_demo_repositories(self, query: str) -> list[RepositorySummary]:
        query = query.strip().lower()
        if not query:
            return self.repositories
        return [
            repo
            for repo in _demo_repositories()
            if query in repo.full_name.lower()
            or query in (repo.description or "").lower()
            or query in (repo.language or "").lower()
            or query in repo.owner.lower()
        ]

    def get_issue(self, issue_number: int) -> IssueSummary | None:
        with self.lock:
            for issue in self.issues:
                if issue.number == issue_number:
                    return issue
        return None

    def reset_demo(self) -> DashboardResponse:
        return self.set_demo()

    def create_triage_run(self, repository_full_name: str, source: str) -> TriageRun:
        with self.lock:
            run = TriageRun(
                run_id=f"run-{len(self.triage_runs) + 1}",
                repository_full_name=repository_full_name,
                status="queued",
                total_issues=len(self.issues),
                processed_issues=0,
                created_at=now_iso(),
                updated_at=now_iso(),
                source=source,
            )
            self.triage_runs.insert(0, run)
            return run

    def get_triage_runs(self) -> list[TriageRun]:
        with self.lock:
            return list(self.triage_runs)

    def get_triage_run(self, run_id: str) -> TriageRun | None:
        with self.lock:
            for run in self.triage_runs:
                if run.run_id == run_id:
                    return run
        return None

    def update_triage_run(self, run_id: str, **changes: object) -> TriageRun | None:
        with self.lock:
            for index, run in enumerate(self.triage_runs):
                if run.run_id == run_id:
                    updated = run.model_copy(update={**changes, "updated_at": now_iso()})
                    self.triage_runs[index] = updated
                    return updated
        return None

    def append_triage_result(self, run_id: str, result: TriageResult) -> None:
        with self.lock:
            for index, run in enumerate(self.triage_runs):
                if run.run_id == run_id:
                    results = [*run.results, result]
                    updated = run.model_copy(
                        update={
                            "results": results,
                            "processed_issues": len(results),
                            "updated_at": now_iso(),
                        }
                    )
                    self.triage_runs[index] = updated
                    return

    def append_triage_event(self, event: TriageEvent) -> None:
        with self.lock:
            self.triage_events.insert(0, event)
            self.triage_events = self.triage_events[:200]

    def get_triage_events(self, limit: int = 50) -> list[TriageEvent]:
        with self.lock:
            return list(self.triage_events[:limit])
