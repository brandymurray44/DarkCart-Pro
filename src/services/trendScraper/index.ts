import { scrapeTikTok } from "./tiktok";
import { scrapeEtsy } from "./etsy";
import { scrapeReddit } from "./reddit";
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

interface RawTrend {
  id: string;
  title: string;
  description: string;
  score: number;
  url: string;
  image?: string;
  timestamp: Date;
}

function generateId(title: string, source: string): string {
  return createHash("md5")
    .update(`${source}:${title}`)
    .digest("hex");
}

function normalizeTrend(
  trend: RawTrend,
  source: NormalizedTrend["source"],
  niche: string,
  extraMetadata: Record<string, unknown> = {}
): NormalizedTrend {
  return {
    id: generateId(trend.title, source),
    title: trend.title,
    description: trend.description,
    score: Math.min(100, Math.max(0, trend.score)),
    source,
    url: trend.url,
    image: trend.image,
    niche,
    metadata: {
      original_id: trend.id,
      scraped_at: new Date().toISOString(),
      ...extraMetadata,
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

interface ScraperConfig {
  name: string;
  source: NormalizedTrend["source"];
  niche: string;
  scrape: () => Promise<RawTrend[]>;
  extraMetadata?: (trend: RawTrend) => Record<string, unknown>;
}

const scraperConfigs: ScraperConfig[] = [
  {
    name: "TikTok",
    source: "tiktok",
    niche: "general",
    scrape: scrapeTikTok as () => Promise<RawTrend[]>,
  },
  {
    name: "Etsy",
    source: "etsy",
    niche: "ecommerce",
    scrape: scrapeEtsy as () => Promise<RawTrend[]>,
  },
  {
    name: "Reddit",
    source: "reddit",
    niche: "business",
    scrape: scrapeReddit as () => Promise<RawTrend[]>,
    extraMetadata: (trend) => ({
      subreddit: trend.url.includes("reddit.com") ? "general" : "specific",
    }),
  },
];

export async function scrapeAllTrends(): Promise<NormalizedTrend[]> {
  const results: NormalizedTrend[] = [];

  for (const config of scraperConfigs) {
    try {
      console.log(`[TrendScraper] Starting ${config.name} scrape...`);
      const trends = await config.scrape();
      const normalized = trends.map((t) =>
        normalizeTrend(t, config.source, config.niche, config.extraMetadata?.(t))
      );
      results.push(...normalized);
      console.log(`[TrendScraper] Scraped ${trends.length} ${config.name} trends`);
    } catch (error) {
      console.error(`[TrendScraper] ${config.name} scraping failed:`, error);
    }
  }

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
        shopId: "global",
      },
    })
  );

  const results = await Promise.all(writes);
  return results.length;
}
