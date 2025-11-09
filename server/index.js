import "dotenv/config"
import express from "express"
import cors from "cors"
import { z } from "zod"
import OpenAI from "openai"

const app = express()

const allowedOrigin = process.env.ALLOWED_ORIGIN || "*"
app.use(cors({ origin: allowedOrigin }))
app.use(express.json({ limit: "1mb" }))

const openaiApiKey = process.env.OPENAI_API_KEY
if (!openaiApiKey) {
  console.warn("[WARN] OPENAI_API_KEY not set. /analyze will fail until configured.")
}
const openai = new OpenAI({ apiKey: openaiApiKey })

app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

const AnalyzeSchema = z.object({
  text: z.string().min(1).max(8000)
})

app.post("/analyze", async (req, res) => {
  try {
    const parsed = AnalyzeSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.flatten() })
    }

    const { text } = parsed.data

    if (!openaiApiKey) {
      return res.status(500).json({ error: "Server missing OPENAI_API_KEY" })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You analyze emotional tone, sentiment, and interpersonal dynamics succinctly."
        },
        {
          role: "user",
          content: `Analyze the emotional tone and vibe of this text:\n\n${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    })

    const output = completion.choices?.[0]?.message?.content ?? "(no content)"

    return res.json({
      ok: true,
      analysis: output
    })
  } catch (err) {
    console.error("Analyze error:", err)
    return res.status(500).json({ error: "Internal error" })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})