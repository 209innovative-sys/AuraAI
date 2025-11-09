import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../../lib/firebase'
import { onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const signOut = () => fbSignOut(auth)

  return (
    <AuthCtx.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthCtx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function AuthGate({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>
  if (!user) return <div style={{ padding: 20 }}>You must be signed in.</div>
  return children
}