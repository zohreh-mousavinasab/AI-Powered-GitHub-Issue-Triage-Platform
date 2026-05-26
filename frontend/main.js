const API_BASE = "http://127.0.0.1:8000";
const WS_BASE = API_BASE.replace(/^http/, "ws");

const demoDashboard = {
  connection: {
    full_name: "zohreh-mousavinasab/Web-Scraper",
    source: "demo",
    status: "connected",
    connected_at: "2026-05-19T08:00:00Z",
    last_sync_at: "2026-05-19T08:00:00Z",
    repository: {
      full_name: "zohreh-mousavinasab/Web-Scraper",
      name: "Web-Scraper",
      owner: "zohreh-mousavinasab",
      description: "Web Scraper repository used as the live demo target.",
      language: "Python",
      stars: 0,
      open_issues: 0,
      html_url: "https://github.com/zohreh-mousavinasab/Web-Scraper",
      updated_at: "2026-05-19T08:00:00Z",
    },
  },
  repositories: [
    {
      full_name: "zohreh-mousavinasab/Web-Scraper",
      name: "Web-Scraper",
      owner: "zohreh-mousavinasab",
      description:
        "Web Scraper repository used as the live GitHub demo target.",
      language: "Python",
      stars: 0,
      open_issues: 0,
      html_url: "https://github.com/zohreh-mousavinasab/Web-Scraper",
      updated_at: "2026-05-19T08:00:00Z",
    },
    {
      full_name: "openai/evals",
      name: "evals",
      owner: "openai",
      description:
        "Framework for evaluating model behavior, prompts, and agent workflows.",
      language: "Python",
      stars: 18100,
      open_issues: 137,
      html_url: "https://github.com/openai/evals",
      updated_at: "2026-05-19T06:00:00Z",
    },
    {
      full_name: "vercel/next.js",
      name: "next.js",
      owner: "vercel",
      description:
        "Production-ready React framework with fast refresh and server rendering.",
      language: "TypeScript",
      stars: 130000,
      open_issues: 1800,
      html_url: "https://github.com/vercel/next.js",
      updated_at: "2026-05-19T07:30:00Z",
    },
  ],
  issues: [
    {
      number: 142,
      title: "Crash when opening the issue details drawer",
      state: "open",
      labels: ["ui", "regression", "triage-ready"],
      comments: 7,
      updated_at: "2026-05-19T07:45:00Z",
      html_url: "https://github.com/zohreh-mousavinasab/Web-Scraper/issues",
      body_preview:
        "Clicking the details drawer on a narrow viewport causes the page to freeze and the overlay never closes.",
      author: "maria",
    },
    {
      number: 138,
      title: "Webhook payloads are duplicated during triage runs",
      state: "open",
      labels: ["backend", "webhook", "duplicate"],
      comments: 4,
      updated_at: "2026-05-19T07:10:00Z",
      html_url: "https://github.com/zohreh-mousavinasab/Web-Scraper/issues",
      body_preview:
        "The same GitHub issue is ingested multiple times when webhook retries happen during a busy run.",
      author: "devon",
    },
    {
      number: 126,
      title: "Low-confidence classification for API timeout reports",
      state: "open",
      labels: ["agent", "prompt", "confidence"],
      comments: 2,
      updated_at: "2026-05-19T06:25:00Z",
      html_url: "https://github.com/zohreh-mousavinasab/Web-Scraper/issues",
      body_preview:
        "The agent does not have enough context to distinguish infrastructure timeouts from application timeouts.",
      author: "sam",
    },
    {
      number: 119,
      title: "Sidebar labels exceed available width on mobile",
      state: "open",
      labels: ["responsive", "ux"],
      comments: 1,
      updated_at: "2026-05-19T06:05:00Z",
      html_url: "https://github.com/zohreh-mousavinasab/Web-Scraper/issues",
      body_preview:
        "Long label text in the issue sidebar breaks the layout on smaller screens.",
      author: "alex",
    },
  ],
  stats: {
    open_issues: 4,
    labels: 11,
    comments: 14,
    sync_status: "Loaded demo repository data.",
    source: "demo",
  },
  source: "demo",
  message: "Loaded demo repository data.",
};

