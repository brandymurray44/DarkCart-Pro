import { scrapeAllTrends, persistTrendsGlobally } from "@/services/trendScraper";

let lastRunTime = 0;
const RUN_INTERVAL = 30 * 60 * 1000; // 30 minutes

export async function runTrendScrapeJob(): Promise<{
  success: boolean;
  trendsCount: number;
  error?: string;
}> {
  try {
    const now = Date.now();

    // Prevent running more than once per interval
    if (now - lastRunTime < RUN_INTERVAL) {
      return {
        success: false,
        trendsCount: 0,
        error: `Job already ran ${Math.floor((now - lastRunTime) / 1000)}s ago. Next run in ${Math.floor((RUN_INTERVAL - (now - lastRunTime)) / 1000)}s.`,
      };
    }

    console.log(`[TrendScrapeJob] Starting at ${new Date().toISOString()}`);
    lastRunTime = now;

    // Scrape all sources
    const trends = await scrapeAllTrends();
    console.log(`[TrendScrapeJob] Scraped ${trends.length} total trends`);

    if (trends.length === 0) {
      console.warn("[TrendScrapeJob] No trends were scraped");
      return {
        success: false,
        trendsCount: 0,
        error: "No trends were scraped from any source",
      };
    }

    // Persist to database
    const persistedCount = await persistTrendsGlobally(trends);
    console.log(
      `[TrendScrapeJob] Persisted ${persistedCount} trends to database`
    );

    return {
      success: true,
      trendsCount: persistedCount,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[TrendScrapeJob] Failed:", errorMessage);
    return {
      success: false,
      trendsCount: 0,
      error: errorMessage,
    };
  }
}

// Optional: Start background job scheduler
let backgroundJobHandle: NodeJS.Timeout | null = null;

export function startBackgroundTrendScraper(): void {
  if (backgroundJobHandle) {
    console.warn("[TrendScraper] Background job already running");
    return;
  }

  console.log(
    "[TrendScraper] Starting background trend scraper (every 30 minutes)"
  );

  // Run immediately on startup
  runTrendScrapeJob().catch((err) =>
    console.error("[TrendScraper] Initial run failed:", err)
  );

  // Then run every 30 minutes
  backgroundJobHandle = setInterval(() => {
    runTrendScrapeJob().catch((err) =>
      console.error("[TrendScraper] Scheduled run failed:", err)
    );
  }, RUN_INTERVAL);
}

export function stopBackgroundTrendScraper(): void {
  if (backgroundJobHandle) {
    clearInterval(backgroundJobHandle);
    backgroundJobHandle = null;
    console.log("[TrendScraper] Background job stopped");
  }
}
