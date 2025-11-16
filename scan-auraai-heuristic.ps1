param(
    [string]$RootPath = (Get-Location).Path
)

Write-Host "Using root path: $RootPath"

$frontendSrc = Join-Path $RootPath "frontend\src"
$serverSrc   = Join-Path $RootPath "server\src"

if (-not (Test-Path $frontendSrc)) {
    Write-Host "frontend\\src not found at $frontendSrc" -ForegroundColor Yellow
}
if (-not (Test-Path $serverSrc)) {
    Write-Host "server\\src not found at $serverSrc" -ForegroundColor Yellow
}

$patterns = @(
    "heuristic",
    "heuristics",
    "Using heuristic analysis only",
    "heuristic analysis only"
)

foreach ($pattern in $patterns) {
    Write-Host ""
    Write-Host "=== Pattern: $pattern ===" -ForegroundColor Cyan

    if (Test-Path $frontendSrc) {
        Get-ChildItem -Path $frontendSrc -Recurse -Include *.ts,*.tsx,*.js,*.jsx |
            Select-String -Pattern $pattern -SimpleMatch -ErrorAction SilentlyContinue |
            ForEach-Object {
                "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()
            }
    }

    if (Test-Path $serverSrc) {
        Get-ChildItem -Path $serverSrc -Recurse -Include *.ts,*.tsx,*.js,*.jsx |
            Select-String -Pattern $pattern -SimpleMatch -ErrorAction SilentlyContinue |
            ForEach-Object {
                "{0}:{1}: {2}" -f $_.Path, $_.LineNumber, $_.Line.Trim()
            }
    }
}
