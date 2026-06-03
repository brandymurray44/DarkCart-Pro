import prisma from "@/lib/db";
import { fetchMerchantStoreData } from "@/services/competitorScraper/adminApi";
import { getCompetitorIntelligence } from "@/services/competitorEngine";

export interface TrendIntelligence {
  topTrends: Array<{
    id: string;
    title: string;
    score: number;
    source: string;
    timestamp: Date;
  }>;
  totalTrends: number;
  trendVelocity: number; // trends per day
  averageTrendScore: number;
}

export interface CompetitorIntelligence {
  competitorCount: number;
  avgCompetitorScore: number;
  priceRange: { min: number; max: number };
  ratingRange: { min: number; max: number };
  topCompetitors: Array<{
    domain: string;
    productCount: number;
    avgPrice: number;
    avgRating: number;
    score: number;
  }>;
}

export interface MerchantPerformance {
  revenue30Days: number;
  orders30Days: number;
  salesVelocity: number;
  avgOrderValue: number;
  productCount: number;
  publishedProducts: number;
  topProducts: Array<{ title: string; price: number }>;
  underperformingProducts: Array<{ title: string; price: number }>;
}

/**
 * Aggregate trend data for analytics
 */
export async function aggregateTrendIntelligence(
  niche: string
): Promise<TrendIntelligence> {
  try {
    const trends = await prisma.trendSnapshot.findMany({
      where: { niche },
      orderBy: { score: "desc" },
      take: 100,
    });

    const topTrends = trends.slice(0, 10);
    const totalTrends = trends.length;

    // Calculate velocity (trends per day)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTrends = trends.filter(
      (t) => t.createdAt > thirtyDaysAgo
    );
    const trendVelocity = recentTrends.length / 30;

    // Average score
    const averageTrendScore =
      trends.length > 0
        ? Math.round(
            trends.reduce((sum, t) => sum + t.score, 0) / trends.length
          )
        : 0;

    return {
      topTrends: topTrends.map((t) => ({
        id: t.id,
        title: t.title,
        score: t.score,
        source: t.source,
        timestamp: t.createdAt,
      })),
      totalTrends,
      trendVelocity,
      averageTrendScore,
    };
  } catch (error) {
    console.error("[Analytics] Error aggregating trends:", error);
    throw error;
  }
}

/**
 * Aggregate competitor data for analytics
 */
export async function aggregateCompetitorIntelligence(
  niche: string
): Promise<CompetitorIntelligence> {
  try {
    const competitors = await getCompetitorIntelligence(niche);

    if (competitors.length === 0) {
      return {
        competitorCount: 0,
        avgCompetitorScore: 0,
        priceRange: { min: 0, max: 0 },
        ratingRange: { min: 0, max: 0 },
        topCompetitors: [],
      };
    }

    const prices = competitors.map((c) => c.avgPrice).filter((p) => p > 0);
    const ratings = competitors
      .map((c) => c.avgRating)
      .filter((r) => r > 0);
    const scores = competitors.map((c) => c.score);

    return {
      competitorCount: competitors.length,
      avgCompetitorScore: Math.round(
        scores.reduce((a, b) => a + b, 0) / scores.length
      ),
      priceRange: {
        min: Math.min(...prices),
        max: Math.max(...prices),
      },
      ratingRange: {
        min: Math.min(...ratings),
        max: Math.max(...ratings),
      },
      topCompetitors: competitors.slice(0, 5).map((c) => ({
        domain: c.competitorDomain,
        productCount: c.productCount,
        avgPrice: c.avgPrice,
        avgRating: c.avgRating,
        score: c.score,
      })),
    };
  } catch (error) {
    console.error("[Analytics] Error aggregating competitors:", error);
    throw error;
  }
}

/**
 * Aggregate merchant store performance
 */
export async function aggregateMerchantPerformance(
  shopId: string
): Promise<MerchantPerformance> {
  try {
    const storeData = await fetchMerchantStoreData(shopId);

    if (!storeData) {
      return {
        revenue30Days: 0,
        orders30Days: 0,
        salesVelocity: 0,
        avgOrderValue: 0,
        productCount: 0,
        publishedProducts: 0,
        topProducts: [],
        underperformingProducts: [],
      };
    }

    // Get published products
    const publishedProducts = await prisma.product.findMany({
      where: { shopId, published: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      revenue30Days: storeData.stats.totalRevenue,
      orders30Days: storeData.stats.totalOrders,
      salesVelocity: storeData.stats.salesVelocity,
      avgOrderValue: storeData.stats.avgOrderValue,
      productCount: storeData.stats.totalProducts,
      publishedProducts: publishedProducts.length,
      topProducts: storeData.products
        .sort((a, b) => b.price - a.price)
        .slice(0, 5)
        .map((p) => ({
          title: p.title,
          price: p.price,
        })),
      underperformingProducts: storeData.products
        .sort((a, b) => a.price - b.price)
        .slice(0, 3)
        .map((p) => ({
          title: p.title,
          price: p.price,
        })),
    };
  } catch (error) {
    console.error("[Analytics] Error aggregating merchant performance:", error);
    throw error;
  }
}

/**
 * Get shop metadata
 */
export async function getShopMetadata(shopId: string) {
  try {
    return await prisma.shop.findUnique({
      where: { id: shopId },
      include: { user: true },
    });
  } catch (error) {
    console.error("[Analytics] Error fetching shop metadata:", error);
    throw error;
  }
}

/**
 * Get user's niche
 */
export async function getUserNiche(userId: string): Promise<string | null> {
  try {
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId },
    });
    return onboarding?.niche || null;
  } catch (error) {
    console.error("[Analytics] Error fetching user niche:", error);
    throw error;
  }
}
