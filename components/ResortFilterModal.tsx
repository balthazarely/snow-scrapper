"use client";

type PassFilter = "All" | "Epic" | "Ikon";
type SortOption = "snow" | "name";

export type ResortFilters = {
  pass: PassFilter;
  sort: SortOption;
};

type Props = {
  filters: ResortFilters;
  onChange: (filters: ResortFilters) => void;
  onClose: () => void;
};

const PASS_OPTIONS: PassFilter[] = ["All", "Epic", "Ikon"];
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "snow", label: "New Snow" },
  { value: "name", label: "Name (A–Z)" },
];

export default function ResortFilterModal({ filters, onChange, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div
        className="relative z-10 w-full sm:max-w-sm bg-white dark:bg-zinc-900 rounded-t-2xl sm:rounded-2xl p-6 mb-[calc(5rem+env(safe-area-inset-bottom))] sm:mb-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Filter Resorts</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Pass */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Pass
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PASS_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => onChange({ ...filters, pass: option })}
                  className={`h-10 rounded-xl border-2 text-sm font-semibold transition-all ${
                    filters.pass === option
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Sort By
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange({ ...filters, sort: option.value })}
                  className={`h-10 rounded-xl border-2 text-sm font-semibold transition-all ${
                    filters.sort === option.value
                      ? "border-sky-500 bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onChange({ pass: "All", sort: "name" })}
          className="mt-6 w-full py-2 rounded-xl text-xs font-semibold text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          Reset filters
        </button>
      </div>
    </div>
  );
}
