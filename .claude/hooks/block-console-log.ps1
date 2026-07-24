$stdin = [Console]::In.ReadToEnd()
try { $payload = $stdin | ConvertFrom-Json } catch { exit 0 }

$command = $payload.tool_input.command
if (-not $command) { exit 0 }
if ($command -notmatch '\bgit\s+commit\b') { exit 0 }

$stagedFilesRaw = git diff --cached --name-only --diff-filter=ACM -- '*.js' 2>$null
if (-not $stagedFilesRaw) { exit 0 }

$stagedFiles = $stagedFilesRaw -split "`r?`n" | Where-Object { $_.Trim() -ne '' }
if ($stagedFiles.Count -eq 0) { exit 0 }

$violations = @()
foreach ($file in $stagedFiles) {
  $staged = git show ":$file" 2>$null
  if (-not $staged) { continue }
  $lines = $staged -split "`r?`n"
  for ($i = 0; $i -lt $lines.Count; $i++) {
    $line = $lines[$i]
    $logIdx = $line.IndexOf('console.log(')
    if ($logIdx -lt 0) { continue }
    $commentIdx = $line.IndexOf('//')
    $isCommented = ($commentIdx -ge 0) -and ($commentIdx -lt $logIdx)
    if (-not $isCommented) {
      $violations += "$($file):$($i + 1)  $($line.Trim())"
    }
  }
}

if ($violations.Count -eq 0) { exit 0 }

$msg = "Commit bloque : console.log() present dans " + $violations.Count + " endroit(s) parmi les fichiers .js stages :`n`n" + ($violations -join "`n") + "`n`nSupprime ces console.log() ou commente-les explicitement (// console.log(...)) avant de committer."
$out = @{
  hookSpecificOutput = @{
    hookEventName = "PreToolUse"
    permissionDecision = "deny"
    permissionDecisionReason = $msg
  }
}
$out | ConvertTo-Json -Compress -Depth 5
exit 0
