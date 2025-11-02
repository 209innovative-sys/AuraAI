import { useState } from "react";
import { firebaseAuth } from "../firebase-config";
import { signOut } from "firebase/auth";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const logout = () => signOut(firebaseAuth);

  const analyze = async () => {
    if (!text) return;
    setLoading(true);
    setResult("");

    try {
      const r = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await r.json();
      setResult(data.result || "No result");
    } catch {
      setResult("?? Error analyzing message");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h2 style={{ fontSize: "26px", color: "#C084FC" }}>Romantic Vibe Analyzer ??</h2>
      <textarea
        style={{ width: "100%", height: 120, marginTop: 20 }}
        placeholder="Paste message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={analyze} disabled={loading}>
        {loading ? "Reading their heart..." : "Analyze Message"}
      </button>
      {result && (
        <div style={{ marginTop: 20, padding: 15, border: "1px solid purple" }}>
          {result}
        </div>
      )}
      <button style={{ marginTop: 25 }} onClick={logout}>Logout</button>
    </div>
  );
}
