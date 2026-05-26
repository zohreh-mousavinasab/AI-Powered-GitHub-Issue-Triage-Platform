from __future__ import annotations

import json
import ssl
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass

try:
    import certifi
except ImportError:  # pragma: no cover
    certifi = None

from .models import IssueSummary, RepositorySummary


class GitHubAPIError(RuntimeError):
    pass


@dataclass(frozen=True)
class GitHubClient:
    timeout: int = 20

    def _request_json(self, url: str, token: str | None = None) -> object:
        headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "BugMind/0.1",
        }
        if token:
            headers["Authorization"] = f"Bearer {token}"

        context = ssl.create_default_context(cafile=certifi.where()) if certifi else ssl.create_default_context()
        request = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=self.timeout, context=context) as response:
                payload = response.read().decode("utf-8")
                return json.loads(payload)
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode("utf-8", errors="ignore")
            raise GitHubAPIError(f"GitHub API request failed ({exc.code}): {detail or exc.reason}") from exc
        except urllib.error.URLError as exc:
            raise GitHubAPIError(f"GitHub API request failed: {exc.reason}") from exc

    def search_repositories(self, query: str, token: str | None = None, limit: int = 5) -> list[RepositorySummary]:
        encoded = urllib.parse.quote(query)
        url = f"https://api.github.com/search/repositories?q={encoded}&per_page={limit}"
        payload = self._request_json(url, token)
        items = payload.get("items", []) if isinstance(payload, dict) else []
        return [self._to_repository_summary(item) for item in items]

    def get_repository(self, full_name: str, token: str | None = None) -> RepositorySummary:
        url = f"https://api.github.com/repos/{full_name}"
        payload = self._request_json(url, token)
        if not isinstance(payload, dict):
            raise GitHubAPIError("Unexpected repository payload")
        return self._to_repository_summary(payload)

    def list_open_issues(self, full_name: str, token: str | None = None, limit: int = 100) -> list[IssueSummary]:
        url = f"https://api.github.com/repos/{full_name}/issues?state=open&per_page={limit}"
        payload = self._request_json(url, token)
        if not isinstance(payload, list):
            raise GitHubAPIError("Unexpected issues payload")

        issues: list[IssueSummary] = []
        for item in payload:
            if not isinstance(item, dict) or "pull_request" in item:
                continue
            issues.append(self._to_issue_summary(item))
        return issues

    @staticmethod
    def _to_repository_summary(item: dict) -> RepositorySummary:
        owner = item.get("owner", {})
        return RepositorySummary(
            full_name=item.get("full_name", ""),
            name=item.get("name", ""),
            owner=owner.get("login", "") if isinstance(owner, dict) else "",
            description=item.get("description"),
            language=item.get("language"),
            stars=int(item.get("stargazers_count") or 0),
            open_issues=int(item.get("open_issues_count") or 0),
            html_url=item.get("html_url"),
            updated_at=item.get("updated_at"),
        )

    @staticmethod
    def _to_issue_summary(item: dict) -> IssueSummary:
        labels = item.get("labels", [])
        label_names = [label.get("name", "") for label in labels if isinstance(label, dict)]
        body = (item.get("body") or "").strip()
        preview = body[:240].replace("\n", " ")
        if len(body) > 240:
            preview += "..."
        user = item.get("user", {})
        return IssueSummary(
            number=int(item.get("number") or 0),
            title=item.get("title", ""),
            state=item.get("state", "open"),
            labels=label_names,
            comments=int(item.get("comments") or 0),
            updated_at=item.get("updated_at", ""),
            html_url=item.get("html_url", ""),
            body_preview=preview or "No description provided.",
            author=user.get("login") if isinstance(user, dict) else None,
        )
