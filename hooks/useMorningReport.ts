// hooks/useMorningReport.ts
import { useQuery } from "@tanstack/react-query";

export type MorningReport = {
  headline: string;
  report: string;
  bestBet: string;
  worstPick: string;
  generatedAt: string;
  date: string;
};

export function useMorningReport() {
  return useQuery({
    queryKey: ["morning-report"],
    queryFn: async (): Promise<MorningReport> => {
      const res = await fetch("/api/morning-report");
      if (!res.ok) throw new Error("No morning report available");
      return res.json();
    },
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 12,
  });
}
