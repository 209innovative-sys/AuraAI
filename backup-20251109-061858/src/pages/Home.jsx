import React from "react"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>AuraAI Live</h1>
      <p>Paste your conversations. Get instant emotional intelligence & vibe analysis.</p>
      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link to="/analyze"><button>Free Aura Scan</button></Link>
        <Link to="/dashboard"><button>Go to Dashboard</button></Link>
      </div>
    </div>
  )
}