const demoTriageRuns = [
  {
    run_id: "run-demo",
    repository_full_name: "zohreh-mousavinasab/Web-Scraper",
    status: "completed",
    total_issues: 4,
    processed_issues: 4,
    created_at: "2026-05-19T09:30:00Z",
    updated_at: "2026-05-19T09:32:00Z",
    source: "heuristic",
    results: [
      {
        issue_number: 142,
        severity: "P1",
        bug_type: "UI",
        affected_module: "frontend/ui",
        root_cause: "Drawer state is not being cleared on narrow viewports.",
        fix_suggestion:
          "Patch the close handler and add a responsive regression test.",
        confidence: "High",
        rationale: "Crash and overlay symptoms indicate a UI regression.",
        source: "heuristic",
      },
      {
        issue_number: 138,
        severity: "P1",
        bug_type: "Backend",
        affected_module: "backend/api",
        root_cause: "Webhook ingestion is likely missing idempotency on retry.",
        fix_suggestion:
          "Add delivery-id deduping before queueing webhook payloads.",
        confidence: "Medium",
        rationale:
          "Duplicate webhook payloads point at a backend ingestion issue.",
        source: "heuristic",
      },
      {
        issue_number: 126,
        severity: "P2",
        bug_type: "Logic",
        affected_module: "backend/api",
        root_cause:
          "Timeout classification lacks enough context to distinguish environments.",
        fix_suggestion:
          "Request stack traces and reproduction steps before auto-labeling.",
        confidence: "Low",
        rationale:
          "Ambiguous timeouts need more evidence before a firm decision.",
        source: "heuristic",
      },
      {
        issue_number: 119,
        severity: "P3",
        bug_type: "UI",
        affected_module: "frontend/responsive",
        root_cause: "Responsive label wrapping is breaking the mobile layout.",
        fix_suggestion:
          "Clamp label rows and introduce overflow-safe wrapping.",
        confidence: "High",
        rationale: "The issue is visual and limited to smaller screens.",
        source: "heuristic",
      },
    ],
  },
];

const demoTriageEvents = [
  {
    timestamp: "2026-05-19T09:30:00Z",
    run_id: "run-demo",
    level: "info",
    message:
      "Started triage run for zohreh-mousavinasab/Web-Scraper with 4 issues.",
    issue_number: null,
  },
  {
    timestamp: "2026-05-19T09:30:04Z",
    run_id: "run-demo",
    level: "success",
    message: "Triaged issue #142 as P1 with High confidence.",
    issue_number: 142,
  },
  {
    timestamp: "2026-05-19T09:30:08Z",
    run_id: "run-demo",
    level: "success",
    message: "Completed triage run for zohreh-mousavinasab/Web-Scraper.",
    issue_number: null,
  },
];

const state = {
  dashboard: null,
  selectedIssue: null,
  recommendations: {},
  view: "repository",
  repoQuery: "",
  triageRuns: [],
  triageEvents: [],
  auditLogEntries: [],
  triageSocket: null,
  activeRunId: null,
  triagePolling: null,
};

const els = {
  viewButtons: document.querySelectorAll(".view-switch, .side-link"),
  views: document.querySelectorAll(".view-panel"),
  repoSearch: document.getElementById("repo-search"),
  globalSearch: document.getElementById("global-search"),
  repoResults: document.getElementById("repo-results"),
  issueList: document.getElementById("issue-list"),
  connectForm: document.getElementById("connect-form"),
  repoFullName: document.getElementById("repo-full-name"),
  connectionStatus: document.getElementById("connection-status"),
  searchSource: document.getElementById("search-source"),
  sidebarRepoName: document.getElementById("sidebar-repo-name"),
  sidebarRepoDescription: document.getElementById("sidebar-repo-description"),
  sidebarRepoMeta: document.getElementById("sidebar-repo-meta"),
  statOpenIssues: document.getElementById("stat-open-issues"),
  statLabels: document.getElementById("stat-labels"),
  statComments: document.getElementById("stat-comments"),
  detailModal: document.getElementById("detail-modal"),
  openDetail: document.getElementById("open-detail"),
  closeDetail: document.getElementById("close-detail"),
  refreshButton: document.getElementById("refresh-button"),
  demoButton: document.getElementById("demo-button"),
  ingestButton: document.getElementById("ingest-button"),
  auditRefresh: document.getElementById("audit-refresh"),
  detailRefresh: document.getElementById("detail-refresh"),
  detailUrl: document.getElementById("detail-url"),
  modalUrl: document.getElementById("modal-url"),
  auditLogPath: document.getElementById("audit-log-path"),
  auditLogCount: document.getElementById("audit-log-count"),
  auditLogFeed: document.getElementById("audit-log-feed"),
  recommendationStatusDetail: document.getElementById(
    "recommendation-status-detail",
  ),
  recommendationDetail: document.getElementById("recommendation-detail"),
  recommendationStatusModal: document.getElementById(
    "recommendation-status-modal",
  ),
  recommendationModal: document.getElementById("recommendation-modal"),
  runAgent: document.getElementById("run-agent"),
  triageRunCount: document.getElementById("triage-run-count"),
  triageProcessedCount: document.getElementById("triage-processed-count"),
  triageStatus: document.getElementById("triage-status"),
  triageSource: document.getElementById("triage-source"),
  triageResults: document.getElementById("triage-results"),
  triageLiveState: document.getElementById("triage-live-state"),
  triageLiveFeed: document.getElementById("triage-live-feed"),
};

