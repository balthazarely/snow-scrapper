"use client";

import { useApp } from "@/context/AppContext";
import BottomNav from "./BottomNav";
import { useEffect } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { requestLocation, userLocation, locationError } = useApp();

  useEffect(() => {
    requestLocation();
  }, []);

  console.log("[Home] render:", { userLocation, locationError });

  return (
    <div className="flex flex-col h-dvh pt-[env(safe-area-inset-top)] bg-slate-100">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
