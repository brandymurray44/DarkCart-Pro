import { NextResponse } from "next/server";
import { runTrendScrapeJob } from "@/jobs/trendScrapeJob";
import { getSessionUser } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    const user = await getSessionUser();

    if (!user) {
      const duration = Date.now() - startTime;
      logger.api('/api/jobs/trends', 'POST', 401, duration, undefined, 'Unauthorized');
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Verify CSRF token
    const csrfToken = request.headers.get("x-csrf-token");
    const { verifyCSRF } = await import("@/lib/authServer");
    if (!csrfToken || !(await verifyCSRF(csrfToken))) {
      const duration = Date.now() - startTime;
      logger.security('CSRF verification failed', 'high', { userId: user.id, endpoint: '/api/jobs/trends' });
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    logger.info('Starting trend scrape job', { userId: user.id });
    const result = await runTrendScrapeJob();

    const duration = Date.now() - startTime;
    if (result.success) {
      logger.api('/api/jobs/trends', 'POST', 200, duration, user.id);
      logger.info('Trend scrape job completed', { userId: user.id, count: result.trendsCount });
      return NextResponse.json(
        {
          success: true,
          message: `Scraped and persisted ${result.trendsCount} trends`,
          trendsCount: result.trendsCount,
        },
        { status: 200 }
      );
    } else {
      logger.api('/api/jobs/trends', 'POST', 503, duration, user.id, result.error);
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Trend scraping failed",
          trendsCount: 0,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error('Trend job error', error instanceof Error ? error : undefined, { duration });
    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "Job execution failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
