from __future__ import annotations

import asyncio
import os
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from .audit import AUDIT_LOG_PATH, append_audit_event, read_audit_log
from .agent import AgentHub, analyze_issue, run_triage
from .github_client import GitHubAPIError, GitHubClient
from .models import (
    AuditLogRequest,
    AuditLogResponse,
    AuditLogEntry,
    ConnectionRequest,
    DashboardResponse,
    IngestResponse,
    SearchResponse,
    TriageEventsResponse,
    TriageResult,
    TriageRunRequest,
    TriageRunResponse,
    TriageRunsResponse,
    TriageEvent,
    now_iso,
)
from .store import AppStore


app = FastAPI(title="BugMind API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = AppStore()
github = GitHubClient()
agent_hub = AgentHub()


def load_env_file() -> None:
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


load_env_file()


@app.on_event("startup")
def seed_demo_state() -> None:
    if store.connection is None:
        store.set_demo()
    append_audit_event("backend", "startup", "BugMind backend started", {"audit_log": AUDIT_LOG_PATH.name})


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "bugmind-backend", "phase": "phase-2"}


@app.get("/")
def root() -> dict[str, object]:
    return {
        "message": "BugMind Phase 2 API is running",
        "health": "/health",
        "dashboard": "/api/dashboard",
        "issue_count": "/api/issue-count?repo=kimai/kimai",
        "triage_run": "/api/triage/run",
        "triage_runs": "/api/triage/runs",
        "triage_events": "/api/triage/events",
        "recommendation": "/api/issues/142/recommendation",
        "search_repositories": "/api/search/repositories?q=bugmind",
        "connect": "/api/connect",
        "ingest": "/api/ingest",
        "docs": "/docs",
    }


@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard() -> DashboardResponse:
    append_audit_event("backend", "dashboard_view", "Dashboard requested", {"source": store.source})
    return store.dashboard()


@app.get("/api/search/repositories", response_model=SearchResponse)
def search_repositories(
    q: Annotated[str, Query(min_length=1, description="Search query")],
    limit: Annotated[int, Query(ge=1, le=10)] = 5,
) -> SearchResponse:
    token = os.getenv("GITHUB_TOKEN")
    if token:
        try:
            results = github.search_repositories(q, token=token, limit=limit)
            append_audit_event("backend", "search_repositories", "GitHub repository search completed", {"query": q, "source": "github", "limit": limit})
            return SearchResponse(query=q, source="github", items=results)
        except GitHubAPIError:
            pass

    append_audit_event("backend", "search_repositories", "Demo repository search completed", {"query": q, "source": "demo", "limit": limit})
    return SearchResponse(query=q, source="demo", items=store.search_demo_repositories(q)[:limit])


@app.get("/api/issue-count")
def issue_count(
    repo: Annotated[str, Query(min_length=1, description="Repository full name")],
) -> dict[str, object]:
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        append_audit_event("backend", "issue_count", "Returned demo issue count", {"repo": repo, "source": "demo"})
        return {
            "repo": repo,
            "source": "demo",
            "open_issues": len(store.issues),
            "message": "No GitHub token configured. Returning demo issue count.",
        }

    try:
        issues = github.list_open_issues(repo, token=token)
    except GitHubAPIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    append_audit_event("backend", "issue_count", "Fetched live issue count", {"repo": repo, "source": "github", "open_issues": len(issues)})
    return {
        "repo": repo,
        "source": "github",
        "open_issues": len(issues),
        "message": f"Fetched {len(issues)} open issues from {repo}.",
    }


@app.get("/api/triage/runs", response_model=TriageRunsResponse)
def list_triage_runs() -> TriageRunsResponse:
    return TriageRunsResponse(runs=store.get_triage_runs())


@app.get("/api/triage/runs/{run_id}", response_model=TriageRunResponse)
def get_triage_run(run_id: str) -> TriageRunResponse:
    run = store.get_triage_run(run_id)
    if run is None:
        raise HTTPException(status_code=404, detail="Triage run not found")
    return TriageRunResponse(run=run)


@app.get("/api/triage/events", response_model=TriageEventsResponse)
def list_triage_events(limit: Annotated[int, Query(ge=1, le=200)] = 50) -> TriageEventsResponse:
    return TriageEventsResponse(events=store.get_triage_events(limit=limit))


@app.get("/api/audit/logs", response_model=AuditLogResponse)
def list_audit_logs(limit: Annotated[int, Query(ge=1, le=500)] = 100) -> AuditLogResponse:
    return AuditLogResponse(
        path=str(AUDIT_LOG_PATH),
        entries=[AuditLogEntry(line=line) for line in read_audit_log(limit=limit)],
    )


@app.get("/api/audit/log.txt")
def download_audit_log(limit: Annotated[int, Query(ge=1, le=500)] = 100) -> PlainTextResponse:
    lines = read_audit_log(limit=limit)
    text = "\n".join(lines)
    if text:
        text += "\n"
    return PlainTextResponse(text, media_type="text/plain; charset=utf-8")


@app.post("/api/audit/event", response_model=AuditLogResponse)
def create_audit_event(payload: AuditLogRequest) -> AuditLogResponse:
    append_audit_event(payload.source, payload.action, payload.message, payload.details)
    return AuditLogResponse(
        path=str(AUDIT_LOG_PATH),
        entries=[AuditLogEntry(line=line) for line in read_audit_log(limit=100)],
    )


