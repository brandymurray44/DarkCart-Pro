import prisma from "@/lib/db";

export interface CompetitorIntelligence {
  competitorDomain: string;
  productCount: number;
  avgPrice: number;
  avgRating: number;
  topProducts: Array<{
    title: string;
    price: number;
    rating: number;
    reviews: number;
  }>;
  score: number;
  lastUpdated: Date;
}

export async function getCompetitorIntelligence(
  niche: string
): Promise<CompetitorIntelligence[]> {
  try {
    const competitors = await prisma.competitorSpy.findMany({
      where: {
        rawData: {
          path: ["niche"],
          equals: niche,
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 20,
    });

    // Group by competitor domain
    const grouped = new Map<string, typeof competitors>();

    for (const competitor of competitors) {
      const domain =
        ((competitor.rawData as Record<string, unknown>)
          ?.competitorDomain as string) || competitor.shopUrl || "unknown";
      if (!grouped.has(domain)) {
        grouped.set(domain, []);
      }
      grouped.get(domain)!.push(competitor);
    }

    return Array.from(grouped.entries()).map(([domain, items]) => {
      const prices = items
        .map((i) => i.price)
        .filter((p): p is number => p !== null);
      const ratings = items
        .map((i) => i.rating)
        .filter((r): r is number => r !== null);

      const avgPrice =
        prices.length > 0
          ? prices.reduce((a, b) => a + b, 0) / prices.length
          : 0;
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;

      const score = calculateCompetitorDomainScore(items);

      return {
        competitorDomain: domain,
        productCount: items.length,
        avgPrice,
        avgRating,
        topProducts: items
          .slice(0, 5)
          .map((item) => ({
            title: item.summary || "Unknown",
            price: item.price || 0,
            rating: item.rating || 0,
            reviews: item.reviewCount || 0,
          })),
        score,
        lastUpdated: items[0].updatedAt,
      };
    });
  } catch (error) {
    console.error("[CompetitorEngine] Error fetching competitor intelligence:", error);
    throw error;
  }
}

function calculateCompetitorDomainScore(
  competitors: Array<{
    price: number | null;
    rating: number | null;
    reviewCount: number | null;
  }>
): number {
  const reviews = competitors.reduce(
    (sum, c) => sum + (c.reviewCount || 0),
    0
  );
  const ratings = competitors
    .filter((c): c is typeof competitors[0] & { rating: number } => c.rating !== null && c.rating > 0)
    .map((c) => c.rating);
  const avgRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  const reviewScore = Math.min(reviews / 100, 1) * 40;
  const ratingScore = (avgRating / 5) * 30;
  const productScore = Math.min(competitors.length / 100, 1) * 30;

  return Math.min(
    100,
    Math.round(reviewScore + ratingScore + productScore)
  );
}

export async function getUserCompetitors(
  userId: string
): Promise<{ domain: string; niche: string }[]> {
  try {
    // Get user's onboarding niche
    const onboarding = await prisma.onboarding.findUnique({
      where: { userId },
    });

    if (!onboarding) {
      return [];
    }

    // Get competitors for this niche (stored as raw data)
    const competitors = await prisma.competitorSpy.findMany({
      distinct: ["shopUrl"],
      where: {
        rawData: {
          path: ["niche"],
          equals: onboarding.niche,
        },
      },
    });

    return competitors.map((c) => ({
      domain: c.shopUrl,
      niche: onboarding.niche,
    }));
  } catch (error) {
    console.error("[CompetitorEngine] Error fetching user competitors:", error);
    throw error;
  }
}