const fieldPairs = {
  number: ["detail-number", "modal-number"],
  title: ["detail-title", "modal-title"],
  state: ["detail-state", "modal-state"],
  comments: ["detail-comments", "modal-comments"],
  updated: ["detail-updated", "modal-updated"],
  author: ["detail-author", "modal-author"],
  body: ["detail-body", "modal-body"],
  labels: ["detail-labels", "modal-labels"],
  meta: ["detail-meta", "modal-meta"],
  url: ["detail-url", "modal-url"],
};

const recommendationTargets = [
  {
    status: els.recommendationStatusDetail,
    body: els.recommendationDetail,
  },
  {
    status: els.recommendationStatusModal,
    body: els.recommendationModal,
  },
];

function setView(view) {
  state.view = view;
  els.views.forEach((panel) =>
    panel.classList.toggle("hidden", panel.id !== `view-${view}`),
  );
  els.viewButtons.forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("bg-panel2", active);
    button.classList.toggle("border", active);
  });
}

function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function severityDot(state) {
  return state === "open" ? "bg-green" : "bg-yellow";
}

function renderAuditLog(payload) {
  const entries = payload?.entries || [];
  const path = payload?.path || "audit_log.txt";

  if (els.auditLogPath) {
    els.auditLogPath.textContent = path.split(/[\\/]/).pop() || "audit_log.txt";
  }

  if (els.auditLogCount) {
    els.auditLogCount.textContent = `${entries.length} entr${entries.length === 1 ? "y" : "ies"}`;
  }

  if (!els.auditLogFeed) return;

  els.auditLogFeed.innerHTML = "";
  if (!entries.length) {
    els.auditLogFeed.innerHTML =
      '<div class="rounded-xl border border-dashed border-border bg-white p-3 text-xs leading-5 text-muted">No audit entries yet.</div>';
    return;
  }

  const fragment = document.createDocumentFragment();
  entries
    .slice(-8)
    .reverse()
    .forEach((entry) => {
      const article = document.createElement("article");
      article.className = "rounded-xl border border-border bg-white p-3";

      const line = document.createElement("div");
      line.className =
        "font-mono text-[11px] leading-5 text-muted whitespace-pre-wrap break-words";
      line.textContent = entry.line;

      article.appendChild(line);
      fragment.appendChild(article);
    });

  els.auditLogFeed.appendChild(fragment);
}

function recommendationTone(kind) {
  if (kind === "loading") return "border-blue bg-blue/10 text-blue";
  if (kind === "error") return "border-red bg-red/10 text-red";
  if (kind === "codex") return "border-green bg-green/10 text-green";
  if (kind === "heuristic") return "border-yellow bg-yellow/10 text-yellow";
  return "border-border bg-panel2 text-muted";
}

