"use client";

import { useState } from "react";
import AIAgent from "@/components/AiAgent";
import AgentSettingsModal from "@/components/AgentSettingsModal";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { MdWifiOff } from "react-icons/md";

export default function AgentPage() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isOnline = useOnlineStatus();

  return (
    <div className="bg-slate-100 dark:bg-zinc-900 min-h-full pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)] p-4">
      {settingsOpen && (
        <AgentSettingsModal onClose={() => setSettingsOpen(false)} />
      )}

      <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Snow Agent</h1>
      <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
        Ask our AI any questions you have.
      </p>

      {!isOnline ? (
        <div className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-6 py-12 text-center">
          <MdWifiOff size={36} className="text-zinc-400 dark:text-zinc-500" />
          <p className="text-base font-semibold text-zinc-700 dark:text-zinc-200">You're offline</p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">The Snow Agent requires an internet connection. Please reconnect to ask questions.</p>
        </div>
      ) : (
        <AIAgent onOpenSettings={() => setSettingsOpen(true)} />
      )}
    </div>
  );
}
