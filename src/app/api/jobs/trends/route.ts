import { NextResponse } from "next/server";
import { runTrendScrapeJob } from "@/jobs/trendScrapeJob";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

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
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Job execution failed",
      },
      { status: 500 }
    );
  }
}
