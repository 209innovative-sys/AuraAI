import React, { useState } from "react"
import { auth, googleProvider } from "../../lib/firebase"
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  const onEmail = async (e) => {
    e.preventDefault()
    setErr("")
    setBusy(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      nav("/dashboard")
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  const onGoogle = async () => {
    setErr("")
    setBusy(true)
    try {
      await signInWithPopup(auth, googleProvider)
      nav("/dashboard")
    } catch (e) {
      setErr(e.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Sign Up</h2>
      <form onSubmit={onEmail} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button disabled={busy} type="submit">Create Account</button>
      </form>
      <div style={{ marginTop: 12 }}>
        <button disabled={busy} onClick={onGoogle}>Continue with Google</button>
      </div>
      {err && <div style={{ color: "crimson", marginTop: 12 }}>{err}</div>}
      <div style={{ marginTop: 12 }}>
        Have an account? <Link to="/signin">Sign In</Link>
      </div>
    </div>
  )
}