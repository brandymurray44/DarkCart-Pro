/**
 * Scoring engine for analytics
 * Computes opportunity scores, strength scores, and overlap metrics
 */

export interface OpportunityScore {
  score: number; // 0-100
  trendDemandWeight: number;
  competitorWeaknessWeight: number;
  merchantReadinessWeight: number;
}

export interface StrengthScore {
  merchant: number; // 0-100
  competitor: number; // 0-100
  gap: number; // 0-100
}

export interface OverlapMetrics {
  trendCoverage: number; // % of trends merchant covers
  missingTrends: number; // count
  trendAlignmentScore: number; // 0-100
  priceCompetitiveness: number; // 0-100
  reviewCompetitiveness: number; // 0-100
  featureCompetitiveness: number; // 0-100
}

/**
 * Score a single opportunity (trend + competitor + merchant)
 */
export function scoreOpportunity(
  trendDemand: number, // 0-100
  competitorWeakness: number, // 0-100
  merchantReadiness: number // 0-100
): OpportunityScore {
  // Weights: trend (40%), competitor (35%), merchant readiness (25%)
  const score = Math.round(
    trendDemand * 0.4 +
      competitorWeakness * 0.35 +
      merchantReadiness * 0.25
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    trendDemandWeight: 0.4,
    competitorWeaknessWeight: 0.35,
    merchantReadinessWeight: 0.25,
  };
}

/**
 * Calculate merchant strength score
 * Based on: sales velocity, orders, product count, engagement
 */
export function calculateMerchantStrength(
  salesVelocity: number, // orders per day
  totalOrders: number,
  totalProducts: number,
  avgOrderValue: number
): number {
  const velocityScore = Math.min(salesVelocity / 5, 1) * 35; // 35 points
  const ordersScore = Math.min(totalOrders / 100, 1) * 25; // 25 points
  const productScore = Math.min(totalProducts / 50, 1) * 20; // 20 points
  const aovScore = Math.min(avgOrderValue / 100, 1) * 20; // 20 points

  return Math.round(velocityScore + ordersScore + productScore + aovScore);
}

/**
 * Calculate competitor weakness score
 * Lower ratings, fewer reviews, or gaps in pricing suggest weakness
 */
export function calculateCompetitorWeakness(
  avgRating: number, // 0-5
  reviewCount: number,
  productCount: number,
  priceRange: { min: number; max: number }
): number {
  // Inverse: lower rating = higher weakness
  const ratingWeakness = (1 - avgRating / 5) * 30; // 30 points
  const reviewWeakness = Math.max(0, (500 - reviewCount) / 500) * 30; // 30 points (fewer reviews = weaker)
  const productWeakness = Math.max(0, (100 - productCount) / 100) * 20; // 20 points (fewer products = weaker)
  const priceGapWeakness = Math.abs(priceRange.max - priceRange.min) / 100 * 20; // 20 points

  return Math.round(
    Math.min(ratingWeakness + reviewWeakness + productWeakness + priceGapWeakness, 100)
  );
}

/**
 * Calculate trend demand score
 * Based on: freshness, velocity, search interest
 */
export function calculateTrendDemand(
  score: number, // 0-100 from trend engine
  recencyDays: number,
  occurrences: number // how many sources mention this trend
): number {
  const ageMultiplier = Math.max(0.5, 1 - recencyDays / 60); // Decay over 60 days
  const frequencyBonus = Math.min(occurrences * 10, 20); // Up to +20
  const demand = score * ageMultiplier + frequencyBonus;

  return Math.min(100, Math.round(demand));
}

/**
 * Calculate merchant readiness
 * Based on: product count, inventory depth, publishing velocity
 */
export function calculateMerchantReadiness(
  hasProducts: boolean,
  publishedRecently: number, // count of products published in last 30 days
  avgInventory: number
): number {
  if (!hasProducts) return 30; // Very low if no products

  const publishingScore = Math.min(publishedRecently * 10, 40); // 40 points
  const inventoryScore = Math.min(avgInventory / 100, 1) * 40; // 40 points
  const foundationScore = hasProducts ? 20 : 0; // 20 points

  return Math.round(publishingScore + inventoryScore + foundationScore);
}

/**
 * Calculate trend coverage overlap
 */
export function calculateTrendCoverage(
  merchantProductTitles: string[],
  topTrends: string[],
  threshold: number = 0.3 // word overlap threshold
): number {
  if (topTrends.length === 0) return 0;

  const merchantText = merchantProductTitles.join(" ").toLowerCase();
  let coveredCount = 0;

  for (const trend of topTrends) {
    const trendWords = trend.toLowerCase().split(" ");
    const matchedWords = trendWords.filter((word) =>
      merchantText.includes(word)
    );

    if (matchedWords.length / trendWords.length >= threshold) {
      coveredCount++;
    }
  }

  return Math.round((coveredCount / topTrends.length) * 100);
}

/**
 * Calculate price competitiveness
 * Merchant vs median competitor price
 */
export function calculatePriceCompetitiveness(
  merchantAvgPrice: number,
  competitorPrices: number[]
): number {
  if (competitorPrices.length === 0) return 50;

  const sorted = competitorPrices.sort((a, b) => a - b);
  const medianCompetitorPrice =
    sorted[Math.floor(sorted.length / 2)];

  // If merchant is 10% lower, score is high
  const priceRatio = merchantAvgPrice / medianCompetitorPrice;
  const competitiveness = Math.max(0, 100 - Math.abs(1 - priceRatio) * 100);

  return Math.round(competitiveness);
}

/**
 * Calculate review competitiveness
 * Merchant vs median competitor rating
 */
export function calculateReviewCompetitiveness(
  merchantAvgRating: number,
  competitorRatings: number[]
): number {
  if (competitorRatings.length === 0) return 50;

  const medianCompetitorRating =
    competitorRatings.reduce((a, b) => a + b, 0) /
    competitorRatings.length;

  const ratingDifference = merchantAvgRating - medianCompetitorRating;
  const competitiveness = 50 + ratingDifference * 10; // +10 per rating point

  return Math.min(100, Math.max(0, Math.round(competitiveness)));
}
