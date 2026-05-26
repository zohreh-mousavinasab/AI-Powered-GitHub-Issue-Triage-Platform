from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class RepositorySummary(BaseModel):
    full_name: str
    name: str
    owner: str
    description: str | None = None
    language: str | None = None
    stars: int = 0
    open_issues: int = 0
    html_url: str | None = None
    updated_at: str | None = None


class IssueSummary(BaseModel):
    number: int
    title: str
    state: str
    labels: list[str] = Field(default_factory=list)
    comments: int = 0
    updated_at: str
    html_url: str
    body_preview: str
    author: str | None = None


class ConnectionRequest(BaseModel):
    full_name: str = Field(..., min_length=3, description="Repository in owner/name format")
    token: str | None = Field(default=None, description="GitHub personal access token")
    use_demo: bool = False


class SearchResponse(BaseModel):
    query: str
    source: str
    items: list[RepositorySummary]


class ConnectionState(BaseModel):
    full_name: str
    source: str
    status: str
    connected_at: str
    last_sync_at: str
    repository: RepositorySummary


class DashboardStats(BaseModel):
    open_issues: int
    labels: int
    comments: int
    sync_status: str
    source: str


class DashboardResponse(BaseModel):
    connection: ConnectionState | None
    repositories: list[RepositorySummary]
    issues: list[IssueSummary]
    stats: DashboardStats
    source: str
    message: str | None = None


class IngestResponse(BaseModel):
    connection: ConnectionState | None
    issues: list[IssueSummary]
    stats: DashboardStats
    source: str
    message: str | None = None


class TriageResult(BaseModel):
    issue_number: int
    severity: str
    bug_type: str
    affected_module: str
    root_cause: str
    fix_suggestion: str
    confidence: str
    rationale: str
    source: str = "heuristic"


class TriageEvent(BaseModel):
    timestamp: str
    run_id: str
    level: str
    message: str
    issue_number: int | None = None


class TriageRun(BaseModel):
    run_id: str
    repository_full_name: str
    status: str
    total_issues: int
    processed_issues: int = 0
    created_at: str
    updated_at: str
    source: str = "heuristic"
    results: list[TriageResult] = Field(default_factory=list)


class TriageRunRequest(BaseModel):
    repository_full_name: str | None = None
    use_demo: bool = False


class TriageRunResponse(BaseModel):
    run: TriageRun


class TriageRunsResponse(BaseModel):
    runs: list[TriageRun]


class TriageEventsResponse(BaseModel):
    events: list[TriageEvent]


class AuditLogEntry(BaseModel):
    line: str


class AuditLogResponse(BaseModel):
    path: str
    entries: list[AuditLogEntry]


class AuditLogRequest(BaseModel):
    source: str = Field(..., min_length=1)
    action: str = Field(..., min_length=1)
    message: str = Field(..., min_length=1)
    details: dict[str, str | int | float | bool] = Field(default_factory=dict)


def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"
