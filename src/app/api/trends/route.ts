import { NextResponse } from "next/server";
import { trendRequestSchema } from "@/lib/validators";
import {
  fetchTrendingItems,
  normalizeTrendCandidates,
} from "@/server/trends/trendEngine";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const niche = url.searchParams.get("niche") ?? undefined;
  const source = url.searchParams.get("source") ?? undefined;

  const parsed = trendRequestSchema.safeParse({ niche, source });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const candidates = await fetchTrendingItems(
    parsed.data.niche,
    parsed.data.source
  );

  if (candidates.length === 0) {
    return NextResponse.json(
      {
        message:
          "No trends found. Run POST /api/jobs/trends to trigger scraping.",
        data: [],
      },
      { status: 200 }
    );
  }

  const normalized = normalizeTrendCandidates(candidates);

  return NextResponse.json({ data: normalized });
}
