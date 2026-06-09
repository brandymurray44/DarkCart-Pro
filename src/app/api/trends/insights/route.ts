import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { generateTrendInsights } from "@/lib/ai/contentGenerators";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? "";
  const source = url.searchParams.get("source") ?? "";
  const score = parseFloat(url.searchParams.get("score") ?? "0");
  const velocity = url.searchParams.get("velocity")
    ? parseFloat(url.searchParams.get("velocity")!)
    : undefined;
  const saturation = url.searchParams.get("saturation")
    ? parseFloat(url.searchParams.get("saturation")!)
    : undefined;
  const niche = url.searchParams.get("niche") ?? "";

  if (!title || !source || !niche) {
    return NextResponse.json(
      { error: "Missing required params: title, source, niche" },
      { status: 400 }
    );
  }

  try {
    const insights = await generateTrendInsights({
      provider: "openai",
      model: "gpt-4",
      title,
      source,
      score,
      velocity,
      saturation,
      niche,
    });
    return NextResponse.json({ data: insights });
  } catch (error) {
    console.error("[API] Trend insights error:", error);
    return NextResponse.json(
      {
        data: {
          insight: "Trending now — act quickly to capitalize on this opportunity.",
          action: "Monitor",
          opportunity: "High-trend category with room for differentiation.",
        },
      },
      { status: 200 }
    );
  }
}
