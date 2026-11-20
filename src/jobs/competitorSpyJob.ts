import {
  scrapeCompetitorData,
  scrapeOwnStoreData,
  persistCompetitorIntelligence,
  deduplicateCompetitors,
} from "@/services/competitorScraper";
import { getUserCompetitors } from "@/services/competitorEngine";
import prisma from "@/lib/db";

let lastRunTime = 0;
const RUN_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

export async function runCompetitorSpyJob(): Promise<{
  success: boolean;
  scrapedCount: number;
  error?: string;
}> {
  try {
    const now = Date.now();

    // Prevent running more than once per interval
    if (now - lastRunTime < RUN_INTERVAL) {
      return {
        success: false,
        scrapedCount: 0,
        error: `Job already ran ${Math.floor((now - lastRunTime) / 1000)}s ago. Next run in ${Math.floor((RUN_INTERVAL - (now - lastRunTime)) / 1000)}s.`,
      };
    }

    console.log(`[CompetitorSpyJob] Starting at ${new Date().toISOString()}`);
    lastRunTime = now;

    // Get all users with onboarding
    const users = await prisma.user.findMany({
      include: {
        onboarding: true,
        shop: true,
      },
    });

    let totalScraped = 0;

    for (const user of users) {
      if (!user.onboarding || !user.shop) continue;

      const niche = user.onboarding.niche;
      const shopId = user.shop.id;

      // Get competitors for this user
      const competitors = await getUserCompetitors(user.id);

      // Scrape each competitor
      for (const competitor of competitors) {
        try {
          const competitorData = await scrapeCompetitorData(
            competitor.domain,
            niche
          );
          const ownData = await scrapeOwnStoreData(shopId, niche);

          const allData = [...competitorData, ...ownData];
          const deduplicated = await deduplicateCompetitors(allData);
          const persistedCount = await persistCompetitorIntelligence(
            deduplicated
          );

          totalScraped += persistedCount;
          console.log(
            `[CompetitorSpyJob] Scraped ${persistedCount} items from ${competitor.domain}`
          );
        } catch (error) {
          console.error(
            `[CompetitorSpyJob] Error scraping ${competitor.domain}:`,
            error
          );
        }
      }
    }

    console.log(
      `[CompetitorSpyJob] Completed at ${new Date().toISOString()}, scraped ${totalScraped} total items`
    );

    return {
      success: true,
      scrapedCount: totalScraped,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[CompetitorSpyJob] Failed:", errorMessage);
    return {
      success: false,
      scrapedCount: 0,
      error: errorMessage,
    };
  }
}

// Optional background job scheduler
let backgroundJobHandle: NodeJS.Timeout | null = null;

export function startBackgroundCompetitorSpy(): void {
  if (backgroundJobHandle) {
    console.warn("[CompetitorSpy] Background job already running");
    return;
  }

  console.log(
    "[CompetitorSpy] Starting background competitor spy (every 6 hours)"
  );

  // Run immediately on startup
  runCompetitorSpyJob().catch((err) =>
    console.error("[CompetitorSpy] Initial run failed:", err)
  );

  // Then run every 6 hours
  backgroundJobHandle = setInterval(() => {
    runCompetitorSpyJob().catch((err) =>
      console.error("[CompetitorSpy] Scheduled run failed:", err)
    );
  }, RUN_INTERVAL);
}

export function stopBackgroundCompetitorSpy(): void {
  if (backgroundJobHandle) {
    clearInterval(backgroundJobHandle);
    backgroundJobHandle = null;
    console.log("[CompetitorSpy] Background job stopped");
  }
}
