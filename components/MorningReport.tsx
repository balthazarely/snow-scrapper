"use client";

import { useMorningReport } from "@/hooks/useMorningReport";

function MorningReportSkeleton() {
  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
      <div className="p-4 space-y-3 animate-pulse">
        {/* Date */}
        <div className="h-3 w-32 bg-zinc-200 rounded-full" />

        {/* Headline */}
        <div className="h-5 w-3/4 bg-zinc-200 rounded-full" />

        {/* Body paragraphs */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3 w-full bg-zinc-100 rounded-full" />
          <div className="h-3 w-full bg-zinc-100 rounded-full" />
          <div className="h-3 w-5/6 bg-zinc-100 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-zinc-100 rounded-full" />
          <div className="h-3 w-full bg-zinc-100 rounded-full" />
          <div className="h-3 w-4/6 bg-zinc-100 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-zinc-100 rounded-full" />
          <div className="h-3 w-3/4 bg-zinc-100 rounded-full" />
        </div>

        {/* Best bet / skip today */}
        <div className="flex gap-3 pt-1">
          <div className="flex-1 h-14 bg-zinc-100 rounded-xl" />
          <div className="flex-1 h-14 bg-zinc-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function MorningReport() {
  const { data: report, isLoading } = useMorningReport();

  if (isLoading || !report) return <MorningReportSkeleton />;

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-sky-400 to-orange-400" />
      <div className="p-4">
        <p className="text-xs text-zinc-400 mb-2">
          {report.date} — Morning Report
        </p>

        <p className="text-base font-semibold text-zinc-900 leading-snug mb-3">
          {report.headline}
        </p>

        <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap mb-4">
          {report.report}
        </p>

        <div className="flex gap-3">
          <div className="flex-1 px-3 py-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-600 mb-1">
              BEST BET
            </p>
            <p className="text-sm text-zinc-800">{report.bestBet}</p>
          </div>
          <div className="flex-1 px-3 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <p className="text-xs font-semibold text-zinc-400 mb-1">
              SKIP TODAY
            </p>
            <p className="text-sm text-zinc-800">{report.worstPick}</p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 mt-3">Generated at 6am MT</p>
      </div>
    </div>
  );
}
