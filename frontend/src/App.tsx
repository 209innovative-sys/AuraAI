import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthPage } from "./routes/Auth";
import { DashboardPage } from "./routes/Dashboard";
import { NewAnalysisPage } from "./routes/NewAnalysis";
import { AnalysisDetailPage } from "./routes/AnalysisDetail";
import { ProfilePage } from "./routes/Profile";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-300">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <NewAnalysisPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analysis/:id"
        element={
          <ProtectedRoute>
            <AnalysisDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
