import { NextResponse } from "next/server";
import { runTrendScrapeJob } from "@/jobs/trendScrapeJob";
import { requireAuth, apiErrorResponse } from "@/lib/api/apiUtils";

export async function POST() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const result = await runTrendScrapeJob();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: `Scraped and persisted ${result.trendsCount} trends`,
          trendsCount: result.trendsCount,
        },
        { status: 200 }
      );
    } else {
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
    return apiErrorResponse(error, "Job execution failed");
  }
}
