export interface CompetitorScore {
  competitorId: string;
  name: string;
  priceCompetitiveness: number;
  qualityScore: number;
  reviewRating: number;
  marketShare: number;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  threats: string[];
}

export interface BenchmarkAnalysis {
  yourScore: number;
  avgCompetitorScore: number;
  bestCompetitor: CompetitorScore;
  worstCompetitor: CompetitorScore;
  positioning: "leader" | "above_average" | "average" | "below_average";
  gapAnalysis: {
    metric: string;
    yourValue: number;
    competitorAvg: number;
    gap: number;
    opportunity: boolean;
  }[];
}

export function calculateCompetitorScore(data: {
  price: number;
  avgPrice: number;
  quality: number;
  reviews: number;
  avgReviews: number;
  rating: number;
}): CompetitorScore {
  // Normalize scores 0-100
  const priceScore =
    data.avgPrice > 0 ? Math.min((data.avgPrice / data.price) * 100, 150) : 50;
  const qualityScore = Math.min((data.quality / 100) * 100, 100);
  const reviewScore = Math.min((data.reviews / Math.max(data.avgReviews, 1)) * 100, 150);
  const ratingScore = data.rating * 20; // 0-5 -> 0-100

  const overallScore = (priceScore + qualityScore + reviewScore + ratingScore) / 4;

  return {
    competitorId: "",
    name: "Competitor",
    priceCompetitiveness: Math.round(priceScore),
    qualityScore: Math.round(qualityScore),
    reviewRating: Math.round(reviewScore),
    marketShare: 0,
    overallScore: Math.round(overallScore),
    strengths: [],
    weaknesses: [],
    threats: [],
  };
}

export function identifyStrengthsWeaknesses(score: CompetitorScore, yourScore: number): void {
  // Strengths (where competitor outperforms)
  if (score.priceCompetitiveness > yourScore * 0.85) {
    score.strengths.push("Better pricing strategy");
  }
  if (score.qualityScore > yourScore + 10) {
    score.strengths.push("Higher quality products");
  }
  if (score.reviewRating > yourScore + 15) {
    score.strengths.push("Strong customer satisfaction");
  }

  // Weaknesses
  if (score.priceCompetitiveness < yourScore * 0.7) {
    score.weaknesses.push("Overpriced compared to you");
  }
  if (score.qualityScore < yourScore - 10) {
    score.weaknesses.push("Lower product quality");
  }
  if (score.reviewRating < yourScore - 15) {
    score.weaknesses.push("Poor customer reviews");
  }

  // Threats
  if (score.overallScore > yourScore * 1.2) {
    score.threats.push("Significantly outperforming");
  }
  if (score.reviewRating > 80) {
    score.threats.push("Strong customer loyalty");
  }
}

export function benchmarkAgainstCompetitors(
  yourMetrics: Record<string, number>,
  competitors: Record<string, Record<string, number>[]>,
): BenchmarkAnalysis {
  const yourScore = calculateScore(yourMetrics).overallScore;

  const competitorScores = Object.entries(competitors).map(([name, data]) => {
    const score = calculateScore(data[data.length - 1] || {});
    score.name = name;
    identifyStrengthsWeaknesses(score, yourScore);
    return score;
  });

  const avgScore = competitorScores.reduce((sum, s) => sum + s.overallScore, 0) / Math.max(competitorScores.length, 1);
  const bestCompetitor = competitorScores.reduce((best, current) =>
    current.overallScore > best.overallScore ? current : best,
  );
  const worstCompetitor = competitorScores.reduce((worst, current) =>
    current.overallScore < worst.overallScore ? current : worst,
  );

  let positioning: BenchmarkAnalysis["positioning"] = "average";
  if (yourScore > avgScore * 1.2) positioning = "leader";
  else if (yourScore > avgScore * 1.05) positioning = "above_average";
  else if (yourScore < avgScore * 0.85) positioning = "below_average";

  const gapAnalysis = Object.entries(yourMetrics).map(([metric, value]) => {
    const competitorValues = competitorScores.map((c) => (c[metric as keyof CompetitorScore] as number) || 0);
    const competitorAvg = competitorValues.reduce((a, b) => a + b, 0) / Math.max(competitorValues.length, 1);

    return {
      metric,
      yourValue: value,
      competitorAvg,
      gap: competitorAvg - value,
      opportunity: value < competitorAvg && competitorAvg - value > 10,
    };
  });

  return {
    yourScore,
    avgCompetitorScore: Math.round(avgScore),
    bestCompetitor: bestCompetitor.overallScore ? bestCompetitor : competitorScores[0],
    worstCompetitor: worstCompetitor.overallScore ? worstCompetitor : competitorScores[0],
    positioning,
    gapAnalysis,
  };
}

function calculateScore(metrics: Record<string, any>): CompetitorScore {
  return {
    competitorId: "",
    name: "Competitor",
    priceCompetitiveness: metrics.priceCompetitiveness || 50,
    qualityScore: metrics.qualityScore || 50,
    reviewRating: metrics.reviewRating || 50,
    marketShare: metrics.marketShare || 0,
    overallScore: metrics.overallScore || 50,
    strengths: [],
    weaknesses: [],
    threats: [],
  };
}

export interface CompetitiveAdvantage {
  area: string;
  advantage: "leader" | "competitive" | "lagging";
  score: number;
  recommendation: string;
}

export function identifyCompetitiveAdvantages(
  your: Record<string, number>,
  competitors: Record<string, number>,
): CompetitiveAdvantage[] {
  return Object.entries(your).map(([area, yourValue]) => {
    const competitorAvg = (competitors[area] || 0);
    const diff = ((yourValue - competitorAvg) / Math.max(competitorAvg, 1)) * 100;

    let advantage: "leader" | "competitive" | "lagging";
    if (diff > 20) advantage = "leader";
    else if (diff > -10) advantage = "competitive";
    else advantage = "lagging";

    let recommendation = "";
    if (advantage === "leader") {
      recommendation = `Leverage your ${area} advantage in marketing and positioning`;
    } else if (advantage === "competitive") {
      recommendation = `Maintain parity in ${area} while focusing on other areas`;
    } else {
      recommendation = `Invest in improving ${area} to close the gap with competitors`;
    }

    return {
      area,
      advantage,
      score: Math.round(yourValue),
      recommendation,
    };
  });
}
