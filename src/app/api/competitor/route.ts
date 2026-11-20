import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getCompetitorIntelligence } from "@/services/competitorEngine";
import prisma from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();

    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/competitor', 'GET', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's niche
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId: user.id },
    });

    if (!onboarding) {
      return NextResponse.json(
        { message: "Complete onboarding first", data: [] },
        { status: 200 }
      );
    }

    const intelligence = await getCompetitorIntelligence(onboarding.niche);

    const duration = Date.now() - startTime;
    logger.api('/api/competitor', 'GET', 200, duration, user.id);
    logger.info('Competitor intelligence fetched', { userId: user.id, niche: onboarding.niche, count: intelligence.length });

    return NextResponse.json(
      {
        niche: onboarding.niche,
        competitors: intelligence,
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Competitor intelligence error', error instanceof Error ? error : undefined, { duration });
    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Failed to fetch competitor intelligence. Please try again.",
      },
      { status: 500 }
    );
  }
}
