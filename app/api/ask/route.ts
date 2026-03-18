function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 3958.8; // miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function POST(req: Request) {
  const { question, pass, favoriteResorts, userLocation, resorts } =
    await req.json();

  if (!question) {
    return Response.json({ error: "question is required" }, { status: 400 });
  }

  if (!resorts || resorts.length === 0) {
    return Response.json({ error: "No resort data provided" }, { status: 400 });
  }

  // Pre-calculate distances so Claude doesn't have to
  const resortsWithDistance = resorts.map((resort: any) => {
    if (!userLocation || !resort.lat || !resort.lng) return resort;
    const distanceMiles = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      resort.lat,
      resort.lng,
    );
    return {
      ...resort,
      distanceMiles: parseFloat(distanceMiles.toFixed(1)),
    };
  });

  // Sort by distance so Claude sees closest first
  if (userLocation) {
    resortsWithDistance.sort(
      (a: any, b: any) => (a.distanceMiles ?? 999) - (b.distanceMiles ?? 999),
    );
  }

  const prompt = `
You are a Colorado ski trip advisor. Recommend the best resort based on current snow conditions and user preferences.

CURRENT SNOW CONDITIONS AND RESORT DATA (sorted by distance from user, closest first):
${JSON.stringify(resortsWithDistance, null, 2)}

USER PREFERENCES:
- Pass: ${pass ?? "none"}
- Favorite resorts: ${favoriteResorts?.length > 0 ? favoriteResorts.join(", ") : "none saved"}

${
  userLocation
    ? `USER LOCATION: Each resort above has a pre-calculated distanceMiles field showing exact straight-line distance from the user. Use these values directly — do not recalculate distances yourself.`
    : "USER LOCATION: Unknown — do not factor in distance."
}

INSTRUCTIONS:
- Use ONLY the data provided above.
- Use the distanceMiles field directly for any distance questions — do not calculate yourself.
- Do not identify or name the user's location.
- Prioritize pass resorts if user has one.
- Always mention pass affiliation (Epic, Ikon, or independent/lift ticket required).
- Reference specific numbers: snow inches, base depth, open trails, open lifts, distance in miles.
- 2-3 short paragraphs max. Lead with top recommendation.
- Conversational and direct. No bullet points.

USER QUESTION: "${question}"`;

  // ... rest of Anthropic call unchanged

  try {
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
      const errorBody = await response.json();
      console.error(
        "[/api/ask] Anthropic error:",
        JSON.stringify(errorBody, null, 2),
      );
      throw new Error(
        `Anthropic error: ${response.status} - ${errorBody.error?.message}`,
      );
    }

    const data = await response.json();
    return Response.json({ answer: data.content[0].text });
  } catch (err) {
    console.error("[/api/ask] Error:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