async function requestJson(path, options = {}) {
  const { timeoutMs = 8000, headers = {}, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    signal: controller.signal,
    ...fetchOptions,
  }).finally(() => window.clearTimeout(timeout));

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed with ${response.status}`);
  }

  return response.json();
}

async function loadAuditLog() {
  try {
    const response = await requestJson("/api/audit/logs?limit=40", {
      timeoutMs: 8000,
    });
    state.auditLogEntries = response.entries || [];
    renderAuditLog(response);
    return response;
  } catch (error) {
    console.warn("Using empty audit log", error);
    const emptyPayload = { path: "audit_log.txt", entries: [] };
    renderAuditLog(emptyPayload);
    return emptyPayload;
  }
}

async function logAuditEvent(source, action, message, details = {}) {
  try {
    await requestJson("/api/audit/event", {
      method: "POST",
      body: JSON.stringify({ source, action, message, details }),
      timeoutMs: 8000,
    });
    void loadAuditLog();
  } catch (error) {
    console.warn("Unable to write audit event", error);
  }
}

async function loadDashboard() {
  try {
    const dashboard = await requestJson("/api/dashboard");
    renderDashboard(dashboard);
    void logAuditEvent(
      "frontend",
      "dashboard_loaded",
      "Dashboard loaded in the browser",
      {
        source: dashboard.source || "demo",
      },
    );
    return dashboard;
  } catch (error) {
    console.warn("Backend unavailable, falling back to demo data", error);
    renderDashboard(demoDashboard);
    void logAuditEvent(
      "frontend",
      "dashboard_loaded",
      "Demo dashboard loaded in the browser",
      {
        source: "demo",
      },
    );
    return demoDashboard;
  }
}

async function searchRepositories(query) {
  const trimmed = query.trim();
  if (!trimmed) {
    renderRepositorySearch(
      state.dashboard?.repositories || demoDashboard.repositories,
      "demo",
    );
    return;
  }

  try {
    const response = await requestJson(
      `/api/search/repositories?q=${encodeURIComponent(trimmed)}&limit=5`,
    );
    renderRepositorySearch(response.items, response.source);
  } catch (error) {
    const items = (demoDashboard.repositories || []).filter((repo) =>
      [repo.full_name, repo.description, repo.language, repo.owner]
        .join(" ")
        .toLowerCase()
        .includes(trimmed.toLowerCase()),
    );
    renderRepositorySearch(items, "demo");
  }
}

async function connectRepository() {
  const fullName = els.repoFullName.value.trim();
  if (!fullName) return;

  const payload = {
    full_name: fullName,
  };

  try {
    const dashboard = await requestJson("/api/connect", {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 20000,
    });
    renderDashboard(dashboard);
    setView("issues");
    void logAuditEvent(
      "frontend",
      "connect_repository",
      "Submitted repository connection request",
      {
        repository: fullName,
        source: dashboard.source || "demo",
      },
    );
  } catch (error) {
    alert(`Unable to connect repository: ${error.message}`);
  }
}

async function refreshIssues() {
  try {
    const response = await requestJson("/api/ingest", {
      method: "POST",
      timeoutMs: 12000,
    });
    renderDashboard({
      ...state.dashboard,
      connection: response.connection,
      issues: response.issues,
      stats: response.stats,
      source: response.source,
      message: response.message,
    });
    setView("issues");
    void logAuditEvent(
      "frontend",
      "refresh_issues",
      "Requested issue refresh",
      {
        repository: state.dashboard?.connection?.full_name || "demo",
        source: response.source || "demo",
      },
    );
  } catch (error) {
    alert(`Unable to refresh issues: ${error.message}`);
  }
}

function renderRepositorySearch(items, source = "demo") {
  els.searchSource.textContent = source;
  els.repoResults.innerHTML = items.length
    ? items
        .map(
          (repo) => `
            <article class="group rounded-2xl border border-border bg-panel p-4 transition hover:-translate-y-0.5 hover:border-border hover:bg-panel2">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-base font-semibold text-blue transition group-hover:underline">${repo.full_name}</h3>
                  <p class="mt-2 text-sm leading-6 text-muted">${repo.description || "No description provided."}</p>
                </div>
                <button class="connect-repo rounded-lg border border-border bg-canvas px-3 py-1.5 text-xs text-text transition hover:bg-panel2" type="button" data-full-name="${repo.full_name}">
                  Connect
                </button>
              </div>
              <div class="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span class="inline-flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-blue"></span>${repo.language || "Unknown"}
                </span>
                <span>${repo.stars ?? 0} stars</span>
                <span>${repo.open_issues ?? 0} open issues</span>
                <span>${repo.updated_at ? formatDate(repo.updated_at) : "Recently updated"}</span>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="rounded-2xl border border-dashed border-border bg-panel p-4 text-sm text-muted">No repositories found.</div>`;

  els.repoResults.querySelectorAll(".connect-repo").forEach((button) => {
    button.addEventListener("click", () => {
      els.repoFullName.value = button.dataset.fullName || "";
      connectRepository();
    });
  });
}

function renderIssueList(issues) {
  els.issueList.innerHTML = issues.length
    ? issues
        .map(
          (issue) => `
            <article
              class="group grid gap-4 rounded-2xl border border-border bg-canvas p-4 transition hover:-translate-y-0.5 hover:border-border hover:bg-panel2 sm:grid-cols-[auto_minmax(0,1fr)_auto]"
              role="button"
              tabindex="0"
              data-issue-number="${issue.number}"
            >
              <div class="pt-1">
                <span class="inline-flex h-2.5 w-2.5 rounded-full ${severityDot(issue.state)}"></span>
              </div>
              <div class="min-w-0">
                <div class="flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>#${issue.number}</span>
                  <span class="inline-flex rounded-full border border-border bg-panel2 px-2 py-0.5">${issue.state}</span>
                </div>
                <h3 class="mt-2 text-base font-semibold text-text transition group-hover:text-blue">${issue.title}</h3>
                <p class="mt-2 text-sm leading-6 text-muted">${issue.body_preview}</p>
                <div class="mt-3 flex flex-wrap gap-2">
                  ${(issue.labels || [])
                    .map(
                      (label) =>
                        `<span class="rounded-full border border-border bg-panel px-2.5 py-1 text-xs text-muted">${label}</span>`,
                    )
                    .join("")}
                </div>
              </div>
              <div class="flex flex-col items-start gap-2 text-xs text-muted sm:items-end">
                <span class="rounded-full border border-border bg-panel px-2.5 py-1 text-xs text-text">${issue.comments} comments</span>
                <span>${formatDate(issue.updated_at)}</span>
                <span class="max-w-[220px] text-right leading-5">${issue.author || "Unknown author"}</span>
              </div>
            </article>
          `,
        )
        .join("")
    : `<div class="rounded-2xl border border-dashed border-border bg-panel p-4 text-sm text-muted">No issues are currently ingested for this repository.</div>`;

  els.issueList.querySelectorAll("[data-issue-number]").forEach((row) => {
    const issueNumber = Number(row.dataset.issueNumber);
    const open = () => openIssue(issueNumber);
    row.addEventListener("click", open);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });
}

function updateText(ids, value) {
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });
}

function updateLabels(ids, labels) {
  const markup = (labels || [])
    .map(
      (label) =>
        `<span class="inline-flex rounded-full border border-border bg-panel px-2.5 py-1 text-xs text-muted">${label}</span>`,
    )
    .join("");

  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = markup;
  });
}

function updateLinks(url) {
  [els.detailUrl, els.modalUrl].forEach((link) => {
    if (link) link.href = url || "#";
  });
}

function recommendationMarkup(result, issue) {
  if (!result) {
    return {
      status: "Waiting",
      kind: "idle",
      body: `
        <div class="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
          Click an issue to ask Codex for a recommended fix.
        </div>
      `,
    };
  }

  return {
    status: result.source || "heuristic",
    kind: result.source || "heuristic",
    body: `
      <div class="grid gap-3">
        <div class="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <span class="rounded-full border px-2.5 py-1 text-xs font-medium ${severityTone(result.severity)}">${result.severity}</span>
              <span class="text-sm font-semibold text-text">#${issue.number}</span>
            </div>
            <span class="text-xs text-muted">${result.confidence} confidence</span>
          </div>
          <h5 class="mt-3 text-base font-semibold text-text">${result.bug_type}</h5>
          <p class="mt-2 text-sm leading-6 text-muted">${result.rationale}</p>
        </div>

        <div class="rounded-2xl border border-border bg-panel p-4">
          <div class="text-xs uppercase tracking-[0.14em] text-muted">Recommended fix</div>
          <p class="mt-2 text-sm leading-6 text-text">${result.fix_suggestion}</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-2xl border border-border bg-panel p-4">
            <div class="text-xs uppercase tracking-[0.14em] text-muted">Likely root cause</div>
            <p class="mt-2 text-sm leading-6 text-text">${result.root_cause}</p>
          </div>
          <div class="rounded-2xl border border-border bg-panel p-4">
            <div class="text-xs uppercase tracking-[0.14em] text-muted">Affected module</div>
            <p class="mt-2 text-sm leading-6 text-text">${result.affected_module}</p>
          </div>
        </div>
      </div>
    `,
  };
}

function renderRecommendation(result, issue) {
  const content = recommendationMarkup(result, issue);
  recommendationTargets.forEach(({ status, body }) => {
    if (status) {
      status.textContent = content.status;
      status.className = `rounded-full border px-3 py-1 text-xs ${recommendationTone(content.kind)}`;
    }
    if (body) {
      body.innerHTML = content.body;
    }
  });
}

function renderRecommendationLoading(issue) {
  recommendationTargets.forEach(({ status, body }) => {
    if (status) {
      status.textContent = "Analyzing...";
      status.className = `rounded-full border px-3 py-1 text-xs ${recommendationTone("loading")}`;
    }
    if (body) {
      body.innerHTML = `
        <div class="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">
          Codex is reviewing issue #${issue.number} and preparing a recommendation.
        </div>
      `;
    }
  });
}

function demoRecommendation(issue) {
  const runResult = demoTriageRuns
    .flatMap((run) => run.results || [])
    .find((result) => result.issue_number === issue.number);

  if (runResult) {
    return runResult;
  }

  const text =
    `${issue.title} ${issue.body_preview} ${(issue.labels || []).join(" ")}`.toLowerCase();
  const severity =
    text.includes("crash") || text.includes("freeze")
      ? "P1"
      : text.includes("timeout")
        ? "P2"
        : "P3";
  return {
    issue_number: issue.number,
    severity,
    bug_type:
      text.includes("ui") || text.includes("layout") || text.includes("mobile")
        ? "UI"
        : "Logic",
    affected_module:
      text.includes("backend") || text.includes("api")
        ? "backend/api"
        : "frontend/ui",
    root_cause:
      "The issue appears to come from a missing guard or incomplete handling of the reported workflow.",
    fix_suggestion:
      "Reproduce the issue, patch the broken path, and add a regression test before merging.",
    confidence: "Medium",
    rationale:
      "This is a local fallback recommendation generated when the backend is unavailable.",
    source: "demo",
  };
}

async function loadIssueRecommendation(issue) {
  if (!issue) return;

  if (state.recommendations[issue.number]) {
    renderRecommendation(state.recommendations[issue.number], issue);
    return;
  }

  renderRecommendationLoading(issue);

  try {
    const result = await requestJson(
      `/api/issues/${issue.number}/recommendation`,
      { timeoutMs: 20000 },
    );
    state.recommendations[issue.number] = result;
    if (state.selectedIssue?.number === issue.number) {
      renderRecommendation(result, issue);
    }
    void logAuditEvent(
      "frontend",
      "issue_recommendation",
      "Loaded issue recommendation",
      {
        issue_number: issue.number,
        source: result.source || "heuristic",
        severity: result.severity || "unknown",
      },
    );
  } catch (error) {
    const fallback = demoRecommendation(issue);
    state.recommendations[issue.number] = fallback;
    renderRecommendation(fallback, issue);
    void logAuditEvent(
      "frontend",
      "issue_recommendation",
      "Used fallback issue recommendation",
      {
        issue_number: issue.number,
        source: "demo",
        severity: fallback.severity || "unknown",
      },
    );
    console.warn(`Using demo recommendation for issue #${issue.number}`, error);
  }
}

