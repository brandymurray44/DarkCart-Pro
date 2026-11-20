export interface OpportunityPrediction {
  productId: string;
  productName: string;
  trendScore: number;
  marketReadiness: number;
  competitiveAdvantage: number;
  predictedScore: number;
  confidence: number;
  successProbability: number;
  recommendedAction: "high-priority" | "medium-priority" | "low-priority" | "skip";
  reasoning: string[];
}

export interface ScoringFactors {
  trend: { weight: number; value: number };
  competition: { weight: number; value: number };
  marketSize: { weight: number; value: number };
  demand: { weight: number; value: number };
  seasonality: { weight: number; value: number };
  profitMargin: { weight: number; value: number };
}

const DEFAULT_FACTORS: ScoringFactors = {
  trend: { weight: 0.25, value: 0 },
  competition: { weight: 0.2, value: 0 },
  marketSize: { weight: 0.15, value: 0 },
  demand: { weight: 0.2, value: 0 },
  seasonality: { weight: 0.1, value: 0 },
  profitMargin: { weight: 0.1, value: 0 },
};

export function calculateOpportunityScore(factors: Partial<ScoringFactors>): number {
  const merged = { ...DEFAULT_FACTORS };
  Object.entries(factors).forEach(([key, value]) => {
    if (value) {
      merged[key as keyof ScoringFactors] = { ...merged[key as keyof ScoringFactors], ...value };
    }
  });

  let score = 0;
  Object.values(merged).forEach((factor) => {
    score += factor.value * factor.weight;
  });

  return Math.min(Math.max(score, 0), 100);
}

export function predictOpportunitySuccess(data: {
  trendVelocity: number;
  competitorCount: number;
  averagePrice: number;
  marketSize: number;
  demand: number;
  profitMargin: number;
  seasonalityIndex: number;
}): OpportunityPrediction {
  // Trend score (0-100): Higher velocity = higher score
  const trendScore = Math.min((data.trendVelocity / 0.5) * 100, 100);

  // Competitive advantage: Fewer competitors = better
  const competitiveScore = Math.max(100 - data.competitorCount * 5, 0);

  // Market readiness: Based on price point and market size
  const marketReadiness = Math.min((data.marketSize / 1000000) * data.averagePrice * 0.01 * 100, 100);

  // Demand signal: Direct demand metric
  const demandScore = Math.min(data.demand * 10, 100);

  // Seasonality adjustment
  const seasonalityAdjustment = data.seasonalityIndex > 0.3 ? -10 : 0;

  // Profit margin bonus
  const profitBonus = data.profitMargin > 0.3 ? 10 : data.profitMargin < 0.1 ? -5 : 0;

  const factors: ScoringFactors = {
    trend: { weight: 0.25, value: trendScore },
    competition: { weight: 0.2, value: competitiveScore },
    marketSize: { weight: 0.15, value: marketReadiness },
    demand: { weight: 0.2, value: demandScore },
    seasonality: { weight: 0.1, value: Math.max(100 - data.seasonalityIndex * 100, 50) },
    profitMargin: { weight: 0.1, value: Math.min(data.profitMargin * 200, 100) },
  };

  const predictedScore = calculateOpportunityScore(factors);

  // Confidence based on data completeness and consistency
  const confidence = Math.min(
    ((trendScore + competitiveScore + demandScore) / 300) * 100,
    95
  );

  // Success probability: Normalized score adjusted by confidence
  const successProbability = (predictedScore / 100) * (confidence / 100) * 100;

  // Action recommendation
  let recommendedAction: OpportunityPrediction["recommendedAction"] = "skip";
  if (successProbability > 75) recommendedAction = "high-priority";
  else if (successProbability > 50) recommendedAction = "medium-priority";
  else if (successProbability > 25) recommendedAction = "low-priority";

  // Generate reasoning
  const reasoning: string[] = [];

  if (trendScore > 70) reasoning.push("Strong trend velocity indicates growing market demand");
  if (competitiveScore > 70) reasoning.push("Low competition suggests gap in market");
  if (demandScore > 70) reasoning.push("High demand signals strong customer interest");
  if (data.profitMargin > 0.3) reasoning.push("Healthy profit margins support sustainability");
  if (data.seasonalityIndex > 0.3) reasoning.push("High seasonality may limit year-round sales");
  if (data.competitorCount > 20) reasoning.push("Saturated market with many competitors");

  return {
    productId: "",
    productName: "",
    trendScore: Math.round(trendScore),
    marketReadiness: Math.round(marketReadiness),
    competitiveAdvantage: Math.round(competitiveScore),
    predictedScore: Math.round(predictedScore),
    confidence: Math.round(confidence),
    successProbability: Math.round(successProbability),
    recommendedAction,
    reasoning,
  };
}

export function rankOpportunitiesByScore(opportunities: OpportunityPrediction[]): OpportunityPrediction[] {
  return [...opportunities].sort((a, b) => b.predictedScore - a.predictedScore);
}

export function getOpportunitiesByPriority(opportunities: OpportunityPrediction[]): Record<string, OpportunityPrediction[]> {
  return {
    highPriority: opportunities.filter((o) => o.recommendedAction === "high-priority"),
    mediumPriority: opportunities.filter((o) => o.recommendedAction === "medium-priority"),
    lowPriority: opportunities.filter((o) => o.recommendedAction === "low-priority"),
    skip: opportunities.filter((o) => o.recommendedAction === "skip"),
  };
}

export function calculateExpectedROI(prediction: OpportunityPrediction, investmentAmount: number): number {
  // Simple ROI calculation based on success probability and trend score
  const probabilityMultiplier = prediction.successProbability / 100;
  const trendMultiplier = prediction.trendScore / 50;
  const expectedReturn = investmentAmount * probabilityMultiplier * trendMultiplier;

  return expectedReturn;
}

export interface ScoringModel {
  name: string;
  weights: ScoringFactors;
  calibrated: boolean;
  accuracy: number;
}

export const defaultModel: ScoringModel = {
  name: "Default Opportunity Score",
  weights: DEFAULT_FACTORS,
  calibrated: false,
  accuracy: 0.72,
};
