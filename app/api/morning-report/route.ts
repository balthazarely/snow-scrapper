import { getRedis } from "@/lib/redis";

export async function GET() {
  const redis = await getRedis();
  const raw = await redis.get("morning-report");

  if (!raw) {
    return Response.json({ error: "No report yet" }, { status: 404 });
  }

  return Response.json(JSON.parse(raw as string));
}
