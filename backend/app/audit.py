from __future__ import annotations

from pathlib import Path
from threading import RLock
from typing import Any

from .models import now_iso

ROOT_DIR = Path(__file__).resolve().parents[2]
AUDIT_LOG_PATH = ROOT_DIR / "audit_log.txt"

_lock = RLock()


def _format_details(details: dict[str, Any] | None) -> str:
    if not details:
        return ""

    parts: list[str] = []
    for key, value in details.items():
        if value is None or value == "":
            continue
        parts.append(f"{key}={value}")
    return " | details: " + ", ".join(parts) if parts else ""


def format_audit_line(source: str, action: str, message: str, details: dict[str, Any] | None = None) -> str:
    timestamp = now_iso()
    return f"{timestamp} | {source} | {action} | {message}{_format_details(details)}"


def append_audit_event(source: str, action: str, message: str, details: dict[str, Any] | None = None) -> str:
    line = format_audit_line(source, action, message, details)
    with _lock:
        AUDIT_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        with AUDIT_LOG_PATH.open("a", encoding="utf-8") as handle:
            handle.write(line + "\n")
    return line


def read_audit_log(limit: int = 100) -> list[str]:
    if limit <= 0:
        return []

    with _lock:
        if not AUDIT_LOG_PATH.exists():
            return []
        lines = AUDIT_LOG_PATH.read_text(encoding="utf-8").splitlines()
    return lines[-limit:]
