import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "./AppShell";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Pricing } from "./pages/Pricing";
import { Account } from "./pages/Account";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <Landing /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "pricing", element: <Pricing /> },
      { path: "account", element: <Account /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
