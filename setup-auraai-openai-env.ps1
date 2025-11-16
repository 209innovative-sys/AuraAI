param(
    [string]$RootPath = (Get-Location).Path
)

Write-Host "Using root path: $RootPath"

$serverEnvPath = Join-Path $RootPath "server\.env"

if (-not (Test-Path (Split-Path $serverEnvPath))) {
    Write-Host "Creating server directory (if missing)..."
    New-Item -ItemType Directory -Path (Split-Path $serverEnvPath) -Force | Out-Null
}

if (-not (Test-Path $serverEnvPath)) {
    Write-Host "Creating empty server\.env ..."
    New-Item -ItemType File -Path $serverEnvPath -Force | Out-Null
}

Write-Host ""
Write-Host "Enter your OpenAI API key. It will be written to server\.env"
$openaiKey = Read-Host "OPENAI_API_KEY (sk-...)"

if (-not $openaiKey) {
    Write-Host "No key entered. Aborting." -ForegroundColor Red
    exit 1
}

# Read existing content, if any
$existing = @()
if (Test-Path $serverEnvPath) {
    $existing = Get-Content $serverEnvPath -ErrorAction SilentlyContinue
}

# Helper: upsert a single KEY=VALUE line
function Set-Or-AddLine {
    param(
        [string[]]$Lines,
        [string]$Key,
        [string]$Value
    )
    $pattern = "^\s*$Key\s*="
    $found = $false
    $result = @()

    foreach ($line in $Lines) {
        if ($line -match $pattern) {
            if (-not $found) {
                $result += "$Key=$Value"
                $found = $true
            }
            # skip old duplicates
        }
        else {
            $result += $line
        }
    }

    if (-not $found) {
        $result += "$Key=$Value"
    }

    return $result
}

$newContent = $existing

# Ensure key values
$newContent = Set-Or-AddLine -Lines $newContent -Key "OPENAI_API_KEY"   -Value $openaiKey
$newContent = Set-Or-AddLine -Lines $newContent -Key "OPENAI_MODEL"     -Value "gpt-4.1-mini"
$newContent = Set-Or-AddLine -Lines $newContent -Key "PORT"             -Value "4000"
$newContent = Set-Or-AddLine -Lines $newContent -Key "CORS_ORIGIN"      -Value "http://localhost:5173,https://auraai.vercel.app"

Set-Content -Path $serverEnvPath -Value $newContent -Encoding UTF8

Write-Host ""
Write-Host "Updated $serverEnvPath with:"
Write-Host "  OPENAI_API_KEY=*** (hidden)"
Write-Host "  OPENAI_MODEL=gpt-4.1-mini"
Write-Host "  PORT=4000"
Write-Host "  CORS_ORIGIN=http://localhost:5173,https://auraai.vercel.app"
