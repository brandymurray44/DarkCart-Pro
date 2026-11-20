import { NextResponse } from "next/server";
import { trendRequestSchema } from "@/lib/validators";
import {
  fetchTrendingItems,
  normalizeTrendCandidates,
} from "@/server/trends/trendEngine";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const url = new URL(request.url);
    const niche = url.searchParams.get("niche") ?? undefined;
    const source = url.searchParams.get("source") ?? undefined;

    const parsed = trendRequestSchema.safeParse({ niche, source });
    if (!parsed.success) {
      const duration = Date.now() - startTime;
      logger.api('/api/trends', 'GET', 400, duration, undefined, 'Validation failed');
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedNiche = (parsed.data.niche || '').replace(/[<>{}[\]\\]/g, '').trim();
    const sanitizedSource = parsed.data.source ? parsed.data.source.replace(/[<>{}[\]\\]/g, '').trim() : undefined;

    const candidates = await fetchTrendingItems(
      sanitizedNiche,
      sanitizedSource
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

  const duration = Date.now() - startTime;
  logger.api('/api/trends', 'GET', 200, duration);
  logger.info('Trends fetched', { count: normalized.length });
  return NextResponse.json({ data: normalized });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Trends fetch error', error instanceof Error ? error : undefined, { duration });
    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Failed to fetch trends. Please try again.",
      },
      { status: 500 }
    );
  }
}
