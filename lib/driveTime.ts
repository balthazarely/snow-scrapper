export type DriveTimeResult = {
  driveSeconds: number | null;
  driveMinutes: number | null;
  driveLabel: string;
};

export async function getDriveTime(
  userLat: number,
  userLng: number,
  destLat: number,
  destLng: number,
): Promise<DriveTimeResult> {
  console.log("[driveTime] Fetching single drive time:", {
    from: { userLat, userLng },
    to: { destLat, destLng },
  });

  const url = `https://api.tomtom.com/routing/1/calculateRoute/${userLat},${userLng}:${destLat},${destLng}/json?traffic=true&travelMode=car&key=${process.env.TOMTOM_API_KEY}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`TomTom error: ${res.status}`);
  }

  const data = await res.json();
  const seconds = data.routes?.[0]?.summary?.travelTimeInSeconds ?? null;

  console.log("[driveTime] Result:", seconds, "seconds");

  return {
    driveSeconds: seconds,
    driveMinutes: seconds ? Math.round(seconds / 60) : null,
    driveLabel: seconds ? formatDrive(seconds) : "Unavailable",
  };
}

function formatDrive(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
