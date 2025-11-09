import React from "react"
import { Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home.jsx"
import SignIn from "./components/auth/SignIn.jsx"
import SignUp from "./components/auth/SignUp.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Analyze from "./pages/Analyze.jsx"
import NotFound from "./pages/NotFound.jsx"
import { AuthGate, useAuth } from "./components/auth/AuthProvider.jsx"

function NavBar() {
  const { user, signOut } = useAuth()
  return (
    <nav style={{display:"flex", gap:"12px", padding:"10px", borderBottom:"1px solid #eee"}}>
      <Link to="/">Home</Link>
      <Link to="/analyze">Analyze</Link>
      {user ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <>
          <Link to="/signin">Sign In</Link>
          <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  )
}

export default function AppRouter() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route
          path="/dashboard"
          element={
            <AuthGate>
              <Dashboard />
            </AuthGate>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}