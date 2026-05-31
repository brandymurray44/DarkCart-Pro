import { TrendSnapshot } from "@prisma/client";
import prisma from "@/lib/db";

export interface TrendCandidate {
  source: string;
  title: string;
  url: string;
  imageUrl?: string;
  score: number;
  niche: string;
  metadata: Record<string, unknown>;
}

export async function fetchTrendingItems(
  niche?: string,
  source?: string
): Promise<TrendCandidate[]> {
  try {
    const where: Record<string, unknown> = {
      shopId: "global", // Fetch globally scraped trends
    };

    if (source) {
      where.source = source;
    }

    if (niche) {
      where.niche = niche;
    }

    const items = await prisma.trendSnapshot.findMany({
      where,
      orderBy: { score: "desc" },
      take: 50,
    });

    return items.map((item) => ({
      source: item.source,
      title: item.title,
      url: item.url,
      imageUrl: item.imageUrl || undefined,
      score: item.score,
      niche: item.niche,
      metadata: item.metadata as Record<string, unknown>,
    }));
  } catch (error) {
    console.error("Error fetching trending items:", error);
    return [];
  }
}

export function normalizeTrendCandidates(candidates: TrendCandidate[]): TrendCandidate[] {
  return candidates
    .map((item) => ({
      ...item,
      score: Math.min(100, Math.max(0, item.score)),
    }))
    .sort((a, b) => b.score - a.score);
}

export async function persistTrendingItems(shopId: string, candidates: TrendCandidate[]) {
  const prisma = (await import("@/lib/db")).default;

  const writes = candidates.map((candidate) =>
    prisma.trendSnapshot.create({
      data: {
        shopId,
        source: candidate.source,
        title: candidate.title,
        url: candidate.url,
        imageUrl: candidate.imageUrl,
        score: candidate.score,
        niche: candidate.niche,
        metadata: candidate.metadata as any,
      },
    })
  );

  return Promise.all(writes);
}
