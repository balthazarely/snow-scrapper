"use client";

import Link from "next/link";
import { useUserPrefs } from "@/context/UserPrefsContext";
import { Resort } from "@/types/Resort";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { toast } from "sonner";
import PassBadge from "@/components/PassBadge";

export default function ResortCard({ resort }: { resort: Resort }) {
  const { isFavorite, toggleFavorite } = useUserPrefs();
  const fav = isFavorite(resort.name);

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link href={`/resorts/${resort.id}`}>
                <h2 className="font-bold text-zinc-900 hover:text-sky-500 transition-colors">
                  {resort.name}
                </h2>
              </Link>
              <PassBadge pass={resort.pass} />
            </div>
            <span className="text-xs text-zinc-400 capitalize mt-1 block">
              {resort.conditions}
            </span>
          </div>
          <button
            onClick={() => toggleFavorite(resort.name)}
            aria-label={fav ? "Remove from favorites" : "Add to favorites"}
            className={`ml-3 text-2xl leading-none transition-colors ${fav ? "text-orange-400" : "text-zinc-200 hover:text-zinc-300"}`}
          >
            {fav ? <MdBookmark /> : <MdBookmarkBorder />}
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-zinc-100">
          <div className="text-center pr-2">
            <p className="text-xl font-bold text-orange-400">
              {resort.snowfall3d}"
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">3-day snow</p>
          </div>
          <div className="text-center px-2">
            <p className="text-xl font-bold text-zinc-900">
              {resort.openLifts}
              <span className="text-sm font-normal text-zinc-300">
                /{resort.totalLifts}
              </span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">lifts open</p>
          </div>
          <div className="text-center pl-2">
            <p className="text-xl font-bold text-zinc-900">
              {resort.openTrails}
              <span className="text-sm font-normal text-zinc-300">
                /{resort.totalTrails}
              </span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">trails open</p>
          </div>
        </div>
      </div>
    </div>
  );
}
