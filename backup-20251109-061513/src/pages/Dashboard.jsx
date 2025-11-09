import React from "react"
import { useAuth } from "../components/auth/AuthProvider.jsx"

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <p>Welcome {user?.email || "friend"}.</p>
      <p>You're signed in. Explore your vibes.</p>
    </div>
  )
}