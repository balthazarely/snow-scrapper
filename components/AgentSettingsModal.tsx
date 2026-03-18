"use client";

import Image from "next/image";
import { useUserPrefs } from "@/context/UserPrefsContext";
import { useApp } from "@/context/AppContext";

type Props = {
  onClose: () => void;
};

export default function AgentSettingsModal({ onClose }: Props) {
  const { prefs, setPass, setUseLocation } = useUserPrefs();
  const { userLocation, requestLocation } = useApp();

  function handleLocationToggle(enabled: boolean) {
    setUseLocation(enabled);
    if (enabled && !userLocation) {
      requestLocation();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Sheet */}
      <div
        className="relative z-10 w-full sm:max-w-sm bg-white rounded-t-2xl sm:rounded-2xl p-6 mb-[calc(4rem+env(safe-area-inset-bottom))] sm:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900">Agent Settings</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Pass selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Pass Type
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
                        ? "border-sky-500 bg-sky-50"
                        : "border-zinc-200 bg-white"
                    }`}
                  >
                    {option === null ? (
                      <span className="text-sm font-medium text-zinc-500">
                        None
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Image
                          src={`/${option}.png`}
                          alt={option}
                          width={option === "Ikon" ? 18 : 26}
                          height={10}
                          className="object-contain"
                        />
                        <span className="text-xs font-semibold text-zinc-700">
                          {option}
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-700">
                Use my location
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Helps find resorts near you
              </p>
            </div>
            <button
              onClick={() => handleLocationToggle(!prefs.useLocation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                prefs.useLocation ? "bg-sky-500" : "bg-zinc-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  prefs.useLocation ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
