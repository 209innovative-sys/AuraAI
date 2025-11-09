const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"

async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`
  const resp = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => "")
    throw new Error(`API ${resp.status}: ${text || resp.statusText}`)
  }
  return resp.json()
}

export async function analyzeText(text) {
  return apiFetch("/analyze", {
    method: "POST",
    body: JSON.stringify({ text })
  })
}