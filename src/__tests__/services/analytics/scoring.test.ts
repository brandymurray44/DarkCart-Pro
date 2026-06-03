import {
  scoreOpportunity,
  calculateMerchantStrength,
  calculateCompetitorWeakness,
  calculateTrendDemand,
  calculateMerchantReadiness,
  calculateTrendCoverage,
  calculatePriceCompetitiveness,
  calculateReviewCompetitiveness,
} from "@/services/analytics/scoring";

describe("scoreOpportunity", () => {
  it("returns weighted score from three inputs", () => {
    const result = scoreOpportunity(80, 60, 40);
    // 80*0.4 + 60*0.35 + 40*0.25 = 32 + 21 + 10 = 63
    expect(result.score).toBe(63);
    expect(result.trendDemandWeight).toBe(0.4);
    expect(result.competitorWeaknessWeight).toBe(0.35);
    expect(result.merchantReadinessWeight).toBe(0.25);
  });

  it("clamps score to 0-100 range", () => {
    const high = scoreOpportunity(100, 100, 100);
    expect(high.score).toBe(100);

    const low = scoreOpportunity(0, 0, 0);
    expect(low.score).toBe(0);
  });

  it("handles all zeros", () => {
    const result = scoreOpportunity(0, 0, 0);
    expect(result.score).toBe(0);
  });

  it("handles all 100s", () => {
    const result = scoreOpportunity(100, 100, 100);
    expect(result.score).toBe(100);
  });
});

describe("calculateMerchantStrength", () => {
  it("returns 100 when all metrics are at max", () => {
    const score = calculateMerchantStrength(5, 100, 50, 100);
    expect(score).toBe(100);
  });

  it("returns 0 when all metrics are zero", () => {
    const score = calculateMerchantStrength(0, 0, 0, 0);
    expect(score).toBe(0);
  });

  it("caps individual components", () => {
    // salesVelocity of 10 should still max at 35 points
    const score = calculateMerchantStrength(10, 0, 0, 0);
    expect(score).toBe(35);
  });

  it("calculates correctly for mid-range values", () => {
    // velocity: 2.5/5 * 35 = 17.5, orders: 50/100 * 25 = 12.5, products: 25/50 * 20 = 10, aov: 50/100 * 20 = 10
    const score = calculateMerchantStrength(2.5, 50, 25, 50);
    expect(score).toBe(50);
  });
});

