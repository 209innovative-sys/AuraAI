import React, { useState } from "react"
import { analyzeText } from "../lib/api"

export default function Analyze() {
  const [text, setText] = useState("")
  const [result, setResult] = useState(null)
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr("")
    setResult(null)
    setBusy(true)
    try {
      const data = await analyzeText(text)
      setResult(data)
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "20px auto", padding: 20 }}>
      <h2>Analyze My Message</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <textarea
          rows={6}
          placeholder="Paste a message or conversation snippet..."
          value={text}
          onChange={e=>setText(e.target.value)}
          required
        />
        <button disabled={busy} type="submit">Analyze</button>
      </form>
      {busy && <div style={{ marginTop: 12 }}>Analyzing...</div>}
      {err && <div style={{ color: "crimson", marginTop: 12 }}>{err}</div>}
      {result && (
        <pre style={{ background: "#f7f7f7", padding: 12, marginTop: 12, whiteSpace: "pre-wrap" }}>
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}