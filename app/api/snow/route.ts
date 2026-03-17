// app/api/snow/route.ts
import { getRedis } from "@/lib/redis";

export async function GET() {
  const redis = await getRedis();
  const raw = await redis.get("snow-report");
  const lastScraped = await redis.get("last-scraped");

  if (!raw) {
    return Response.json(
      { error: "No data yet — run the scraper first" },
      { status: 503 },
    );
  }

  const resorts = JSON.parse(raw as string);

  return Response.json({
    lastScraped, // ← when the cron actually ran
    count: resorts.length,
    resorts,
  });
}
