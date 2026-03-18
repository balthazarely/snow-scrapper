"use client";

import Image from "next/image";
import { useUserPrefs } from "@/context/UserPrefsContext";
import { useApp } from "@/context/AppContext";

type Props = {
  onClose: () => void;
};

export default function AgentSettingsModal({ onClose }: Props) {
  const { prefs, setPass, setUseLocation } = useUserPrefs();
  const { userLocation, locationError, requestLocation } = useApp();
  const locationDenied = locationError?.includes("denied");

  function handleLocationToggle(enabled: boolean) {
    setUseLocation(enabled);
    if (enabled && !userLocation) {
      requestLocation();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative z-10 w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Agent Settings</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Pass selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
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
                          width={18}
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

          {/* Location toggle */}
          <div className={`flex items-center justify-between ${locationDenied ? "opacity-50" : ""}`}>
            <div>
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                Use my location
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
                {locationDenied
                  ? "Enable location in your device settings"
                  : "Helps find resorts near you"}
              </p>
            </div>
            <button
              disabled={!!locationDenied}
              onClick={() => handleLocationToggle(!prefs.useLocation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                locationDenied ? "cursor-not-allowed bg-zinc-200 dark:bg-zinc-700" : prefs.useLocation ? "bg-sky-500" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  prefs.useLocation && !locationDenied ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {locationDenied && (
            <p className="text-xs text-amber-500 bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 rounded-xl px-3 py-2">
              Location access was denied. To enable, update permissions in your device or browser settings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
