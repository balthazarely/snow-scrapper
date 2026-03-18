"use client";

import Image from "next/image";
import { MdSettings } from "react-icons/md";
import { useUserPrefs } from "@/context/UserPrefsContext";

type Props = {
  onOpenSettings: () => void;
};

export default function UserPrefsCard({ onOpenSettings }: Props) {
  const { prefs } = useUserPrefs();

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
            Your Pass
          </p>
          {prefs.pass ? (
            <div className="flex items-center gap-2">
              <Image
                src={`/${prefs.pass}.png`}
                alt={prefs.pass}
                width={32}
                height={16}
                className="object-contain rounded-sm ring-1 ring-white/70"
              />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {prefs.pass}
              </span>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 dark:text-zinc-500">No pass selected</p>
          )}
        </div>
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <MdSettings size={14} />
          My Pass Type
        </button>
      </div>
    </div>
  );
}
