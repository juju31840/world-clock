#!/usr/bin/env python3
"""PreToolUse (Bash) : bloque `git commit` si un .js stagé contient un console.log() non commenté.

Équivalent macOS/Linux de block-console-log.ps1 (stdlib uniquement).
"""
import json
import re
import subprocess
import sys


def git(*args):
    try:
        out = subprocess.run(["git", *args], capture_output=True, text=True, check=False)
    except OSError:
        return ""
    return out.stdout if out.returncode == 0 else ""


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    command = (payload.get("tool_input") or {}).get("command") or ""
    if not re.search(r"\bgit\s+commit\b", command):
        return 0

    staged = [f for f in git("diff", "--cached", "--name-only", "--diff-filter=ACM", "--", "*.js").splitlines() if f.strip()]
    if not staged:
        return 0

    violations = []
    for path in staged:
        content = git("show", f":{path}")
        if not content:
            continue
        for number, line in enumerate(content.splitlines(), start=1):
            log_idx = line.find("console.log(")
            if log_idx < 0:
                continue
            comment_idx = line.find("//")
            if 0 <= comment_idx < log_idx:
                continue
            violations.append(f"{path}:{number}  {line.strip()}")

    if not violations:
        return 0

    reason = (
        f"Commit bloque : console.log() present dans {len(violations)} endroit(s) parmi les fichiers .js stages :\n\n"
        + "\n".join(violations)
        + "\n\nSupprime ces console.log() ou commente-les explicitement (// console.log(...)) avant de committer."
    )
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": reason,
        }
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
