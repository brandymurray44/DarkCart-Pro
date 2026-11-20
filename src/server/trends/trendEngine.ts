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
  intelligenceLevel?: "public" | "restricted" | "classified" | "top-secret";
  confidence?: number;
  velocity?: number;
}

export async function fetchTrendingItems(
  niche?: string,
  source?: string,
  intelligenceLevel?: "public" | "restricted" | "classified" | "top-secret",
  minConfidence?: number
): Promise<TrendCandidate[]> {
  try {
    const where: Record<string, unknown> = {
      shopId: null, // Fetch globally scraped trends (no shop scoping)
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

    const candidates = items.map((item) => ({
      source: item.source,
      title: item.title,
      url: item.url,
      imageUrl: item.imageUrl || undefined,
      score: item.score,
      niche: item.niche,
      metadata: item.metadata as Record<string, unknown>,
    }));

    // Apply intelligence classification
    const classified = classifyTrendIntelligence(candidates);
    
    // Filter by intelligence level if specified
    let filtered = classified;
    if (intelligenceLevel) {
      const levelOrder = ["public", "restricted", "classified", "top-secret"];
      const minLevel = levelOrder.indexOf(intelligenceLevel);
      filtered = classified.filter(t => {
        const tLevel = t.intelligenceLevel || "public";
        return levelOrder.indexOf(tLevel) >= minLevel;
      });
    }
    
    // Filter by confidence if specified
    if (minConfidence) {
      filtered = filtered.filter(t => (t.confidence || 0) >= minConfidence);
    }

    return filtered;
  } catch (error) {
    console.error("Error fetching trending items:", error);
    return [];
  }
}

function classifyTrendIntelligence(candidates: TrendCandidate[]): TrendCandidate[] {
  return candidates.map(candidate => {
    const score = candidate.score;
    let intelligenceLevel: "public" | "restricted" | "classified" | "top-secret";
    let confidence = Math.min(100, score);
    
    // Intelligence classification based on score and metadata
    if (score >= 90) {
      intelligenceLevel = "top-secret";
      confidence = Math.min(100, score + 10);
    } else if (score >= 75) {
      intelligenceLevel = "classified";
      confidence = Math.min(100, score + 5);
    } else if (score >= 60) {
      intelligenceLevel = "restricted";
    } else {
      intelligenceLevel = "public";
    }
    
    // Calculate velocity from metadata if available
    const velocity = candidate.metadata.velocity as number | undefined;
    
    return {
      ...candidate,
      intelligenceLevel,
      confidence,
      velocity
    };
  });
}

export function normalizeTrendCandidates(candidates: TrendCandidate[]): TrendCandidate[] {
  return candidates
    .map((item) => ({
      ...item,
      score: Math.min(100, Math.max(0, item.score)),
    }))
    .sort((a, b) => b.score - a.score);
}

export async function persistTrendingItems(shopId: string | null, candidates: TrendCandidate[]) {
  const prisma = (await import("@/lib/db")).default;

  const writes = candidates.map((candidate) =>
    prisma.trendSnapshot.create({
      data: {
        shopId: shopId ?? undefined,
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
