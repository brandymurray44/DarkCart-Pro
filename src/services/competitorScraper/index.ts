import { scrapeCompetitorStorefront } from "./storefront";
import { fetchMerchantStoreData } from "./adminApi";
import prisma from "@/lib/db";

export interface NormalizedCompetitor {
  id: string;
  title: string;
  price: number;
  image?: string;
  url: string;
  reviews: number;
  rating: number;
  salesEstimate: number;
  source: "competitor" | "merchant";
  competitorDomain: string;
  niche: string;
  score: number;
  timestamp: Date;
}

export async function scrapeCompetitorData(
  competitorDomain: string,
  niche: string
): Promise<NormalizedCompetitor[]> {
  try {
    const products = await scrapeCompetitorStorefront(competitorDomain);

    return products.map((product, index) => ({
      id: `comp_${competitorDomain}_${index}_${Date.now()}`,
      title: product.title,
      price: product.price,
      image: product.image,
      url: product.url,
      reviews: product.reviews,
      rating: product.rating,
      salesEstimate: product.salesEstimate,
      source: "competitor" as const,
      competitorDomain,
      niche,
      score: calculateCompetitorScore(product),
      timestamp: new Date(),
    }));
  } catch (error) {
    console.error(`Failed to scrape competitor ${competitorDomain}:`, error);
    return [];
  }
}

export async function scrapeOwnStoreData(
  shopId: string,
  niche: string
): Promise<NormalizedCompetitor[]> {
  try {
    const storeData = await fetchMerchantStoreData(shopId);

    if (!storeData) {
      return [];
    }

    const shop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!shop) {
      return [];
    }

    return storeData.products.map((product, index) => ({
      id: `own_${shopId}_${index}`,
      title: product.title,
      price: product.price,
      image: product.image,
      url: `https://${shop.shopifyDomain}/products/${product.title
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      reviews: 0,
      rating: 0,
      salesEstimate: Math.floor(
        storeData.stats.salesVelocity * Math.random() * 10
      ),
      source: "merchant" as const,
      competitorDomain: shop.shopifyDomain,
      niche,
      score: calculateMerchantScore(product, storeData),
      timestamp: new Date(),
    }));
  } catch (error) {
    console.error(`Failed to scrape own store data for ${shopId}:`, error);
    return [];
  }
}

function calculateCompetitorScore(product: {
  reviews: number;
  rating: number;
  price: number;
  salesEstimate: number;
}): number {
  const reviewScore = Math.min(product.reviews / 100, 1) * 25; // 25 points max
  const ratingScore = (product.rating / 5) * 25; // 25 points max
  const salesScore = Math.min(product.salesEstimate / 100, 1) * 30; // 30 points max
  const priceScore = Math.max(0, (100 - product.price) / 100) * 20; // 20 points max

  return Math.min(
    100,
    Math.round(reviewScore + ratingScore + salesScore + priceScore)
  );
}

function calculateMerchantScore(
  product: { price: number; variants: number },
  storeData: {
    stats: {
      totalOrders: number;
      salesVelocity: number;
      avgOrderValue: number;
    };
  }
): number {
  const velocityScore = Math.min(
    storeData.stats.salesVelocity * 10,
    1
  ) * 40;
  const avgOrderScore =
    Math.min(storeData.stats.avgOrderValue / 100, 1) * 30;
  const variantsScore = Math.min(product.variants / 5, 1) * 20;
  const priceScore = Math.max(0, (100 - product.price) / 100) * 10;

  return Math.min(
    100,
    Math.round(velocityScore + avgOrderScore + variantsScore + priceScore)
  );
}

export async function persistCompetitorIntelligence(
  competitors: NormalizedCompetitor[]
): Promise<number> {
  let persistedCount = 0;

  for (const competitor of competitors) {
    try {
      await prisma.competitorSpy.upsert({
        where: { id: competitor.id },
        update: {
          price: competitor.price,
          rating: competitor.rating,
          reviewCount: competitor.reviews,
          summary: competitor.title,
          rawData: {
            niche: competitor.niche,
            score: competitor.score,
            competitorDomain: competitor.competitorDomain,
            source: competitor.source,
            image: competitor.image,
            url: competitor.url,
            salesEstimate: competitor.salesEstimate,
            timestamp: competitor.timestamp.toISOString(),
          } as any,
        },
        create: {
          id: competitor.id,
          shopUrl: competitor.competitorDomain,
          productUrl: competitor.url,
          price: competitor.price,
          rating: competitor.rating,
          reviewCount: competitor.reviews,
          summary: competitor.title,
          rawData: {
            niche: competitor.niche,
            score: competitor.score,
            competitorDomain: competitor.competitorDomain,
            source: competitor.source,
            image: competitor.image,
            salesEstimate: competitor.salesEstimate,
            timestamp: competitor.timestamp.toISOString(),
          } as any,
        },
      });

      persistedCount++;
    } catch (error) {
      console.error(
        `Failed to persist competitor ${competitor.id}:`,
        error
      );
    }
  }

  return persistedCount;
}

export async function deduplicateCompetitors(
  competitors: NormalizedCompetitor[]
): Promise<NormalizedCompetitor[]> {
  const seen = new Map<string, NormalizedCompetitor>();

  for (const competitor of competitors) {
    const key = `${competitor.title
      .toLowerCase()
      .trim()}:${competitor.competitorDomain}`;
    if (!seen.has(key)) {
      seen.set(key, competitor);
    }
  }

  return Array.from(seen.values());
}
