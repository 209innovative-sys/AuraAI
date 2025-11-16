# patch-server.ps1
$ErrorActionPreference = "Stop"
function Say($m,$c="Cyan"){ Write-Host $m -ForegroundColor $c }

# Ensure server dir
if (!(Test-Path "server")) { New-Item -ItemType Directory server | Out-Null }

# Backup old files
$ts = Get-Date -Format "yyyyMMddHHmmss"
if (Test-Path "server\index.js") {
  Copy-Item "server\index.js" "server\index.backup.$ts.js" -Force
  Say "Backed up server\index.js -> server\index.backup.$ts.js" "Yellow"
}
if (Test-Path "server\package.json") {
  Copy-Item "server\package.json" "server\package.backup.$ts.json" -Force
  Say "Backed up server\package.json -> server\package.backup.$ts.json" "Yellow"
}

# Write package.json
@'
{
  "name": "auraai-server",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "engines": {
    "node": ">=18"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "openai": "^4.67.0"
  }
}
'@ | Out-File -Encoding utf8 server\package.json -Force

# Write index.js
@'
import express from "express";
import cors from "cors";
import { config as loadEnv } from "dotenv";
import OpenAI from "openai";

loadEnv();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://auraai-live-2309dqam1-phillips-projects-8e47c9d9.vercel.app"
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS: " + origin), false);
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  console.warn("⚠️  Missing OPENAI_API_KEY in server env");
}
const openai = new OpenAI({ apiKey: openaiKey });

app.post("/analyze", async (req, res) => {
  try {
    const { input } = req.body || {};
    if (!input || typeof input !== "string") {
      return res.status(400).json({ error: "Missing 'input' (string)" });
    }
    const trimmed = input.slice(0, 4000);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: "You are AuraAI. Return concise vibe analysis: tone, trust, manipulation, risk, empathy." },
        { role: "user", content: trimmed }
      ]
    });

    const output = completion.choices?.[0]?.message?.content || "";
    return res.json({ output });
  } catch (e) {
    console.error("Analyze error:", e);
    return res.status(500).json({ error: "Analyze failed" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true }));

app.all("/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  console.log(`✅ AuraAI server listening on :${PORT}`);
});
'@ | Out-File -Encoding utf8 server\index.js -Force

# Install deps
Push-Location server
Say "Installing server dependencies..." "Yellow"
npm install

Say "Starting server (CTRL+C to stop)..." "Green"
npm start
Pop-Location
