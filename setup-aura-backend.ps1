<# 
setup-aura-backend.ps1

Creates a minimal backend in /server that matches your existing frontend:

- POST /analyze
- Listens on port 4000
- CORS enabled for local dev
- Returns a fake but valid JSON analysis so "Failed to fetch" goes away

You can later plug in real OpenAI logic inside /analyze.
#>

function Info($msg) { Write-Host "➜ $msg" -ForegroundColor Cyan }
function Done($msg) { Write-Host "✅ $msg" -ForegroundColor Green }
function Warn($msg) { Write-Host "⚠ $msg" -ForegroundColor Yellow }
function Fail($msg) { Write-Host "❌ $msg" -ForegroundColor Red; exit 1 }

if (-not (Test-Path "package.json")) {
  Fail "Run this from your project root (where package.json lives)."
}

# Create server directory
if (-not (Test-Path "server")) {
  Info "Creating server/ directory..."
  New-Item -ItemType Directory -Path "server" | Out-Null
} else {
  Info "server/ directory already exists."
}

# Create server/package.json
$pkgPath = "server/package.json"
if (-not (Test-Path $pkgPath)) {
@"
{
  "name": "auraai-backend",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
"@ | Out-File $pkgPath -Encoding UTF8 -NoNewline
  Info "Created server/package.json"
} else {
  Info "server/package.json already exists. Not overwriting."
}

# Create server/.env.example
$envExamplePath = "server/.env.example"
if (-not (Test-Path $envExamplePath)) {
@"
# Backend-only secrets (NOT committed in real .env)
OPENAI_API_KEY=your-openai-key-here
PORT=4000
"@ | Out-File $envExamplePath -Encoding UTF8 -NoNewline
  Info "Created server/.env.example"
}

# Create server/index.js if missing
$indexPath = "server/index.js"
if (-not (Test-Path $indexPath)) {
@"
import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ ok: true, service: "AuraAI backend", status: "running" });
});

// POST /analyze
app.post("/analyze", async (req, res) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "No text provided" });
    }

    // TODO: plug real OpenAI call here using process.env.OPENAI_API_KEY.
    // For now, return a deterministic fake response so frontend works.

    const length = text.length;
    const vibe =
      length < 40 ? "brief" :
      length < 120 ? "neutral" :
      "intense";

    const score = Math.min(0.99, (length % 87) / 100);

    res.json({
      ok: true,
      vibe,
      score,
      summary: "Demo analysis from AuraAI backend. Wiring is correct.",
      meta: { length }
    });
  } catch (err) {
    console.error("Error in /analyze:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(\`AuraAI backend running on port \${PORT}\`);
});
"@ | Out-File $indexPath -Encoding UTF8 -NoNewline
  Info "Created server/index.js"
} else {
  Info "server/index.js already exists. Not overwriting."
}

# Ensure server/.env is gitignored
$gitignorePath = ".gitignore"
if (Test-Path $gitignorePath) {
  $gi = Get-Content $gitignorePath -Raw
  if ($gi -notmatch "server/.env") {
    Add-Content $gitignorePath "`nserver/.env"
    Info "Added server/.env to .gitignore"
  }
}

Done "Backend scaffold complete.

NEXT:
1. cd server
2. npm install
3. npm start
4. In .env.local (frontend), ensure:
   VITE_API_BASE_URL=http://localhost:4000
Then reload your app and click Analyze."
