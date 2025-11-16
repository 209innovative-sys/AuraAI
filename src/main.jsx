import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import AppRouter from "./router.jsx"
import { AuthProvider } from "./components/auth/AuthProvider.jsx"
import { initGA } from "./lib/analytics";

initGA();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
