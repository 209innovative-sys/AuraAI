import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      navigate("/");
    } catch (err: any) {
      console.error("Auth error", err);
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showHeaderActions={false}>
      <div className="max-w-md mx-auto aura-card">
        <h1 className="aura-heading">
          {mode === "login" ? "Log in to AuraAI" : "Create your AuraAI account"}
        </h1>
        <p className="text-sm text-slate-400 mb-4">
          Paste your conversations, upload screenshots, and get instant emotional insight.
        </p>
        <div className="flex gap-2 mb-4 text-xs">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-xl border ${
              mode === "login"
                ? "border-indigo-500 bg-indigo-600/20 text-slate-50"
                : "border-slate-700 text-slate-300"
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-xl border ${
              mode === "signup"
                ? "border-indigo-500 bg-indigo-600/20 text-slate-50"
                : "border-slate-700 text-slate-300"
            }`}
          >
            Sign Up
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1 text-sm">
            <label className="text-slate-300">Email</label>
            <input
              type="email"
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1 text-sm">
            <label className="text-slate-300">Password</label>
            <input
              type="password"
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-xs text-rose-400 bg-rose-900/30 border border-rose-700/40 rounded-xl px-3 py-2">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="aura-button-primary w-full mt-2"
            disabled={loading}
          >
            {loading
              ? "Working..."
              : mode === "login"
              ? "Log In"
              : "Create Account"}
          </button>
        </form>
      </div>
    </Layout>
  );
};
