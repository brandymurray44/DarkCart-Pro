import { NextResponse } from "next/server";
import { runCompetitorSpyJob } from "@/jobs/competitorSpyJob";
import { requireAuth, apiErrorResponse } from "@/lib/api/apiUtils";

export async function POST() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const result = await runCompetitorSpyJob();

    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          message: `Scraped competitor intelligence (${result.scrapedCount} items)`,
          scrapedCount: result.scrapedCount,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: result.error || "Competitor scraping failed",
          scrapedCount: 0,
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return apiErrorResponse(error, "Job execution failed");
  }
}
