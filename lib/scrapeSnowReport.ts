// lib/scrapeSnowReport.ts
import * as cheerio from "cheerio";

export type ResortSnowReport = {
  name: string;
  snowfall3d: string;
  forecast3d: string;
  baseDepth: string;
  conditions: string;
  openTrails: string;
  totalTrails: string;
  openLifts: string;
  totalLifts: string;
  lastUpdated: string;
};

export async function scrapeColoradoSnow(): Promise<ResortSnowReport[]> {
  const res = await fetch("https://www.onthesnow.com/colorado/skireport", {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch OnTheSnow: ${res.status}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);
  const resorts: ResortSnowReport[] = [];

  $("table tr").each((i, row) => {
    if (i === 0) return;

    const cols = $(row).find("td");
    if (cols.length < 6) return;

    // Resort name
    const nameRaw = $(cols[0]).text().trim();
    const name = nameRaw.split("\n")[0].trim();
    const cleanName = name
      .replace(/\d+\s*(hours?|minutes?|days?)\s*ago/i, "")
      .trim();

    // Snowfall — grab only text node, skip nested div
    const snowfall3d =
      $(cols[1])
        .find("span.h4")
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim()
        .replace(/[^0-9.]/g, "") || "0";

    // Forecast — grab only text node, skip nested div
    const forecast3d =
      $(cols[2])
        .find("span.h4")
        .contents()
        .filter(function () {
          return this.type === "text";
        })
        .text()
        .trim()
        .replace(/[^0-9.]/g, "") || "0";

    // Base depth + conditions
    const baseCell = $(cols[3]).find("span.h4");
    const baseDepthRaw = baseCell
      .contents()
      .filter(function () {
        return this.type === "text";
      })
      .text()
      .trim()
      .replace(/[^0-9\-]/g, "");
    const baseDepth = baseDepthRaw || "0";
    const conditions = baseCell.find("div").text().trim();

    // Trails — grab only text node to avoid "73% Open" div
    const trailsCell = $(cols[4]).find("span.h4");
    const trailsText = trailsCell
      .contents()
      .filter(function () {
        return this.type === "text";
      })
      .text()
      .trim();
    const trailsSplit = trailsText.split("/");
    const openTrails = trailsSplit[0]?.trim() ?? "0";
    const totalTrails = trailsSplit[1]?.trim() ?? "0";

    // Lifts — grab only text node, skip nested div
    const liftsCell = $(cols[5]).find("span.h4");
    const liftsText = liftsCell
      .contents()
      .filter(function () {
        return this.type === "text";
      })
      .text()
      .trim();
    const liftMatch = liftsText.match(/(\d+)\/(\d+)/);
    const openLifts = liftMatch?.[1] ?? "0";
    const totalLifts = liftMatch?.[2] ?? "0";

    if (!cleanName) return;

    resorts.push({
      name: cleanName,
      snowfall3d,
      forecast3d,
      baseDepth,
      conditions,
      openTrails,
      totalTrails,
      openLifts,
      totalLifts,
      lastUpdated: new Date().toISOString(),
    });
  });

  if (resorts.length < 5) {
    throw new Error(
      `Only got ${resorts.length} resorts — scrape likely broken`,
    );
  }

  return resorts;
}