function renderIssueDetails(issue) {
  if (!issue) return;

  updateText(fieldPairs.number, `#${issue.number}`);
  updateText(fieldPairs.title, issue.title);
  updateText(fieldPairs.state, issue.state);
  updateText(fieldPairs.comments, `${issue.comments}`);
  updateText(fieldPairs.updated, formatDate(issue.updated_at));
  updateText(fieldPairs.author, issue.author || "Unknown");
  updateText(fieldPairs.body, issue.body_preview || "No description provided.");
  updateLabels(fieldPairs.labels, issue.labels || []);
  updateText(fieldPairs.meta, `Last updated ${formatDate(issue.updated_at)}`);
  updateLinks(issue.html_url);

  renderRecommendationLoading(issue);
}

function openIssue(issueNumber) {
  const issue =
    state.dashboard?.issues?.find((item) => item.number === issueNumber) ||
    null;
  if (!issue) return;
  state.selectedIssue = issue;
  renderIssueDetails(issue);
  loadIssueRecommendation(issue);
  setView("details");
  els.detailModal.classList.remove("hidden");
  els.detailModal.classList.add("flex");
  void logAuditEvent("frontend", "open_issue", "Opened issue detail view", {
    issue_number: issue.number,
    title: issue.title,
  });
}

function closeModal() {
  els.detailModal.classList.add("hidden");
  els.detailModal.classList.remove("flex");
}

