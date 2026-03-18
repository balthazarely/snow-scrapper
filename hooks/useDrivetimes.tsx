// hooks/useDriveTime.ts
import { useQuery } from "@tanstack/react-query";

type DriveTimeResult = {
  driveSeconds: number | null;
  driveMinutes: number | null;
  driveLabel: string;
};

async function fetchDriveTime(
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number,
): Promise<DriveTimeResult> {
  const res = await fetch("/api/drivetime", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userLat, userLng, destLat, destLng }),
  });
  if (!res.ok) throw new Error("Failed to fetch drive time");
  return res.json();
}

// export function useDriveTime(
//   userLat: number | null,
//   userLng: number | null,
//   destLat: number,
//   destLng: number,
// ) {
//   return useQuery({
//     queryKey: ["drivetime", userLat, userLng, destLat, destLng],
//     queryFn: () => fetchDriveTime(userLat!, userLng!, destLat, destLng),
//     enabled: !!userLat && !!userLng, // only runs when user location exists
//     staleTime: 1000 * 60 * 15, // re-fetch after 15 mins
//   });
// }
