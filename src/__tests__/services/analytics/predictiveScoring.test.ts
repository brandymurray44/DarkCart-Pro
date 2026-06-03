import {
  calculateOpportunityScore,
  predictOpportunitySuccess,
  rankOpportunitiesByScore,
  getOpportunitiesByPriority,
  calculateExpectedROI,
  defaultModel,
  type OpportunityPrediction,
  type ScoringFactors,
} from "@/services/analytics/predictiveScoring";

describe("calculateOpportunityScore", () => {
  it("returns 0 with all zero values", () => {
    const score = calculateOpportunityScore({});
    expect(score).toBe(0);
  });

  it("calculates weighted score from factors", () => {
    const factors: Partial<ScoringFactors> = {
      trend: { weight: 0.25, value: 80 },
      competition: { weight: 0.2, value: 60 },
      demand: { weight: 0.2, value: 70 },
    };
    const score = calculateOpportunityScore(factors);
    // 80*0.25 + 60*0.2 + 70*0.2 + defaults for rest (0 values)
    // = 20 + 12 + 14 = 46
    expect(score).toBe(46);
  });

  it("clamps result to 0-100", () => {
    const maxFactors: ScoringFactors = {
      trend: { weight: 0.25, value: 100 },
      competition: { weight: 0.2, value: 100 },
      marketSize: { weight: 0.15, value: 100 },
      demand: { weight: 0.2, value: 100 },
      seasonality: { weight: 0.1, value: 100 },
      profitMargin: { weight: 0.1, value: 100 },
    };
    expect(calculateOpportunityScore(maxFactors)).toBe(100);
  });

  it("does not go below 0", () => {
    const negativeFactors: Partial<ScoringFactors> = {
      trend: { weight: 0.25, value: -50 },
    };
    expect(calculateOpportunityScore(negativeFactors)).toBe(0);
  });
});

describe("predictOpportunitySuccess", () => {
  it("returns high-priority for strong opportunity", () => {
    const result = predictOpportunitySuccess({
      trendVelocity: 1.0,
      competitorCount: 2,
      averagePrice: 50,
      marketSize: 5000000,
      demand: 15,
      profitMargin: 0.5,
      seasonalityIndex: 0.1,
    });

    expect(result.recommendedAction).toBe("high-priority");
    expect(result.predictedScore).toBeGreaterThan(50);
    expect(result.confidence).toBeGreaterThan(0);
    expect(result.successProbability).toBeGreaterThan(50);
  });

  it("returns skip for weak opportunity", () => {
    const result = predictOpportunitySuccess({
      trendVelocity: 0.01,
      competitorCount: 50,
      averagePrice: 5,
      marketSize: 100,
      demand: 0.5,
      profitMargin: 0.05,
      seasonalityIndex: 0.8,
    });

    expect(result.recommendedAction).toBe("skip");
    expect(result.predictedScore).toBeLessThan(30);
  });

  it("includes reasoning for strong trend velocity", () => {
    const result = predictOpportunitySuccess({
      trendVelocity: 0.5,
      competitorCount: 5,
      averagePrice: 30,
      marketSize: 1000000,
      demand: 8,
      profitMargin: 0.4,
      seasonalityIndex: 0.1,
    });

    expect(result.reasoning).toContain("Strong trend velocity indicates growing market demand");
    expect(result.reasoning).toContain("Healthy profit margins support sustainability");
  });

  it("includes reasoning for high competition", () => {
    const result = predictOpportunitySuccess({
      trendVelocity: 0.3,
      competitorCount: 25,
      averagePrice: 30,
      marketSize: 1000000,
      demand: 5,
      profitMargin: 0.2,
      seasonalityIndex: 0.5,
    });

    expect(result.reasoning).toContain("Saturated market with many competitors");
    expect(result.reasoning).toContain("High seasonality may limit year-round sales");
  });

  it("returns all expected fields", () => {
    const result = predictOpportunitySuccess({
      trendVelocity: 0.3,
      competitorCount: 10,
      averagePrice: 40,
      marketSize: 500000,
      demand: 6,
      profitMargin: 0.25,
      seasonalityIndex: 0.2,
    });

    expect(result).toHaveProperty("productId");
    expect(result).toHaveProperty("productName");
    expect(result).toHaveProperty("trendScore");
    expect(result).toHaveProperty("marketReadiness");
    expect(result).toHaveProperty("competitiveAdvantage");
    expect(result).toHaveProperty("predictedScore");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("successProbability");
    expect(result).toHaveProperty("recommendedAction");
    expect(result).toHaveProperty("reasoning");
  });
});

