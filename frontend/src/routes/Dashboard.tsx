import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { AnalysisCard } from "../components/AnalysisCard";
import { useAuth } from "../context/AuthContext";
import { AnalysisDoc, getAnalysesForUser } from "../lib/analysisStore";

function formatDate(ts?: number): string {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleDateString();
  } catch {
    return "";
  }
}

function vibeLabelFromDoc(a: AnalysisDoc): string {
  if (a.overallVibe === "calm") return "Calm / Warm";
  if (a.overallVibe === "tense") return "Tense";
  return "Mixed";
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);

    getAnalysesForUser(user.uid)
      .then((list) => {
        setAnalyses(list);
      })
      .catch((err) => {
        console.error("Failed to load analyses", err);
        setError("Failed to load analyses");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  return (
    <Layout>
      <div className="aura-card mb-4">
        <h1 className="aura-heading">Your analyses</h1>
        <p className="text-sm text-slate-400 mb-3">
          Each analysis shows the vibe of one conversation. Start a new one anytime.
        </p>
        {loading && <p className="text-xs text-slate-400">Loading...</p>}
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {!loading && !error && analyses.length === 0 && (
          <p className="text-xs text-slate-400">
            No analyses yet. Click "New Analysis" to create one.
          </p>
        )}
        {!loading &&
          !error &&
          analyses.map((a) => (
            <AnalysisCard
              key={a.id}
              id={a.id}
              title={a.title}
              date={formatDate(a.createdAt)}
              vibeLabel={vibeLabelFromDoc(a)}
            />
          ))}
      </div>
    </Layout>
  );
};
