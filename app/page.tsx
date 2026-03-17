"use client";

import useResorts from "@/hooks/useResorts";
import { useUserPrefs } from "@/context/UserPrefsContext";
import Image from "next/image";
import ResortCard from "@/components/ResortCard";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";
import LocationCard from "@/components/LocationCard";

export default function Home() {
  const { data: resorts, isLoading } = useResorts();
  const { prefs } = useUserPrefs();

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

      <div className="p-4 space-y-4">
        <LocationCard />

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ResortCardSkeleton key={i} />
            ))}
          </div>
        )}

        {favorites && favorites.length > 0 && (
          <div>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Favorites
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {favorites.map((resort) => (
                <ResortCard key={resort.name} resort={resort} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
