import React from "react";
import { AuthGate } from "../components/auth/AuthGate";
import { AuraChatFree } from "../components/aura/AuraChatFree";
import { AuraChatPro } from "../components/aura/AuraChatPro";

export function Dashboard() {
  return (
    <AuthGate>
      <div className="grid gap-6 md:grid-cols-2">
        <AuraChatFree />
        <AuraChatPro />
      </div>
    </AuthGate>
  );
}
