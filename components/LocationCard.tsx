"use client";

import { useApp } from "@/context/AppContext";
import { MdLocationOn, MdLocationOff } from "react-icons/md";

export default function LocationCard() {
  const { userLocation, locationLoading, locationError, requestLocation } = useApp();

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
      <div className="p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
          Your Location
        </p>
        {userLocation ? (
          <div className="flex items-center gap-2">
            <MdLocationOn className="text-sky-500 text-lg shrink-0" />
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">GPS acquired</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <MdLocationOff className="text-zinc-300 dark:text-zinc-600 text-lg shrink-0" />
            <button
              onClick={requestLocation}
              disabled={locationLoading}
              className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 transition-opacity"
            >
              {locationLoading ? "Locating..." : "Share location"}
            </button>
            {locationError && (
              <p className="text-xs text-red-400">{locationError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
