// hooks/useAskAgent.ts
import { useMutation } from "@tanstack/react-query";
import { useUserPrefs } from "@/context/UserPrefsContext";
import { useApp } from "@/context/AppContext";
import useResorts from "./useResorts";

async function askAgent(payload: {
  question: string;
  pass: string | null;
  favoriteResorts: string[];
  userLocation: { lat: number; lng: number } | null;
  resorts: any[];
}) {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to get recommendation");
  return res.json();
}

export function useAskAgent() {
  const { prefs } = useUserPrefs();
  const { data: resorts } = useResorts();
  const { userLocation } = useApp();

  return useMutation({
    mutationFn: (question: string) =>
      askAgent({
        question,
        pass: prefs.pass,
        favoriteResorts: prefs.favoriteResorts,
        userLocation: prefs.useLocation ? (userLocation ?? null) : null,
        resorts: resorts ?? [],
      }),
  });
}