describe("rankOpportunitiesByScore", () => {
  it("sorts opportunities by predictedScore descending", () => {
    const opportunities: OpportunityPrediction[] = [
      makePrediction(30),
      makePrediction(90),
      makePrediction(60),
    ];

    const ranked = rankOpportunitiesByScore(opportunities);
    expect(ranked[0].predictedScore).toBe(90);
    expect(ranked[1].predictedScore).toBe(60);
    expect(ranked[2].predictedScore).toBe(30);
  });

  it("does not mutate original array", () => {
    const opportunities: OpportunityPrediction[] = [
      makePrediction(30),
      makePrediction(90),
    ];
    rankOpportunitiesByScore(opportunities);
    expect(opportunities[0].predictedScore).toBe(30);
  });

  it("handles empty array", () => {
    expect(rankOpportunitiesByScore([])).toEqual([]);
  });
});

describe("getOpportunitiesByPriority", () => {
  it("groups opportunities by recommended action", () => {
    const opportunities: OpportunityPrediction[] = [
      makePrediction(90, "high-priority"),
      makePrediction(60, "medium-priority"),
      makePrediction(30, "low-priority"),
      makePrediction(10, "skip"),
    ];

    const grouped = getOpportunitiesByPriority(opportunities);
    expect(grouped.highPriority).toHaveLength(1);
    expect(grouped.mediumPriority).toHaveLength(1);
    expect(grouped.lowPriority).toHaveLength(1);
    expect(grouped.skip).toHaveLength(1);
  });

  it("handles empty array", () => {
    const grouped = getOpportunitiesByPriority([]);
    expect(grouped.highPriority).toHaveLength(0);
    expect(grouped.mediumPriority).toHaveLength(0);
    expect(grouped.lowPriority).toHaveLength(0);
    expect(grouped.skip).toHaveLength(0);
  });
});

describe("calculateExpectedROI", () => {
  it("returns positive ROI for high success probability", () => {
    const prediction = makePrediction(80, "high-priority");
    prediction.successProbability = 80;
    prediction.trendScore = 70;

    const roi = calculateExpectedROI(prediction, 1000);
    // 1000 * (80/100) * (70/50) = 1000 * 0.8 * 1.4 = 1120
    expect(roi).toBe(1120);
  });

  it("returns 0 ROI for zero success probability", () => {
    const prediction = makePrediction(0, "skip");
    prediction.successProbability = 0;
    prediction.trendScore = 50;

    const roi = calculateExpectedROI(prediction, 1000);
    expect(roi).toBe(0);
  });
});

describe("defaultModel", () => {
  it("has expected properties", () => {
    expect(defaultModel.name).toBe("Default Opportunity Score");
    expect(defaultModel.calibrated).toBe(false);
    expect(defaultModel.accuracy).toBe(0.72);
  });
});

function makePrediction(
  score: number,
  action: OpportunityPrediction["recommendedAction"] = "medium-priority"
): OpportunityPrediction {
  return {
    productId: "",
    productName: "",
    trendScore: score,
    marketReadiness: score,
    competitiveAdvantage: score,
    predictedScore: score,
    confidence: 80,
    successProbability: score,
    recommendedAction: action,
    reasoning: [],
  };
}
