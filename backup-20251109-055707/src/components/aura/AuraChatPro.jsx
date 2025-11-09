import React, { useState } from "react";
import { Api } from "../../lib/api";
import { useAuthContext } from "../../lib/authContext";
import { Paywall } from "../paywall/Paywall";

export function AuraChatPro() {
  const { subscription } = useAuthContext();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!subscription || !subscription.isPro) {
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Aura Pro Deep Analysis</h3>
        <p className="text-sm text-slate-300">
          This deep-dive is available for Aura Pro members.
        </p>
        <Paywall />
      </div>
    );
  }

  const onSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse(null);
    try {
      const res = await Api.auraPro(input);
      setResponse(res.output || "No response");
    } catch (e) {
      setResponse(e.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Aura Pro Deep Analysis</h3>
      <textarea
        rows={6}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste full conversations for a deep breakdown..."
      />
      <button onClick={onSend} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze with Aura Pro"}
      </button>
      {response && (
        <pre className="mt-2 p-3 bg-slate-900 rounded text-sm whitespace-pre-wrap">
          {response}
        </pre>
      )}
    </div>
  );
}
