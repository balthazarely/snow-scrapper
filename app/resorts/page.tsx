"use client";

import { useState } from "react";
import useResorts from "@/hooks/useResorts";
import ResortCard from "@/components/ResortCard";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";
import PageHeader from "@/components/PageHeader";
import ResortFilterModal, { ResortFilters } from "@/components/ResortFilterModal";
import { MdTune } from "react-icons/md";

const DEFAULT_FILTERS: ResortFilters = { pass: "All", sort: "name" };

export default function ResortsPage() {
  const { data: resorts, isLoading, isError } = useResorts();
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<ResortFilters>(DEFAULT_FILTERS);

  const isFiltered = filters.pass !== "All" || filters.sort !== "name";

  const filtered = resorts
    ?.filter((r) => filters.pass === "All" || r.pass === filters.pass)
    .sort((a, b) =>
      filters.sort === "name"
        ? a.name.localeCompare(b.name)
        : parseFloat(b.snowfall3d) - parseFloat(a.snowfall3d),
    );

  return (
    <div className="p-4 bg-slate-100 dark:bg-zinc-900 pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)]">
      {filterOpen && (
        <ResortFilterModal
          filters={filters}
          onChange={setFilters}
          onClose={() => setFilterOpen(false)}
        />
      )}

      {/* Header + filter button */}
      <div className="flex items-start justify-between">
        <PageHeader
          title="Resorts"
          subtitle="Current conditions across Colorado"
        />
        <button
          onClick={() => setFilterOpen(true)}
          className={`mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${
            isFiltered
              ? "border-sky-400 bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400"
              : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300"
          }`}
        >
          <MdTune size={13} />
          Filter
          {isFiltered && (
            <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-white text-[10px]">
              {(filters.pass !== "All" ? 1 : 0) + (filters.sort !== "name" ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      {/* Active filter pills */}
      <div className="flex flex-wrap gap-2 mt-3">
        {filters.pass !== "All" && (
          <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
            {filters.pass} Pass
          </span>
        )}
        <span className="px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
          {filters.sort === "snow" ? "New Snow" : "A–Z"}
        </span>
      </div>

      {isError && (
        <div className="mt-4 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-900 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Could not load resort data. You may be offline and the cached data has expired.
        </div>
      )}

      {isLoading && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <ResortCardSkeleton key={i} />
          ))}
        </div>
      )}

      {filtered && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center text-sm text-zinc-400 py-12">
              No resorts match your filters.
            </p>
          ) : (
            filtered.map((resort) => (
              <ResortCard key={resort.name} resort={resort} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
