import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import prisma from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Fetch competitor data from the database
    const competitors = await prisma.competitorSpy.findMany({
      where: {
        OR: [
          { shopUrl: { contains: id } },
          { id: { contains: id } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });

    if (competitors.length === 0) {
      return NextResponse.json(
        { error: "Competitor not found" },
        { status: 404 }
      );
    }

    // Group products by domain
    const domain = competitors[0]?.shopUrl || id;
    const prices = competitors
      .map((c) => c.price)
      .filter((p): p is number => p !== null);
    const ratings = competitors
      .map((c) => c.rating)
      .filter((r): r is number => r !== null);
    const reviews = competitors
      .map((c) => c.reviewCount)
      .filter((r): r is number => r !== null);

    const avgPrice =
      prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    const totalSales = reviews.reduce((a, b) => a + b, 0);

    // Calculate weakness score (inverse of competitive strength)
    const reviewScore = Math.min(totalSales / 100, 1) * 40;
    const ratingScore = (avgRating / 5) * 30;
    const priceScore = avgPrice > 0 ? Math.max(0, 30 - (avgPrice / 100) * 30) : 15;
    const weaknessScore = Math.min(
      100,
      Math.round(reviewScore + ratingScore + priceScore)
    );

    // Map products from scraped data
    const products = competitors.slice(0, 20).map((comp, index) => {
      const rawData = comp.rawData as Record<string, unknown> | null;
      return {
        id: comp.id || `product-${index}`,
        title: comp.summary || rawData?.productTitle as string || "Unknown Product",
        price: comp.price || 0,
        rating: comp.rating || 0,
        sales: comp.reviewCount || 0,
        imageUrl: rawData?.imageUrl as string || undefined,
      };
    });

    // Calculate weakness breakdown
    const weaknessBreakdown = {
      pricing: avgPrice > 0 ? Math.round((1 - Math.min(avgPrice / 100, 1)) * 100) : 50,
      ratings: avgRating > 0 ? Math.round((avgRating / 5) * 100) : 50,
      reviews: totalSales > 0 ? Math.round(Math.min(totalSales / 50, 1) * 100) : 50,
      productVariety: Math.min(competitors.length / 10, 1) * 100,
    };

    // Generate AI summary placeholder (in real app, this would call AI service)
    const aiSummary = {
      overall: weaknessScore >= 70
        ? "High opportunity - competitor has significant weaknesses to exploit"
        : weaknessScore >= 40
        ? "Moderate opportunity - room for differentiation exists"
        : "Low opportunity - competitor is well-established",
      pricing:
        avgPrice > 50
          ? "Premium pricing - consider competitive or value positioning"
          : avgPrice > 25
          ? "Mid-market pricing - focus on value proposition"
          : "Budget pricing - differentiation through quality essential",
      recommendations: [
        ...(avgRating < 4
          ? ["Address common customer complaints to beat competitor ratings"]
          : []),
        ...(products.length < 10
          ? ["Competitor has limited catalog - expand your product range"]
          : []),
        ...(avgPrice > 30
          ? ["Consider competing on price or emphasizing unique value"]
          : []),
        "Focus on superior product imagery and descriptions",
        "Leverage customer reviews to build social proof",
      ],
    };

    return NextResponse.json({
      data: {
        id: domain,
        name: domain.replace(".myshopify.com", "").replace(".shopify.com", ""),
        shopDomain: domain,
        productCount: competitors.length,
        avgPrice,
        avgRating,
        totalSales,
        weaknessScore,
        weaknessBreakdown,
        products,
        aiSummary,
        charts: {
          priceRange: prices,
          ratings,
          reviewCounts: reviews,
          timeline: competitors.map((c) => ({
            date: c.updatedAt.toISOString(),
            price: c.price,
            rating: c.rating,
          })),
        },
      },
    });
  } catch (error) {
    console.error("[API] Competitor detail error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch competitor details",
      },
      { status: 500 }
    );
  }
}
