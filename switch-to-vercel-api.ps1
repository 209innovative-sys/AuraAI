# switch-to-vercel-api.ps1
# Purpose: Remove Render/Firebase Functions dependency for OpenAI; use Vercel /api instead.
# - Creates api/analyze.js (Vercel serverless function)
# - Points client to same-origin /api/analyze (no CORS)
# - Adds .env.example hints
# - Optional: adds Vite dev proxy to Vercel dev on :3000 so local dev can use `vercel dev`

$ErrorActionPreference = "Stop"
function Say($m, $c = "Cyan") { Write-Host $m -ForegroundColor $c }
$ts = Get-Date -Format "yyyyMMddHHmmss"

# 0) Sanity: ensure src exists
if (!(Test-Path "src")) { Say "No src/ folder found here: $(Get-Location). Run from your project root." "Red"; exit 1 }

# 1) Create api/ and function file
if (!(Test-Path "api")) { New-Item -ItemType Directory "api" | Out-Null }
if (Test-Path "api\analyze.js") {
  Copy-Item "api\analyze.js" "api\analyze.backup.$ts.js" -Force
  Say "Backed up api\analyze.js -> api\analyze.backup.$ts.js" "Yellow"
}

@'
import OpenAI from "openai";

// Vercel Serverless Function: POST /api/analyze
export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    // Mostly unnecessary on same-origin, but harmless
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const { input } = (req.body || {});
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Missing 'input' string" });
    }

    const openai = new OpenAI({ apiKey: key });

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: "You are AuraAI. Return a concise vibe analysis: tone, trust, manipulation, risk, empathy." },
        { role: "user", content: input.slice(0, 4000) }
      ]
    });

    const output = completion.choices?.[0]?.message?.content || "";
    return res.status(200).json({ output });
  } catch (e) {
    console.error("analyze error", e);
    return res.status(500).json({ error: "Analyze failed" });
  }
}
'@ | Out-File -Encoding utf8 "api\analyze.js" -Force
Say "Wrote api\analyze.js (Vercel serverless function)" "Green"

# 2) Wire client to same-origin /api/analyze
if (!(Test-Path "src\lib")) { New-Item -ItemType Directory "src\lib" | Out-Null }
if (Test-Path "src\lib\api.js") {
  Copy-Item "src\lib\api.js" "src\lib\api.backup.$ts.js" -Force
  Say "Backed up src\lib\api.js -> src\lib\api.backup.$ts.js" "Yellow"
}
@'
async function postJson(path, body) {
  const res = await fetch(path.startsWith("/") ? path : `/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  const text = await res.text();
  let json;
  try { json = text ? JSON.parse(text) : {}; } catch { throw new Error(text || `Bad JSON (${res.status})`); }
  if (!res.ok) throw new Error(json?.error || text || `HTTP ${res.status}`);
  return json;
}

export const Api = {
  analyze: (input) => postJson("/api/analyze", { input }),
};
'@ | Out-File -Encoding utf8 "src\lib\api.js" -Force
Say "Wrote src\lib\api.js (client now calls same-origin /api/analyze)" "Green"

# 3) Ensure Vite config exists; add dev proxy to vercel dev if needed
$viteCfg = Get-ChildItem -Path . -Filter "vite.config.*" | Select-Object -First 1
if (-not $viteCfg) {
  @'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// Dev tip: run `vercel dev` in another terminal to serve /api/* at http://localhost:3000
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
'@ | Out-File -Encoding utf8 "vite.config.mts" -Force
  Say "Created vite.config.mts with /api proxy to vercel dev (:3000)" "Yellow"
}
else {
  Say "vite.config already present. If you want local API in dev, add a proxy for /api to http://localhost:3000 and run `vercel dev`." "Yellow"
}

# 4) Append env examples (frontend never needs OPENAI key)
if (Test-Path ".env.example") {
  $content = Get-Content ".env.example" -Raw
  if ($content -notmatch "VITE_API_BASE_URL") {
    Add-Content ".env.example" "`n# Not needed when using same-origin /api, leave empty or omit"
    Add-Content ".env.example" "VITE_API_BASE_URL="
  }
}
else {
  "VITE_API_BASE_URL=" | Out-File -Encoding utf8 ".env.example"
}

Say "`nNEXT STEPS (copy-paste):" "Green"
Say "1) In Vercel → Project → Settings → Environment Variables, set:" "Cyan"
Say "   - OPENAI_API_KEY = your real OpenAI key (Server, not client)" "Cyan"
Say "2) Deploy to Vercel (git push, or 'vercel --prod')." "Cyan"
Say "3) Visit your site → run an analysis. It will POST to /api/analyze (same origin, no CORS)." "Cyan"
Say "4) For local dev with API: in one terminal run 'vercel dev' (port 3000). In another, 'npm run dev' (Vite on 5173)." "Cyan"
Say "   The Vite proxy will forward /api calls to vercel dev." "Cyan"
