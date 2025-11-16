import React from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (err) {
      console.error("Error logging out", err);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto aura-card space-y-4">
        <h1 className="aura-heading">Profile & Settings</h1>
        <div className="space-y-1 text-sm">
          <div className="text-slate-400">Email</div>
          <div className="text-slate-100">{user?.email ?? "Unknown"}</div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="text-slate-400">Plan</div>
          <div className="text-slate-100">Free</div>
        </div>
        <button onClick={onLogout} className="aura-button-secondary mt-2">
          Log out
        </button>
        <p className="text-[11px] text-slate-500">
          This view will later show more account details and upgrade options.
        </p>
      </div>
    </Layout>
  );
};
