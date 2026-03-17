// app/api/cron/scrape/route.ts
import { scrapeColoradoSnow } from "@/lib/scrapeSnowReport";
import { getRedis } from "@/lib/redis";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("1. Starting scrape...");
    const data = await scrapeColoradoSnow();
    console.log("2. Scrape done, resorts:", data.length);

    const redis = await getRedis();
    console.log("3. Redis connected");

    const timestamp = new Date().toISOString();
    await redis.set("snow-report", JSON.stringify(data));
    console.log("4. snow-report saved");

    await redis.set("last-scraped", timestamp);
    console.log("5. last-scraped saved");

    return Response.json({
      ok: true,
      resorts: data.length,
      timestamp,
    });
  } catch (err) {
    console.error("CRON ERROR:", err);
    return Response.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
