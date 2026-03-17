"use client";

import useResorts from "@/hooks/useResorts";
import { useUserPrefs } from "@/context/UserPrefsContext";
import ResortCard from "@/components/ResortCard";

export default function Home() {
  const { data: resorts, isLoading } = useResorts();
  const { prefs } = useUserPrefs();

  const favorites = resorts?.filter((r) =>
    prefs.favoriteResorts.includes(r.name)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Snowhound
      </h1>
      <p className="mt-1 text-sm text-zinc-500">Colorado snow conditions</p>

      {isLoading && (
        <p className="mt-8 text-sm text-zinc-400">Loading resorts...</p>
      )}

      {favorites && favorites.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Favorites
          </h2>
          <div className="flex flex-col gap-3">
            {favorites.map((resort) => (
              <ResortCard key={resort.name} resort={resort} />
            ))}
          </div>
        </div>
      )}

      {resorts && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-semibold text-zinc-500 uppercase tracking-wide">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Resorts tracked</p>
              <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">
                {resorts.length}
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
              <p className="text-xs text-zinc-500">Open resorts</p>
              <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-white">
                {resorts.filter((r) => parseInt(r.openLifts) > 0).length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
