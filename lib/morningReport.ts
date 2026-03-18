// lib/morningReport.ts

export type MorningReport = {
  headline: string;
  report: string;
  bestBet: string;
  worstPick: string;
  generatedAt: string;
  date: string;
};

export async function generateMorningReport(
  snowData: any[],
  timestamp: string,
): Promise<MorningReport> {
  const date = new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/Denver",
  });

  const sorted = [...snowData].sort(
    (a, b) => parseFloat(b.snowfall3d) - parseFloat(a.snowfall3d),
  );
  const topSnow = sorted.slice(0, 3);
  const powderDay = parseFloat(sorted[0].snowfall3d) >= 6;

  const prompt = `
    You are a charismatic Colorado ski podcast host writing the daily morning snow report for ${date}.

    Here is today's full snow data for all Colorado resorts:
    ${JSON.stringify(snowData, null, 2)}

    Top 3 resorts by new snow:
    ${topSnow.map((r) => `- ${r.name}: ${r.snowfall3d}" new, ${r.baseDepth}" base, ${r.openTrails}/${r.totalTrails} trails, ${r.conditions}`).join("\n")}

    ${powderDay ? "TODAY IS A POWDER DAY." : "No major new snow overnight."}

    Write a morning snow report in this exact format:

    HEADLINE: [One punchy sentence — 10 words max. If powder day, make it exciting.]

    REPORT: [2-3 conversational paragraphs. Lead with the best snow. Mention specific resorts, exact numbers (inches, trails, base depth). End with a vibe — is today a powder chase day, a groomer day, a spring skiing day? Sound like a real person who loves skiing, not a weather report.]

    BEST BET TODAY: [One resort name only]

    WORST PICK TODAY: [One resort name only — lowest snow, worst conditions]
    IMPORTANT: Do not use any markdown formatting. No asterisks, no bold, no bullet points. Plain text only.

  `;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Claude error generating morning report: ${response.status}`,
    );
  }

  const result = await response.json();
  // lib/morningReport.ts

  // Replace the parsing section at the bottom with this:
  const text = result.content[0].text;
  console.log("[morningReport] Raw Claude response:", text);

  // Split on double newline to get sections
  const headlineMatch = text.match(/HEADLINE:\s*(.+)/);
  const reportMatch = text.match(
    /REPORT:\s*([\s\S]+?)(?:\n\nBEST BET|BEST BET)/,
  );
  const bestBetMatch = text.match(/BEST BET TODAY:\s*(.+)/);
  const worstPickMatch = text.match(/WORST PICK TODAY:\s*(.+)/);
  const vibeMatch = text.match(/VIBE:\s*(\w+)/);

  // Then wrap each parsed value:
  const headline = clean(headlineMatch?.[1] ?? "");
  const report = clean(reportMatch?.[1] ?? "");
  const bestBet = clean(bestBetMatch?.[1] ?? "");
  const worstPick = clean(worstPickMatch?.[1] ?? "");
  const vibe = clean(vibeMatch?.[1] ?? "MIXED");

  console.log("[morningReport] Parsed:", {
    headline,
    bestBet,
    worstPick,
    vibe,
  });
  return {
    headline,
    report,
    bestBet,
    worstPick,
    generatedAt: new Date().toISOString(),
    date,
  };
}

// Add this helper function at the top of the file
function clean(str: string): string {
  return str
    .replace(/\*\*/g, "") // remove bold markdown
    .replace(/\*/g, "") // remove italic markdown
    .replace(/^[\s\n]+/, "") // trim leading whitespace/newlines
    .replace(/[\s\n]+$/, "") // trim trailing whitespace/newlines
    .trim();
}
