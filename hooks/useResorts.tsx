import { Resort, SnowReportResponse } from "@/types/Resort";
import enrichedResorts from "@/public/colorado-resorts-enriched.json";
import { useQuery } from "@tanstack/react-query";

export default function useResorts() {
  return useQuery({
    queryKey: ["resorts"],
    queryFn: async (): Promise<Resort[]> => {
      const res = await fetch("/api/snow");
      if (!res.ok) throw new Error("Failed to fetch resorts");
      const json: SnowReportResponse = await res.json();

      return json.resorts.map((resort) => {
        const meta = enrichedResorts.find((r) => r.name === resort.name);
        return { ...resort, ...meta } as Resort;
      });
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
