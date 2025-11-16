import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { analyzeConversation } from "../api/apiClient";

export const NewAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [relationshipType, setRelationshipType] = useState("Partner");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!text.trim()) {
      setError("Please paste your chat before analyzing.");
      return;
    }

    console.log("[NewAnalysis] Submit started");
    setLoading(true);

    // Watchdog: if the request never finishes, stop "Analyzing..." after 30s
    const timeoutId = window.setTimeout(() => {
      console.warn("[NewAnalysis] Analyze timeout hit (30s)");
      setLoading(false);
      setError("Analysis is taking too long. Please try again or shorten the conversation.");
    }, 30000);

    try {
      const result = await analyzeConversation({
        text,
        title: title || "Untitled conversation",
        relationshipType
      });

      console.log("[NewAnalysis] Analyze result:", result);

      // Pass the result + meta into router state
      navigate("/analysis/demo", {
        state: {
          result,
          title: title || "Untitled conversation",
          relationshipType
        }
      });
    } catch (err: any) {
      console.error("[NewAnalysis] Analyze error:", err);
      const msg =
        typeof err?.message === "string"
          ? err.message
          : "Failed to analyze conversation. Please try again.";
      setError(msg);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
      console.log("[NewAnalysis] Submit finished");
    }
  };

  return (
    <Layout>
      <div className="aura-card space-y-4">
        <h1 className="aura-heading">New analysis</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1 text-sm">
            <label className="text-slate-300">Label this conversation</label>
            <input
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='e.g. "Talk after fight"'
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-slate-300">Relationship type</label>
            <select
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value)}
            >
              <option>Partner</option>
              <option>Ex</option>
              <option>Situationship</option>
              <option>Friend</option>
              <option>Family</option>
            </select>
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-slate-300">Paste your chat</label>
            <textarea
              className="w-full min-h-[200px] rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste messages here in order..."
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>We do not need phone numbers or last names—just the messages.</span>
          </div>

          {error && (
            <p className="text-xs text-rose-400">
              {error}
            </p>
          )}

          <button type="submit" className="aura-button-primary" disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Vibe"}
          </button>
        </form>
      </div>
    </Layout>
  );
};
