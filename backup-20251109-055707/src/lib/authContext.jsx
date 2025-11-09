import React, { createContext, useContext, useEffect, useState } from "react";
import { watchAuth } from "./firebase";
import { Api } from "./api";

const AuthContext = createContext({
  user: null,
  loading: true,
  subscription: null,
  refreshSubscription: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadSub() {
    if (!user) {
      setSubscription(null);
      return;
    }
    try {
      const res = await Api.getSubscriptionStatus();
      setSubscription(res);
    } catch (e) {
      console.error("Failed to load subscription", e);
      setSubscription({ isPro: false });
    }
  }

  useEffect(() => {
    const unsub = watchAuth((fbUser) => {
      if (fbUser) {
        setUser({ uid: fbUser.uid, email: fbUser.email });
      } else {
        setUser(null);
        setSubscription(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (user) loadSub();
  }, [user && user.uid]);

  return (
    <AuthContext.Provider
      value={{ user, loading, subscription, refreshSubscription: loadSub }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
