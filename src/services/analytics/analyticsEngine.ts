import {
  aggregateTrendIntelligence,
  aggregateCompetitorIntelligence,
  aggregateMerchantPerformance,
  getShopMetadata,
  getUserNiche,
} from "./aggregators";
import {
  scoreOpportunity,
  calculateMerchantStrength,
  calculateCompetitorWeakness,
  calculateTrendDemand,
  calculateMerchantReadiness,
  calculateTrendCoverage,
  calculatePriceCompetitiveness,
  calculateReviewCompetitiveness,
} from "./scoring";
import prisma from "@/lib/db";

export interface AnalyticsOverview {
  shop: {
    domain: string;
    name: string;
  };
  performance: {
    revenue30Days: number;
    orders30Days: number;
    salesVelocity: number;
    avgOrderValue: number;
    merchantStrength: number;
  };
  trends: {
    topTrends: number;
    trendVelocity: number;
    averageTrendScore: number;
  };
  competitors: {
    count: number;
    avgScore: number;
  };
  overlap: {
    trendCoverage: number;
    opportunityScore: number;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  trendScore: number;
  competitorWeakness: number;
  merchantReadiness: number;
  opportunityScore: number;
  reason: string;
}

export interface ProductAnalytics {
  id: string;
  title: string;
  price: number;
  published: boolean;
  trendAlignment: number;
  competitorComparison: {
    priceCompetitiveness: number;
    reviewCompetitiveness: number;
  };
}

/**
 * Generate analytics overview
 */
export async function generateOverview(
  userId: string,
  shopId: string
): Promise<AnalyticsOverview | null> {
  try {
    const niche = await getUserNiche(userId);
    if (!niche) return null;

    const shop = await getShopMetadata(shopId);
    if (!shop) return null;

    const trends = await aggregateTrendIntelligence(niche);
    const competitors = await aggregateCompetitorIntelligence(niche);
    const merchant = await aggregateMerchantPerformance(shopId);

    const merchantStrength = calculateMerchantStrength(
      merchant.salesVelocity,
      merchant.orders30Days,
      merchant.productCount,
      merchant.avgOrderValue
    );

    // Get merchant products for trend coverage
    const merchantProducts = await prisma.product.findMany({
      where: { shopId },
      take: 20,
    });
    const merchantProductTitles = merchantProducts.map((p) => p.title);
    const trendTitles = trends.topTrends.map((t) => t.title);
    const trendCoverage = calculateTrendCoverage(
      merchantProductTitles,
      trendTitles
    );

    // Calculate opportunity score
    const competitorWeakness =
      competitors.competitorCount > 0
        ? calculateCompetitorWeakness(
            competitors.ratingRange.max,
            competitors.competitorCount * 10,
            competitors.topCompetitors[0]?.productCount || 0,
            competitors.priceRange
          )
        : 30;

    const merchantReadiness = calculateMerchantReadiness(
      merchant.productCount > 0,
      merchant.publishedProducts,
      merchant.productCount / 10
    );

    const { score: opportunityScore } = scoreOpportunity(
      trends.averageTrendScore,
      competitorWeakness,
      merchantReadiness
    );

    return {
      shop: {
        domain: shop.shopifyDomain,
        name: shop.shopifyDomain.split(".")[0],
      },
      performance: {
        revenue30Days: merchant.revenue30Days,
        orders30Days: merchant.orders30Days,
        salesVelocity: merchant.salesVelocity,
        avgOrderValue: merchant.avgOrderValue,
        merchantStrength,
      },
      trends: {
        topTrends: trends.topTrends.length,
        trendVelocity: Math.round(trends.trendVelocity * 100) / 100,
        averageTrendScore: trends.averageTrendScore,
      },
      competitors: {
        count: competitors.competitorCount,
        avgScore: competitors.avgCompetitorScore,
      },
      overlap: {
        trendCoverage,
        opportunityScore,
      },
    };
  } catch (error) {
    console.error("[Analytics] Error generating overview:", error);
    throw error;
  }
}

/**
 * Generate ranked opportunities
 */
export async function generateOpportunities(
  userId: string,
  shopId: string,
  limit: number = 10
): Promise<Opportunity[]> {
  try {
    const niche = await getUserNiche(userId);
    if (!niche) return [];

    const trends = await aggregateTrendIntelligence(niche);
    const competitors = await aggregateCompetitorIntelligence(niche);
    const merchant = await aggregateMerchantPerformance(shopId);

    const merchantProducts = await prisma.product.findMany({
      where: { shopId },
      select: { title: true },
    });
    const merchantProductTitles = merchantProducts.map((p) => p.title);

    const opportunities: Opportunity[] = [];

    for (const trend of trends.topTrends.slice(0, 20)) {
      // Skip if merchant already covers this trend
      const covered = merchantProductTitles.some((title) =>
        title.toLowerCase().includes(trend.title.toLowerCase())
      );
      if (covered) continue;

      const competitorWeakness = calculateCompetitorWeakness(
        competitors.ratingRange.max || 4,
        competitors.competitorCount * 10,
        competitors.topCompetitors[0]?.productCount || 20,
        competitors.priceRange
      );

      const merchantReadiness = calculateMerchantReadiness(
        merchant.productCount > 0,
        merchant.publishedProducts,
        merchant.productCount / 10
      );

      const { score: opportunityScore } = scoreOpportunity(
        trend.score,
        competitorWeakness,
        merchantReadiness
      );

      opportunities.push({
        id: trend.id,
        title: trend.title,
        trendScore: trend.score,
        competitorWeakness,
        merchantReadiness,
        opportunityScore,
        reason: `High demand trend (${trend.source}) with competitive gap`,
      });
    }

    // Sort by opportunity score and return top N
    return opportunities
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, limit);
  } catch (error) {
    console.error("[Analytics] Error generating opportunities:", error);
    throw error;
  }
}

