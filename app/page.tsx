"use client";

import { useState } from "react";
import useResorts from "@/hooks/useResorts";
import { useUserPrefs } from "@/context/UserPrefsContext";
import Image from "next/image";
import ResortCard from "@/components/ResortCard";
import ResortCardMini from "@/components/ResortCardMini";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";
import LocationCard from "@/components/LocationCard";
import UserPrefsCard from "@/components/UserPrefsCard";
import SettingsModal from "@/components/SettingsModal";
import MorningReport from "@/components/MorningReport";

export default function Home() {
  const { data: resorts, isLoading } = useResorts();
  const { prefs } = useUserPrefs();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const favorites = resorts?.filter((r) =>
    prefs.favoriteResorts.includes(r.name),
  );

  return (
    <div className="bg-slate-100 min-h-full pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)]">
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
          <h1 className="text-2xl font-bold text-white">Snow Scrapper</h1>
          <p className="text-sm text-white/70">Colorado snow conditions</p>
        </div>
      </div>

      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}

      <div className="p-4 space-y-4">
        <MorningReport />

        {isLoading ? (
          <>
            {/* UserPrefsCard skeleton */}
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden animate-pulse">
              <div className="h-1 w-full bg-zinc-100" />
              <div className="p-4 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-zinc-100 rounded-full" />
                  <div className="h-4 w-24 bg-zinc-100 rounded-full" />
                </div>
                <div className="h-7 w-24 bg-zinc-100 rounded-full" />
              </div>
            </div>

            {/* Resort card skeletons */}
            <div>
              <div className="h-3 w-20 bg-zinc-200 rounded-full mb-3 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ResortCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {favorites && favorites.length > 0 && (
              <div>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
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
        {/* <LocationCard /> */}
      </div>
    </div>
  );
}
