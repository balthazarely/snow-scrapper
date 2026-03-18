"use client";

import { useState } from "react";
import useResorts from "@/hooks/useResorts";
import { useUserPrefs } from "@/context/UserPrefsContext";
import Image from "next/image";
import ResortCardMini from "@/components/ResortCardMini";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";
import LocationCard from "@/components/LocationCard";
import SettingsModal from "@/components/SettingsModal";
import MorningReport from "@/components/MorningReport";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function Home() {
  const { data: resorts, isLoading, isError } = useResorts();
  const { prefs, toggleDarkMode } = useUserPrefs();
  const isOnline = useOnlineStatus();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const favorites = resorts?.filter((r) =>
    prefs.favoriteResorts.includes(r.name),
  );

  return (
    <div className="bg-slate-100 dark:bg-zinc-900 min-h-full pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)]">
      {/* Hero image */}
      <div className="relative h-56 w-full">
        <Image
          src="/header.jpg"
          alt="Snowhound"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />
        <div className="absolute bottom-0 left-0 p-4">
          <h1 className="text-2xl font-bold text-white">Snow Scraper</h1>
          <p className="text-sm text-white/70">Colorado snow conditions</p>
        </div>
        {/* Online status */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-semibold">
          <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-400" : "bg-red-400 animate-pulse"}`} />
          {isOnline ? "Online" : "Offline"}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
        >
          {prefs.darkMode ? (
            <MdLightMode size={18} />
          ) : (
            <MdDarkMode size={18} />
          )}
        </button>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      <div className="p-4 space-y-4">
        <MorningReport />

        {isError && (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            Could not load resort data. You may be offline and the cached data has expired.
          </div>
        )}

        {isLoading ? (
          <>
            {/* UserPrefsCard skeleton */}
            <div className="rounded-2xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden animate-pulse">
              <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-700" />
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
                  <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
                </div>
                <div className="h-7 w-24 bg-zinc-100 dark:bg-zinc-700 rounded-full" />
              </div>
            </div>

            {/* Resort card skeletons */}
            <div>
              <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full mb-3 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ResortCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* <UserPrefsCard onOpenSettings={() => setSettingsOpen(true)} /> */}

            {favorites && favorites.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Favorites
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {favorites.map((resort) => (
                    <ResortCardMini key={resort.name} resort={resort} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <LocationCard />
      </div>
    </div>
  );
}