@app.get("/api/issues/{issue_number}/recommendation", response_model=TriageResult)
async def issue_recommendation(issue_number: int) -> TriageResult:
    issue = store.get_issue(issue_number)
    if issue is None:
        raise HTTPException(status_code=404, detail="Issue not found")

    repository_full_name = store.connection.full_name if store.connection else "kimai/kimai"
    start_event = TriageEvent(
        timestamp=now_iso(),
        run_id=f"issue-{issue_number}",
        level="info",
        message=f"Analyzing issue #{issue_number}: {issue.title}",
        issue_number=issue_number,
    )
    store.append_triage_event(start_event)
    await agent_hub.publish(start_event.model_dump())
    append_audit_event("backend", "issue_recommendation", "Started issue recommendation", {"issue_number": issue_number, "issue_title": issue.title})

    result = await analyze_issue(issue, repository_full_name)

    finish_event = TriageEvent(
        timestamp=now_iso(),
        run_id=f"issue-{issue_number}",
        level="success",
        message=f"Recommended solution for issue #{issue_number}: {result.fix_suggestion}",
        issue_number=issue_number,
    )
    store.append_triage_event(finish_event)
    await agent_hub.publish(finish_event.model_dump())
    append_audit_event("backend", "issue_recommendation", "Completed issue recommendation", {"issue_number": issue_number, "severity": result.severity, "source": result.source})
    return result


@app.post("/api/triage/run", response_model=TriageRunResponse)
async def start_triage_run(payload: TriageRunRequest) -> TriageRunResponse:
    repository_full_name = payload.repository_full_name or (store.connection.full_name if store.connection else "kimai/kimai")
    source = "demo" if payload.use_demo or store.source == "demo" else "heuristic"

    if store.connection is None or store.connection.full_name != repository_full_name:
        store.set_demo(message=f"Loaded triage demo snapshot for {repository_full_name}.")

    run = store.create_triage_run(repository_full_name=repository_full_name, source=source)
    append_audit_event("backend", "triage_run", "Queued triage run", {"repository": repository_full_name, "source": source, "run_id": run.run_id})
    asyncio.create_task(run_triage(store, agent_hub, run))
    return TriageRunResponse(run=run)


@app.post("/api/connect", response_model=DashboardResponse)
def connect_repository(payload: ConnectionRequest) -> DashboardResponse:
    full_name = payload.full_name.strip()
    token = payload.token or os.getenv("GITHUB_TOKEN")

    if payload.use_demo or not token:
        dashboard = store.set_demo(message=f"Connected demo repository snapshot for {full_name}.")
        append_audit_event("backend", "connect_repository", "Connected demo repository snapshot", {"repository": full_name, "source": "demo"})
        return dashboard

    try:
        repository = github.get_repository(full_name, token=token)
        issues = github.list_open_issues(full_name, token=token)
    except GitHubAPIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    dashboard = store.set_connection(
        repository=repository,
        issues=issues,
        source="github",
        token=token,
        message=f"Connected to {repository.full_name} and ingested {len(issues)} open issues.",
    )
    append_audit_event("backend", "connect_repository", "Connected live repository", {"repository": repository.full_name, "source": "github", "issues": len(issues)})
    return dashboard


@app.post("/api/ingest", response_model=IngestResponse)
def ingest_repository() -> IngestResponse:
    if store.connection is None:
        dashboard = store.set_demo(message="No repository connected yet. Loaded demo snapshot.")
        append_audit_event("backend", "ingest_repository", "Loaded demo snapshot because no repository was connected", {"source": "demo"})
        return IngestResponse(
            connection=dashboard.connection,
            issues=dashboard.issues,
            stats=dashboard.stats,
            source=dashboard.source,
            message=dashboard.message,
        )

    if store.source == "demo":
        dashboard = store.refresh_issues(store.issues, message="Demo snapshot refreshed.")
        append_audit_event("backend", "ingest_repository", "Refreshed demo snapshot", {"source": "demo"})
        return IngestResponse(
            connection=dashboard.connection,
            issues=dashboard.issues,
            stats=dashboard.stats,
            source=dashboard.source,
            message=dashboard.message,
        )

    if not store.connection:
        raise HTTPException(status_code=400, detail="No repository connection available.")

    token = store.token or os.getenv("GITHUB_TOKEN")
    if not token:
        raise HTTPException(status_code=400, detail="GitHub token is required to ingest live repository data.")

    try:
        issues = github.list_open_issues(store.connection.full_name, token=token)
    except GitHubAPIError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc

    dashboard = store.refresh_issues(issues, message=f"Refreshed {len(issues)} open issues from {store.connection.full_name}.")
    append_audit_event("backend", "ingest_repository", "Refreshed live issues", {"repository": store.connection.full_name, "source": "github", "issues": len(issues)})
    return IngestResponse(
        connection=dashboard.connection,
        issues=dashboard.issues,
        stats=dashboard.stats,
        source=dashboard.source,
        message=dashboard.message,
    )


@app.websocket("/ws/triage")
async def triage_stream(websocket: WebSocket) -> None:
    await websocket.accept()
    queue = await agent_hub.subscribe()
    append_audit_event("backend", "triage_stream", "WebSocket client connected", {})

    try:
        await websocket.send_json({"type": "snapshot", "events": [event.model_dump() for event in store.get_triage_events(limit=50)]})
        while True:
            payload = await queue.get()
            await websocket.send_text(payload)
    except WebSocketDisconnect:
        pass
    finally:
        await agent_hub.unsubscribe(queue)
        append_audit_event("backend", "triage_stream", "WebSocket client disconnected", {})
