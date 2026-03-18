"use client";

import { useUserPrefs } from "@/context/UserPrefsContext";
import Image from "next/image";

type Props = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: Props) {
  const { prefs, setPass } = useUserPrefs();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative z-10 w-full sm:max-w-sm bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl p-6 mb-[calc(5rem+env(safe-area-inset-bottom))] sm:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Your Pass
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["Epic", "Ikon", null] as const).map((option) => {
              const isSelected = prefs.pass === option;
              return (
                <button
                  key={String(option)}
                  onClick={() => setPass(option)}
                  className={`flex items-center justify-center h-12 rounded-xl border-2 transition-all ${
                    isSelected
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                  }`}
                >
                  {option === null ? (
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      None
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={`/${option}.png`}
                        alt={option}
                        width={option === "Ikon" ? 18 : 26}
                        height={10}
                        className="object-contain rounded-sm ring-1 ring-white/70"
                      />
                      <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                        {option}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
