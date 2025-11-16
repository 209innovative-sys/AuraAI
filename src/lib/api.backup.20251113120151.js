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
