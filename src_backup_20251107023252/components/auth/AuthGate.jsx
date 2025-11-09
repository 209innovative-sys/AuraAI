import React from 'react';
import { useAuthContext } from '../../lib/authContext';
import { loginWithGoogle } from '../../lib/firebase';

export function AuthGate({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-lg">Sign in to use AuraAI Live</p>
        <button onClick={loginWithGoogle}>Continue with Google</button>
      </div>
    );
  }

  return <>{children}</>;
}
