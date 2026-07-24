$stdin = [Console]::In.ReadToEnd()
try { $payload = $stdin | ConvertFrom-Json } catch { exit 0 }

$file = $payload.tool_input.file_path
if (-not $file) { $file = $payload.tool_response.filePath }
if (-not $file) { exit 0 }
if ($file -notmatch '\.(js|css)$') { exit 0 }
if (-not (Test-Path $file)) { exit 0 }

$content = Get-Content -Path $file -Raw -ErrorAction SilentlyContinue
if (-not $content) { exit 0 }

$openBrace = ([regex]::Matches($content, '\{')).Count
$closeBrace = ([regex]::Matches($content, '\}')).Count
$openParen = ([regex]::Matches($content, '\(')).Count
$closeParen = ([regex]::Matches($content, '\)')).Count

$problems = @()
if ($openBrace -ne $closeBrace) { $problems += "accolades desequilibrees ($openBrace '{' vs $closeBrace '}')" }
if ($openParen -ne $closeParen) { $problems += "parentheses desequilibrees ($openParen '(' vs $closeParen ')')" }

if ($problems.Count -eq 0) { exit 0 }

$relFile = Split-Path $file -Leaf
$msg = "Verification basique de $relFile : " + ($problems -join '; ') + ". Ceci ne remplace pas un vrai linter (Node n'est pas installe sur cette machine) - relis le fichier."
$out = @{
  systemMessage = $msg
  hookSpecificOutput = @{
    hookEventName = "PostToolUse"
    additionalContext = $msg
  }
}
$out | ConvertTo-Json -Compress
exit 0
