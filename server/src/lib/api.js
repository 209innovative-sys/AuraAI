const RAW_BASE = (import.meta.env.VITE_API_BASE_URL || "").trim();

if (!/^https?:\/\//i.test(RAW_BASE)) {
  throw new Error(
    `VITE_API_BASE_URL must be an absolute URL (e.g. https://auraai-live.onrender.com). Got: "${RAW_BASE}"`
  );
}

const BASE_URL = RAW_BASE.replace(/\/+$/, "");

async function authlessJson(path, body) {
  const res = await fetch(`${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });

    const text = await res.text();
    let json;
    try { json = text ? JSON.parse(text) : {}; } catch { throw new Error(text || `Bad JSON (${res.status})`); }
    if (!res.ok) throw new Error(json?.error || text || `HTTP ${res.status}`);
    return json;
}

export const Api = {
  analyze: (input) => authlessJson("/analyze", { input }),
};
