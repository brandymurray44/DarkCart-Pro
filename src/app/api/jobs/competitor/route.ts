import { NextResponse } from "next/server";
import { runCompetitorSpyJob } from "@/jobs/competitorSpyJob";
import { getSessionUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Job execution failed",
      },
      { status: 500 }
    );
  }
}
