"use client";

import { useApp } from "@/context/AppContext";
import { useUserPrefs } from "@/context/UserPrefsContext";
import BottomNav from "./BottomNav";
import { useEffect } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { requestLocation } = useApp();
  const { prefs } = useUserPrefs();

  useEffect(() => {
    requestLocation();
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (prefs.darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [prefs.darkMode]);

  return (
    <div className="flex flex-col h-dvh pt-[env(safe-area-inset-top)] bg-slate-100 dark:bg-zinc-900">
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
