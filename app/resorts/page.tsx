"use client";

import useResorts from "@/hooks/useResorts";
import ResortCard from "@/components/ResortCard";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";

export default function ResortsPage() {
  const { data: resorts, isLoading } = useResorts();

  return (
    <div className="p-4 bg-slate-100">
      <h1 className="text-2xl font-bold text-zinc-900">Resorts</h1>
      <p className="mt-0.5 text-sm text-zinc-400">
        Current conditions across Colorado
      </p>

      {isLoading && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResortCardSkeleton key={i} />
          ))}
        </div>
      )}

      {resorts && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {resorts.map((resort) => (
            <ResortCard key={resort.name} resort={resort} />
          ))}
        </div>
      )}
    </div>
  );
}
