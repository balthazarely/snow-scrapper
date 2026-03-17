// app/api/drivetime/route.ts
import { getDriveTime } from "@/lib/driveTime";

export async function POST(req: Request) {
  const { userLat, userLng, destLat, destLng } = await req.json();

  if (!userLat || !userLng || !destLat || !destLng) {
    return Response.json(
      { error: "userLat, userLng, destLat, destLng are required" },
      { status: 400 },
    );
  }

  console.log("[/api/drivetime] Request:", {
    userLat,
    userLng,
    destLat,
    destLng,
  });

  try {
    const result = await getDriveTime(userLat, userLng, destLat, destLng);
    return Response.json(result);
  } catch (err) {
    console.error("[/api/drivetime] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
