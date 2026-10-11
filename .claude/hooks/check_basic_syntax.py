#!/usr/bin/env python3
"""PostToolUse (Write|Edit) : signale des accolades ou parenthèses déséquilibrées dans un .js/.css.

Équivalent macOS/Linux de check-basic-syntax.ps1 (stdlib uniquement). Ne remplace pas un linter.
"""
import json
import os
import re
import sys


def main():
    try:
        payload = json.load(sys.stdin)
    except Exception:
        return 0

    path = (payload.get("tool_input") or {}).get("file_path") or (payload.get("tool_response") or {}).get("filePath")
    if not path or not re.search(r"\.(js|css)$", path) or not os.path.isfile(path):
        return 0

    try:
        with open(path, encoding="utf-8") as handle:
            content = handle.read()
    except (OSError, UnicodeDecodeError):
        return 0
    if not content:
        return 0

    problems = []
    if content.count("{") != content.count("}"):
        problems.append(f"accolades desequilibrees ({content.count('{')} '{{' vs {content.count('}')} '}}')")
    if content.count("(") != content.count(")"):
        problems.append(f"parentheses desequilibrees ({content.count('(')} '(' vs {content.count(')')} ')')")
    if not problems:
        return 0

    message = (
        f"Verification basique de {os.path.basename(path)} : " + "; ".join(problems)
        + ". Ceci ne remplace pas un vrai linter - relis le fichier."
    )
    print(json.dumps({
        "systemMessage": message,
        "hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": message},
    }))
    return 0


if __name__ == "__main__":
    sys.exit(main())
