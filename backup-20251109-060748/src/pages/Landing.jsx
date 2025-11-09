import React from "react";
import { Link } from "react-router-dom";
import { AuraChatFree } from "../components/aura/AuraChatFree";

export function Landing() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">AuraAI Live</h1>
      <p className="text-slate-300">
        Paste your conversations. Get instant emotional intelligence & vibe analysis.
      </p>
      <Link to="/dashboard">
        <button>Go to Dashboard</button>
      </Link>
      <div className="mt-4">
        <AuraChatFree />
      </div>
    </div>
  );
}
