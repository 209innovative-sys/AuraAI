import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  // If we returned from a redirect flow, finalize and navigate.
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          nav("/dashboard");
        }
      })
      .catch(() => {
        /* ignore if no redirect occurred */
      });
  }, [nav]);

  const onEmail = async (e) => {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setErr("");
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
      nav("/dashboard");
    } catch (e) {
      // Fallback to redirect only for popup-related issues
      if (e?.code === "auth/popup-blocked" || e?.code === "auth/popup-closed-by-user") {
        try {
          await signInWithRedirect(auth, googleProvider);
          return; // redirect will reload; effect above will handle success
        } catch (e2) {
          setErr(e2.message);
        }
      } else {
        setErr(e.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Sign In</h2>
      <form onSubmit={onEmail} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={busy} type="submit">
          Sign In
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <button disabled={busy} onClick={onGoogle}>
          Sign In with Google
        </button>
      </div>
      {err && <div style={{ color: "crimson", marginTop: 12 }}>{err}</div>}
      <div style={{ marginTop: 12 }}>
        No account? <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}