function renderConnection(dashboard) {
  const connection = dashboard.connection;
  const repo = connection?.repository;

  els.sidebarRepoName.textContent = repo
    ? repo.full_name
    : "No repository connected";
  els.sidebarRepoDescription.textContent =
    repo?.description || "Connect a repository to start ingesting open issues.";
  els.sidebarRepoMeta.innerHTML = repo
    ? `
      <span class="rounded-full border border-border bg-panel2 px-2.5 py-1">${connection?.source || "demo"}</span>
      <span class="rounded-full border border-border bg-panel2 px-2.5 py-1">${repo.language || "Unknown"}</span>
      <span class="rounded-full border border-border bg-panel2 px-2.5 py-1">${repo.open_issues} open</span>
    `
    : `<span class="rounded-full border border-border bg-panel2 px-2.5 py-1">Disconnected</span>`;

  els.connectionStatus.innerHTML = connection
    ? `
      <div class="space-y-2">
        <div class="font-semibold text-text">${connection.full_name}</div>
        <div>Source: ${connection.source}</div>
        <div>Status: ${connection.status}</div>
        <div>Connected: ${formatDate(connection.connected_at)}</div>
        <div>Last sync: ${formatDate(connection.last_sync_at)}</div>
        <div class="pt-2 text-xs text-muted">${dashboard.message || "Ready"}</div>
      </div>
    `
    : `<div class="text-muted">No connection yet.</div>`;

  els.statOpenIssues.textContent = String(dashboard.stats?.open_issues ?? 0);
  els.statLabels.textContent = String(dashboard.stats?.labels ?? 0);
  els.statComments.textContent = String(dashboard.stats?.comments ?? 0);

  renderRepositorySearch(
    dashboard.repositories || [],
    dashboard.source || "demo",
  );
  renderIssueList(dashboard.issues || []);

  state.selectedIssue = dashboard.issues?.[0] || null;
  if (state.selectedIssue) {
    renderIssueDetails(state.selectedIssue);
    loadIssueRecommendation(state.selectedIssue);
  }
}

function renderDashboard(dashboard) {
  state.dashboard = dashboard;
  renderConnection(dashboard);
}

function triageTone(level) {
  if (level === "success") return "text-green";
  if (level === "error") return "text-red";
  return "text-blue";
}

