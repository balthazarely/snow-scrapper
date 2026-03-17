// app/api/test-scrape/route.ts
import { scrapeColoradoSnow } from "@/lib/scrapeSnowReport";
import { getRedis } from "@/lib/redis";

export async function GET() {
  const data = await scrapeColoradoSnow();

  const redis = await getRedis();
  await redis.set("snow-report", JSON.stringify(data));

  const saved = await redis.get("snow-report");

  return Response.json({
    saved: true,
    resorts: JSON.parse(saved!).length,
    data,
  });
}
