import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-black text-slate-100">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
