param(
    [string]$RootPath = (Get-Location).Path,
    [string]$ProdApiBaseUrl = "https://auraai-1-zips.onrender.com"
)

Write-Host "Using root path: $RootPath"

$frontendPath   = Join-Path $RootPath "frontend"
$envExamplePath = Join-Path $frontendPath ".env.example"

if (-not (Test-Path $frontendPath)) {
    Write-Host "frontend directory not found at $frontendPath" -ForegroundColor Red
    exit 1
}

$lines = @(
    "# Example env for AuraAI frontend",
    "",
    "# API base URL (prod backend on Render)",
    "VITE_API_BASE_URL=$ProdApiBaseUrl",
    "",
    "# Firebase client config",
    "VITE_FIREBASE_API_KEY=...",
    "VITE_FIREBASE_AUTH_DOMAIN=...",
    "VITE_FIREBASE_PROJECT_ID=...",
    "VITE_FIREBASE_STORAGE_BUCKET=...",
    "VITE_FIREBASE_MESSAGING_SENDER_ID=...",
    "VITE_FIREBASE_APP_ID=...",
    "VITE_FIREBASE_MEASUREMENT_ID=..."  # optional
)

Set-Content -Path $envExamplePath -Value $lines -Encoding UTF8

Write-Host "Wrote frontend\.env.example with:"
Write-Host "  VITE_API_BASE_URL=$ProdApiBaseUrl"
Write-Host "  VITE_FIREBASE_* placeholders"
