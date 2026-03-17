"use client";

import { useUserPrefs } from "@/context/UserPrefsContext";
import { Resort } from "@/types/Resort";

export default function ResortCard({ resort }: { resort: Resort }) {
  const { isFavorite, toggleFavorite } = useUserPrefs();
  const fav = isFavorite(resort.name);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            {resort.name}
          </h2>
          {resort.pass && (
            <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
              {resort.pass}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-500">{resort.conditions}</span>
          <button
            onClick={() => toggleFavorite(resort.name)}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className="text-xl leading-none text-blue-50 p-4"
          >
            {fav ? "Remove" : "Add"}
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-lg font-bold text-zinc-900 dark:text-white">
            {resort.snowfall3d}"
          </p>
          <p className="text-xs text-zinc-400">3-day snow</p>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-900 dark:text-white">
            {resort.openLifts}/{resort.totalLifts}
          </p>
          <p className="text-xs text-zinc-400">lifts open</p>
        </div>
        <div>
          <p className="text-lg font-bold text-zinc-900 dark:text-white">
            {resort.openTrails}/{resort.totalTrails}
          </p>
          <p className="text-xs text-zinc-400">trails open</p>
        </div>
      </div>
    </div>
  );
}
