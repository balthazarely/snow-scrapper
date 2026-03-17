"use client";

import useResorts from "@/hooks/useResorts";
import ResortCard from "@/components/ResortCard";
import ResortCardSkeleton from "@/components/ResortCardSkeleton";
import PageHeader from "@/components/PageHeader";

export default function ResortsPage() {
  const { data: resorts, isLoading } = useResorts();

  return (
    <div className="p-4 bg-slate-100 pb-[calc(5rem+env(safe-area-inset-bottom)+1rem)]">
      <PageHeader title="Resorts" subtitle="Current conditions across Colorado" />

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
