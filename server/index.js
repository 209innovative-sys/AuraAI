import express from "express";
import cors from "cors";
import "dotenv/config";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * CORS — reflect the request Origin so preflight works on
 * both your production and preview Vercel URLs.
 * Also explicitly enable OPTIONS and HEAD.
 */
const corsOptions = {
  origin: true, // reflect request origin
  methods: ["GET", "POST", "OPTIONS", "HEAD"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false, // not sending cookies; '*' would be fine but we reflect origin
};
app.use(cors(corsOptions));
// Explicitly handle preflight for analyze and any other route
app.options("/analyze", cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));

// Root health (per your contract)
app.get("/", (req, res) => {
  res.json({ ok: true, service: "AuraAI backend", status: "running" });
});

// Optional secondary health
app.get("/health", (req, res) => res.json({ ok: true }));

// OpenAI client
const openaiKey = process.env.OPENAI_API_KEY;
if (!openaiKey) {
  console.warn("⚠️  Missing OPENAI_API_KEY in server/.env or platform env");
}
const openai = new OpenAI({ apiKey: openaiKey });

/**
 * POST /analyze
 * Accepts { text } (preferred) or { input } (legacy).
 * Returns { ok: true, analysis }.
 */
app.post("/analyze", async (req, res) => {
  try {
    const text = (req.body && (req.body.text ?? req.body.input)) || "";
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Missing 'text' (string)" });
    }

    const trimmed = text.slice(0, 4000);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content:
            "You are AuraAI. Return a concise vibe analysis: tone, trust, manipulation, risk, empathy.",
        },
        { role: "user", content: trimmed },
      ],
    });

    const analysis = completion?.choices?.[0]?.message?.content || "";
    return res.json({ ok: true, analysis });
  } catch (e) {
    console.error("Error in /analyze:", e);
    return res
      .status(500)
      .json({ error: "Analyze failed", detail: e?.message || "unknown error" });
  }
});

// HEAD handler for some proxies / monitors
app.head("/analyze", (req, res) => res.sendStatus(204));

// Catch-all 404 after real routes
app.all("/*", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start
app.listen(PORT, () => {
  console.log(`✅ AuraAI backend running on port ${PORT}`);
});