describe("calculateCompetitorWeakness", () => {
  it("returns high score for weak competitors", () => {
    // Low rating, few reviews, few products
    const score = calculateCompetitorWeakness(1, 0, 0, { min: 10, max: 110 });
    expect(score).toBeGreaterThan(80);
  });

  it("returns low score for strong competitors", () => {
    // High rating, many reviews, many products
    const score = calculateCompetitorWeakness(5, 500, 100, { min: 50, max: 50 });
    expect(score).toBeLessThanOrEqual(0);
  });

  it("handles zero rating", () => {
    const score = calculateCompetitorWeakness(0, 0, 0, { min: 0, max: 0 });
    // (1 - 0/5)*30 + (500-0)/500*30 + (100-0)/100*20 + 0 = 30 + 30 + 20 + 0 = 80
    expect(score).toBe(80);
  });

  it("caps at 100", () => {
    const score = calculateCompetitorWeakness(0, 0, 0, { min: 0, max: 600 });
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe("calculateTrendDemand", () => {
  it("returns high score for fresh high-score trends", () => {
    const demand = calculateTrendDemand(90, 0, 3);
    // 90 * 1.0 + min(30, 20) = 90 + 20 = 110 -> capped at 100
    expect(demand).toBe(100);
  });

  it("applies age decay", () => {
    const fresh = calculateTrendDemand(80, 0, 1);
    const old = calculateTrendDemand(80, 30, 1);
    expect(fresh).toBeGreaterThan(old);
  });

  it("applies frequency bonus", () => {
    const single = calculateTrendDemand(50, 0, 1);
    const multiple = calculateTrendDemand(50, 0, 3);
    expect(multiple).toBeGreaterThan(single);
  });

  it("caps at 100", () => {
    const demand = calculateTrendDemand(100, 0, 5);
    expect(demand).toBeLessThanOrEqual(100);
  });

  it("applies minimum age multiplier at 60 days", () => {
    // At 60 days, multiplier = max(0.5, 1 - 60/60) = max(0.5, 0) = 0.5
    const demand = calculateTrendDemand(80, 60, 0);
    // 80 * 0.5 + 0 = 40
    expect(demand).toBe(40);
  });
});

describe("calculateMerchantReadiness", () => {
  it("returns 30 if merchant has no products", () => {
    const score = calculateMerchantReadiness(false, 0, 0);
    expect(score).toBe(30);
  });

  it("returns foundation score + other scores when has products", () => {
    const score = calculateMerchantReadiness(true, 0, 0);
    // foundation: 20, publishing: 0, inventory: 0
    expect(score).toBe(20);
  });

  it("caps publishing score at 40", () => {
    const score = calculateMerchantReadiness(true, 10, 0);
    // publishing: min(100, 40) = 40, inventory: 0, foundation: 20
    expect(score).toBe(60);
  });

  it("calculates full score with all inputs", () => {
    const score = calculateMerchantReadiness(true, 4, 100);
    // publishing: 40, inventory: min(100/100,1)*40 = 40, foundation: 20
    expect(score).toBe(100);
  });
});

describe("calculateTrendCoverage", () => {
  it("returns 0 if no trends", () => {
    const score = calculateTrendCoverage(["Product A"], []);
    expect(score).toBe(0);
  });

  it("returns 100 if all trends are covered", () => {
    const score = calculateTrendCoverage(
      ["red sneakers", "blue hat"],
      ["red sneakers", "blue hat"]
    );
    expect(score).toBe(100);
  });

  it("returns partial coverage", () => {
    const score = calculateTrendCoverage(
      ["red sneakers"],
      ["red sneakers", "blue hat"]
    );
    expect(score).toBe(50);
  });

  it("uses word overlap threshold", () => {
    // "sustainable fashion bags" - 3 words
    // merchant has "fashion" -> 1/3 = 0.33 >= 0.3 threshold
    const score = calculateTrendCoverage(
      ["fashion trends"],
      ["sustainable fashion bags"]
    );
    expect(score).toBeGreaterThan(0);
  });
});

describe("calculatePriceCompetitiveness", () => {
  it("returns 50 if no competitors", () => {
    const score = calculatePriceCompetitiveness(30, []);
    expect(score).toBe(50);
  });

  it("returns 100 when merchant matches competitor median", () => {
    const score = calculatePriceCompetitiveness(50, [40, 50, 60]);
    expect(score).toBe(100);
  });

  it("returns lower score when merchant is more expensive", () => {
    const cheaper = calculatePriceCompetitiveness(50, [50]);
    const expensive = calculatePriceCompetitiveness(100, [50]);
    expect(cheaper).toBeGreaterThan(expensive);
  });
});

describe("calculateReviewCompetitiveness", () => {
  it("returns 50 if no competitors", () => {
    const score = calculateReviewCompetitiveness(4.0, []);
    expect(score).toBe(50);
  });

  it("returns higher score when merchant rating is higher", () => {
    // Merchant 4.5, competitors average 3.5 -> diff = 1, score = 50 + 10 = 60
    const score = calculateReviewCompetitiveness(4.5, [3.5]);
    expect(score).toBe(60);
  });

  it("returns lower score when merchant rating is lower", () => {
    // Merchant 2.0, competitors average 4.0 -> diff = -2, score = 50 + (-20) = 30
    const score = calculateReviewCompetitiveness(2.0, [4.0]);
    expect(score).toBe(30);
  });

  it("clamps to 0-100", () => {
    const high = calculateReviewCompetitiveness(5, [0]);
    expect(high).toBeLessThanOrEqual(100);

    const low = calculateReviewCompetitiveness(0, [5]);
    expect(low).toBeGreaterThanOrEqual(0);
  });
});
