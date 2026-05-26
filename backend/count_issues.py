from __future__ import annotations

import os
import sys
from pathlib import Path

from app.github_client import GitHubClient, GitHubAPIError


def load_env_file() -> None:
    env_path = Path(__file__).resolve().parents[1] / ".env"
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


def main(argv: list[str]) -> int:
    load_env_file()

    repo_full_name = argv[1] if len(argv) > 1 else "kimai/kimai"
    token = os.getenv("GITHUB_TOKEN") or None
    github = GitHubClient()

    try:
        issues = github.list_open_issues(repo_full_name, token=token)
    except GitHubAPIError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    print(f"Open issues in {repo_full_name}: {len(issues)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