function severityTone(severity) {
  if (severity === "P0") return "border-red bg-red/10 text-red";
  if (severity === "P1") return "border-yellow bg-yellow/10 text-yellow";
  if (severity === "P2") return "border-blue bg-blue/10 text-blue";
  if (severity === "P3") return "border-green bg-green/10 text-green";
  return "border-border bg-panel2 text-muted";
}

function renderTriageRuns(runs) {
  const latest = runs[0] || null;
  els.triageRunCount.textContent = String(runs.length);
  els.triageProcessedCount.textContent = String(latest?.processed_issues ?? 0);
  els.triageStatus.textContent = latest ? latest.status : "Idle";
  els.triageSource.textContent = latest?.source || "heuristic";

  if (!latest) {
    els.triageResults.innerHTML =
      '<div class="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">Run the agent to see triage results here.</div>';
    return;
  }

  els.triageResults.innerHTML = latest.results.length
    ? latest.results
        .map(
          (result) => `
            <article class="rounded-2xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:bg-panel2">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span class="rounded-full border px-2.5 py-1 text-xs font-medium ${severityTone(result.severity)}">${result.severity}</span>
                  <span class="text-sm font-semibold text-text">#${result.issue_number}</span>
                </div>
                <span class="text-xs text-muted">${result.confidence} confidence</span>
              </div>
              <h5 class="mt-3 text-base font-semibold text-text">${result.bug_type}</h5>
              <p class="mt-2 text-sm text-muted">${result.rationale}</p>
              <dl class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-border bg-panel p-3">
                  <dt class="text-xs uppercase tracking-[0.14em] text-muted">Module</dt>
                  <dd class="mt-2 text-sm font-semibold text-text">${result.affected_module}</dd>
                </div>
                <div class="rounded-xl border border-border bg-panel p-3">
                  <dt class="text-xs uppercase tracking-[0.14em] text-muted">Source</dt>
                  <dd class="mt-2 text-sm font-semibold text-text">${result.source}</dd>
                </div>
              </dl>
            </article>
          `,
        )
        .join("")
    : '<div class="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">The run has started, but results are not ready yet.</div>';
}

