import { NextResponse } from "next/server";
import { runCompetitorSpyJob } from "@/jobs/competitorSpyJob";

/**
 * Vercel Cron endpoint for competitor intelligence scraping.
 * Called every 6 hours by Vercel Cron.
 * Protected by CRON_SECRET header verification.
 */
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized invocation
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runCompetitorSpyJob();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Scraped competitor intelligence (${result.scrapedCount} items)`,
        scrapedCount: result.scrapedCount,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: result.error || "Competitor scraping failed",
        scrapedCount: 0,
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Cron job execution failed",
    }, { status: 500 });
  }
}
