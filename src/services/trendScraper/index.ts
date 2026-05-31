import { scrapeTikTok, type TikTokTrend } from "./tiktok";
import { scrapeEtsy, type EtsyTrend } from "./etsy";
import { scrapeReddit, type RedditTrend } from "./reddit";
import prisma from "@/lib/db";
import { createHash } from "crypto";

export interface NormalizedTrend {
  id: string;
  title: string;
  description: string;
  score: number;
  source: "tiktok" | "etsy" | "reddit";
  url: string;
  image?: string;
  niche: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

function generateId(title: string, source: string): string {
  return createHash("md5")
    .update(`${source}:${title}`)
    .digest("hex");
}

function normalizeTikTokTrend(trend: TikTokTrend): NormalizedTrend {
  return {
    id: generateId(trend.title, "tiktok"),
    title: trend.title,
    description: trend.description,
    score: Math.min(100, Math.max(0, trend.score)),
    source: "tiktok",
    url: trend.url,
    image: trend.image,
    niche: "general",
    metadata: {
      original_id: trend.id,
      scraped_at: new Date().toISOString(),
    },
    timestamp: trend.timestamp,
  };
}

function normalizeEtsyTrend(trend: EtsyTrend): NormalizedTrend {
  return {
    id: generateId(trend.title, "etsy"),
    title: trend.title,
    description: trend.description,
    score: Math.min(100, Math.max(0, trend.score)),
    source: "etsy",
    url: trend.url,
    image: trend.image,
    niche: "ecommerce",
    metadata: {
      original_id: trend.id,
      scraped_at: new Date().toISOString(),
    },
    timestamp: trend.timestamp,
  };
}

function normalizeRedditTrend(trend: RedditTrend): NormalizedTrend {
  return {
    id: generateId(trend.title, "reddit"),
    title: trend.title,
    description: trend.description,
    score: Math.min(100, Math.max(0, trend.score)),
    source: "reddit",
    url: trend.url,
    image: trend.image,
    niche: "business",
    metadata: {
      original_id: trend.id,
      subreddit: trend.url.includes("reddit.com") ? "general" : "specific",
      scraped_at: new Date().toISOString(),
    },
    timestamp: trend.timestamp,
  };
}

function deduplicateTrends(trends: NormalizedTrend[]): NormalizedTrend[] {
  const seen = new Map<string, NormalizedTrend>();

  for (const trend of trends) {
    const key = `${trend.title.toLowerCase()}:${trend.source}`;
    if (!seen.has(key)) {
      seen.set(key, trend);
    }
  }

  return Array.from(seen.values());
}

export async function scrapeAllTrends(): Promise<NormalizedTrend[]> {
  const results: NormalizedTrend[] = [];

  try {
    console.log("[TrendScraper] Starting TikTok scrape...");
    const tiktokTrends = await scrapeTikTok();
    results.push(
      ...tiktokTrends.map((t) => normalizeTikTokTrend(t))
    );
    console.log(`[TrendScraper] Scraped ${tiktokTrends.length} TikTok trends`);
  } catch (error) {
    console.error("[TrendScraper] TikTok scraping failed:", error);
  }

  try {
    console.log("[TrendScraper] Starting Etsy scrape...");
    const etsyTrends = await scrapeEtsy();
    results.push(...etsyTrends.map((t) => normalizeEtsyTrend(t)));
    console.log(`[TrendScraper] Scraped ${etsyTrends.length} Etsy trends`);
  } catch (error) {
    console.error("[TrendScraper] Etsy scraping failed:", error);
  }

  try {
    console.log("[TrendScraper] Starting Reddit scrape...");
    const redditTrends = await scrapeReddit();
    results.push(...redditTrends.map((t) => normalizeRedditTrend(t)));
    console.log(`[TrendScraper] Scraped ${redditTrends.length} Reddit trends`);
  } catch (error) {
    console.error("[TrendScraper] Reddit scraping failed:", error);
  }

  // Deduplicate and sort by score
  const deduplicated = deduplicateTrends(results);
  return deduplicated.sort((a, b) => b.score - a.score);
}

export async function persistTrendsGlobally(
  trends: NormalizedTrend[]
): Promise<number> {
  const writes = trends.map((trend) =>
    prisma.trendSnapshot.upsert({
      where: { id: trend.id },
      update: {
        score: trend.score,
        metadata: trend.metadata as any,
      },
      create: {
        id: trend.id,
        source: trend.source,
        title: trend.title,
        url: trend.url,
        imageUrl: trend.image,
        score: trend.score,
        niche: trend.niche,
        metadata: trend.metadata as any,
        shopId: "global", // Store globally, not per-shop
      },
    })
  );

  const results = await Promise.all(writes);
  return results.length;
}