/**
 * Generate product analytics
 */
export async function generateProductAnalytics(
  userId: string,
  shopId: string
): Promise<ProductAnalytics[]> {
  try {
    const niche = await getUserNiche(userId);
    if (!niche) return [];

    const trends = await aggregateTrendIntelligence(niche);
    const competitors = await aggregateCompetitorIntelligence(niche);

    const products = await prisma.product.findMany({
      where: { shopId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const trendTitles = trends.topTrends.map((t) => t.title);

    return products.map((product) => {
      // Calculate trend alignment
      const productWords = product.title.toLowerCase().split(" ");
      const matchedTrends = trendTitles.filter((trend) => {
        const trendWords = trend.toLowerCase().split(" ");
        const matches = trendWords.filter((w) =>
          productWords.some((pw) => pw.includes(w))
        );
        return matches.length > 0;
      });
      const trendAlignment =
        trendTitles.length > 0
          ? (matchedTrends.length / trendTitles.length) * 100
          : 0;

      // Price competitiveness
      const competitorPrices = competitors.topCompetitors.map((c) => c.avgPrice);
      const priceCompetitiveness =
        competitorPrices.length > 0
          ? calculatePriceCompetitiveness(
              product.description ? parseInt(product.description) : 0,
              competitorPrices
            )
          : 50;

      // Review competitiveness
      const competitorRatings = competitors.topCompetitors.map(
        (c) => c.avgRating
      );
      const reviewCompetitiveness =
        competitorRatings.length > 0
          ? calculateReviewCompetitiveness(4, competitorRatings)
          : 50;

      return {
        id: product.id,
        title: product.title,
        price: 0, // Not stored in Product model, would need separate lookup
        published: product.published,
        trendAlignment: Math.round(trendAlignment),
        competitorComparison: {
          priceCompetitiveness,
          reviewCompetitiveness,
        },
      };
    });
  } catch (error) {
    console.error("[Analytics] Error generating product analytics:", error);
    throw error;
  }
}
