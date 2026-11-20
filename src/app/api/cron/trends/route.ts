import { NextResponse } from "next/server";
import { runTrendScrapeJob } from "@/jobs/trendScrapeJob";

/**
 * Vercel Cron endpoint for trend scraping.
 * Called every 30 minutes by Vercel Cron.
 * Protected by CRON_SECRET header verification.
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized invocation
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runTrendScrapeJob();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Scraped and persisted ${result.trendsCount} trends`,
        trendsCount: result.trendsCount,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || "Trend scraping failed",
        trendsCount: 0,
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Cron job execution failed",
    }, { status: 500 });
  }
}
