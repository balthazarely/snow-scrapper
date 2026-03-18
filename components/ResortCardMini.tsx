"use client";

import Link from "next/link";
import { Resort } from "@/types/Resort";

export default function ResortCardMini({ resort }: { resort: Resort }) {
  return (
    <Link href={`/resorts/${resort.id}`}>
      <div className="rounded-xl bg-white dark:bg-zinc-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="h-0.5 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
        <div className="px-3 py-2.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{resort.name}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 capitalize truncate">{resort.conditions}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-base font-bold text-orange-400 leading-none">{resort.snowfall3d}"</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">3-day snow</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
