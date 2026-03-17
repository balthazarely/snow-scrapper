"use client";

import useResorts from "@/hooks/useResorts";
import ResortCard from "@/components/ResortCard";

export default function ResortsPage() {
  const { data: resorts, isLoading } = useResorts();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
        Resorts
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Current conditions across Colorado
      </p>

      {isLoading && (
        <p className="mt-8 text-sm text-zinc-400">Loading resorts...</p>
      )}

      {resorts && (
        <div className="mt-4 flex flex-col gap-3">
          {resorts.map((resort) => (
            <ResortCard key={resort.name} resort={resort} />
          ))}
        </div>
      )}
    </div>
  );
}
