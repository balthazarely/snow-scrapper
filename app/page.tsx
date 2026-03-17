"use client";

import useResorts from "@/hooks/useResorts";
import { useUserPrefs } from "@/context/UserPrefsContext";
import { useApp } from "@/context/AppContext";
import Image from "next/image";
import ResortCard from "@/components/ResortCard";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";
import { MdLocationOn, MdLocationOff } from "react-icons/md";

export default function Home() {
  const { data: resorts, isLoading } = useResorts();
  const { prefs } = useUserPrefs();
  const { userLocation, locationLoading, locationError, requestLocation } =
    useApp();

  const favorites = resorts?.filter((r) =>
    prefs.favoriteResorts.includes(r.name),
  );

  return (
    <div className="bg-slate-100 min-h-full">
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

      <div className="p-4">
        {/* Location card */}
        <div className="mt-4 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-2">
              Your Location
            </p>
            {userLocation ? (
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-sky-500 text-lg shrink-0" />
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-zinc-400">GPS acquired</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <MdLocationOff className="text-zinc-300 text-lg shrink-0" />
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

        {/* Favorites */}
        {isLoading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <ResortCardSkeleton key={i} />
            ))}
          </div>
        )}

        {favorites && favorites.length > 0 && (
          <div className="mt-6">
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