function renderTriageEvents(events) {
  els.triageLiveFeed.innerHTML = events.length
    ? events
        .slice(0, 8)
        .map(
          (event) => `
            <article class="rounded-2xl border border-border bg-panel p-3">
              <div class="flex items-center justify-between gap-3">
                <span class="text-xs uppercase tracking-[0.14em] ${triageTone(event.level)}">${event.level}</span>
                <span class="text-xs text-muted">${formatDate(event.timestamp)}</span>
              </div>
              <p class="mt-2 text-sm leading-6 text-text">${event.message}</p>
              ${
                event.issue_number
                  ? `<div class="mt-2 text-xs text-muted">Issue #${event.issue_number}</div>`
                  : ""
              }
            </article>
          `,
        )
        .join("")
    : '<div class="rounded-2xl border border-dashed border-border bg-white p-4 text-sm text-muted">Live events will appear here during a triage run.</div>';
}

function applyTriageState(payload) {
  state.triageRuns = payload.runs || [];
  state.triageEvents = payload.events || [];
  renderTriageRuns(state.triageRuns);
  renderTriageEvents(state.triageEvents);
}

async function loadTriageState() {
  try {
    const [runsResponse, eventsResponse] = await Promise.all([
      requestJson("/api/triage/runs", { timeoutMs: 8000 }),
      requestJson("/api/triage/events?limit=50", { timeoutMs: 8000 }),
    ]);
    applyTriageState({
      runs: runsResponse.runs,
      events: eventsResponse.events,
    });
  } catch (error) {
    console.warn("Using demo triage state", error);
    applyTriageState({
      runs: demoTriageRuns,
      events: demoTriageEvents,
    });
  }
}

function connectTriageSocket() {
  if (state.triageSocket) {
    state.triageSocket.close();
  }

  try {
    const socket = new WebSocket(`${WS_BASE}/ws/triage`);
    state.triageSocket = socket;
    els.triageLiveState.textContent = "Connecting";

    socket.addEventListener("open", () => {
      els.triageLiveState.textContent = "Live";
    });

    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.type === "snapshot") {
        state.triageEvents = payload.events || [];
      } else if (payload.message) {
        state.triageEvents = [payload, ...state.triageEvents];
      }
      renderTriageEvents(state.triageEvents);
      refreshTriageRunsQuietly();
    });

    socket.addEventListener("close", () => {
      els.triageLiveState.textContent = "Disconnected";
    });

    socket.addEventListener("error", () => {
      els.triageLiveState.textContent = "Demo";
      applyTriageState({ runs: demoTriageRuns, events: demoTriageEvents });
    });
  } catch {
    els.triageLiveState.textContent = "Demo";
    applyTriageState({ runs: demoTriageRuns, events: demoTriageEvents });
  }
}

async function refreshTriageRunsQuietly() {
  try {
    const response = await requestJson("/api/triage/runs", { timeoutMs: 8000 });
    state.triageRuns = response.runs || [];
    renderTriageRuns(state.triageRuns);
  } catch {
    // Keep the current view if polling fails.
  }
}

async function startTriageRun() {
  const repo =
    state.dashboard?.connection?.full_name ||
    els.repoFullName.value.trim() ||
    "zohreh-mousavinasab/Web-Scraper";
  els.triageStatus.textContent = "Starting...";
  els.runAgent.disabled = true;
  try {
    const response = await requestJson("/api/triage/run", {
      method: "POST",
      body: JSON.stringify({
        repository_full_name: repo,
        use_demo: state.dashboard?.source !== "github",
      }),
      timeoutMs: 12000,
    });

    state.activeRunId = response.run.run_id;
    els.triageStatus.textContent = "Running";
    void logAuditEvent(
      "frontend",
      "start_triage_run",
      "Started triage run from the dashboard",
      {
        repository: repo,
        run_id: response.run.run_id,
        source: response.run.source || "heuristic",
      },
    );
    if (state.triagePolling) {
      window.clearInterval(state.triagePolling);
    }
    state.triagePolling = window.setInterval(async () => {
      await refreshTriageRunsQuietly();
      const current = state.triageRuns.find(
        (run) => run.run_id === state.activeRunId,
      );
      if (current && current.status === "completed") {
        els.triageStatus.textContent = "Completed";
        window.clearInterval(state.triagePolling);
        state.triagePolling = null;
        await refreshTriageRunsQuietly();
      }
    }, 700);
    await refreshTriageRunsQuietly();
    setView("issues");
  } catch (error) {
    alert(`Unable to start triage run: ${error.message}`);
    els.triageStatus.textContent = "Idle";
  } finally {
    els.runAgent.disabled = false;
  }
}

els.viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setView(button.dataset.view);
    void logAuditEvent("frontend", "switch_view", "Switched dashboard view", {
      view: button.dataset.view || "unknown",
    });
  });
});

els.repoSearch.addEventListener("input", (event) => {
  state.repoQuery = event.target.value;
  searchRepositories(state.repoQuery);
});

els.globalSearch.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  if (!query) {
    renderRepositorySearch(
      state.dashboard?.repositories || demoDashboard.repositories,
      state.dashboard?.source || "demo",
    );
    renderIssueList(state.dashboard?.issues || demoDashboard.issues);
    return;
  }

  const repos = (
    state.dashboard?.repositories || demoDashboard.repositories
  ).filter((repo) =>
    [repo.full_name, repo.description, repo.language, repo.owner]
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
  const issues = (state.dashboard?.issues || demoDashboard.issues).filter(
    (issue) =>
      [issue.title, issue.body_preview, issue.author, ...(issue.labels || [])]
        .join(" ")
        .toLowerCase()
        .includes(query),
  );
  renderRepositorySearch(repos, state.dashboard?.source || "demo");
  renderIssueList(issues);
});

els.connectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  connectRepository();
});

els.refreshButton.addEventListener("click", refreshIssues);
els.demoButton.addEventListener("click", async () => {
  try {
    const dashboard = await requestJson("/api/connect", {
      method: "POST",
      body: JSON.stringify({
        full_name: "zohreh-mousavinasab/Web-Scraper",
        use_demo: true,
      }),
      timeoutMs: 8000,
    });
    renderDashboard(dashboard);
    setView("issues");
    void logAuditEvent(
      "frontend",
      "load_demo",
      "Loaded demo repository snapshot",
      {
        repository: "zohreh-mousavinasab/Web-Scraper",
      },
    );
  } catch {
    renderDashboard(demoDashboard);
  }
});
els.ingestButton.addEventListener("click", refreshIssues);
els.runAgent.addEventListener("click", startTriageRun);
els.detailRefresh.addEventListener("click", refreshIssues);
els.auditRefresh.addEventListener("click", () => {
  void loadAuditLog();
});
els.openDetail.addEventListener("click", () => {
  if (state.selectedIssue) {
    renderIssueDetails(state.selectedIssue);
    els.detailModal.classList.remove("hidden");
    els.detailModal.classList.add("flex");
  }
});
els.closeDetail.addEventListener("click", closeModal);
els.detailModal.addEventListener("click", (event) => {
  if (event.target === els.detailModal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
  if (event.key === "/" && document.activeElement !== els.globalSearch) {
    event.preventDefault();
    els.globalSearch.focus();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  renderDashboard(demoDashboard);
  setView("repository");

  void loadDashboard();
  void loadTriageState();
  void loadAuditLog();
  connectTriageSocket();
});
