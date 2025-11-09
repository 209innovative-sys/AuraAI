import { useState } from "react";
import { firebaseAuth } from "../firebase/firebase";
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
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data.result || "No response");
    } catch {
      setResult("?? Analyzer Failed");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", marginTop: "60px", textAlign: "center" }}>
      <h1 style={{ color: "#c084fc" }}>Romantic Vibe Analyzer ??</h1>
      <textarea
        style={{ width: "100%", height: "120px", marginTop: "20px" }}
        placeholder="Paste message here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={analyze} disabled={loading} style={{ marginTop: "20px", width: "100%" }}>
        {loading ? "Reading vibes..." : "Analyze Message"}
      </button>

      {result && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid purple" }}>
          {result}
        </div>
      )}

      <button onClick={logout} style={{ marginTop: "30px" }}>Logout</button>
    </div>
  );
}
