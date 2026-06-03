import {
  generateRecommendations,
  prioritizeRecommendations,
  groupRecommendationsByCategory,
  calculateRecommendationImpact,
  type Recommendation,
} from "@/services/analytics/recommendations";

describe("generateRecommendations", () => {
  it("recommends store improvement when merchant strength is low", () => {
    const recs = generateRecommendations({
      merchantStrength: 30,
      opportunityScore: 40,
      trendVelocity: 0.1,
      competitorAvgScore: 50,
      revenue30Days: 5000,
      orders30Days: 100,
      avgOrderValue: 60,
    });

    expect(recs.some((r) => r.id === "strength-improvement")).toBe(true);
    const strengthRec = recs.find((r) => r.id === "strength-improvement")!;
    expect(strengthRec.priority).toBe("critical");
    expect(strengthRec.category).toBe("strategy");
  });

  it("recommends opportunity capture when score is high", () => {
    const recs = generateRecommendations({
      merchantStrength: 70,
      opportunityScore: 80,
      trendVelocity: 0.1,
      competitorAvgScore: 60,
      revenue30Days: 10000,
      orders30Days: 100,
      avgOrderValue: 60,
    });

    expect(recs.some((r) => r.id === "opportunity-capture")).toBe(true);
  });

  it("recommends AOV optimization when average order value is low", () => {
    const recs = generateRecommendations({
      merchantStrength: 50,
      opportunityScore: 40,
      trendVelocity: 0.1,
      competitorAvgScore: 50,
      revenue30Days: 2000,
      orders30Days: 100,
      avgOrderValue: 30,
    });

    expect(recs.some((r) => r.id === "aov-optimization")).toBe(true);
  });

  it("recommends competitive gap closure when competitor outperforms significantly", () => {
    const recs = generateRecommendations({
      merchantStrength: 30,
      opportunityScore: 40,
      trendVelocity: 0.1,
      competitorAvgScore: 70,
      revenue30Days: 2000,
      orders30Days: 100,
      avgOrderValue: 60,
    });

    expect(recs.some((r) => r.id === "competitive-gap")).toBe(true);
  });

  it("recommends content acceleration when trend velocity is high", () => {
    const recs = generateRecommendations({
      merchantStrength: 60,
      opportunityScore: 50,
      trendVelocity: 0.5,
      competitorAvgScore: 55,
      revenue30Days: 5000,
      orders30Days: 100,
      avgOrderValue: 60,
    });

    expect(recs.some((r) => r.id === "content-acceleration")).toBe(true);
  });

  it("recommends conversion optimization when orders are low", () => {
    const recs = generateRecommendations({
      merchantStrength: 60,
      opportunityScore: 50,
      trendVelocity: 0.1,
      competitorAvgScore: 55,
      revenue30Days: 1000,
      orders30Days: 20,
      avgOrderValue: 60,
    });

    expect(recs.some((r) => r.id === "conversion-optimization")).toBe(true);
  });

  it("returns empty when all metrics are strong", () => {
    const recs = generateRecommendations({
      merchantStrength: 80,
      opportunityScore: 40,
      trendVelocity: 0.1,
      competitorAvgScore: 70,
      revenue30Days: 50000,
      orders30Days: 500,
      avgOrderValue: 100,
    });

    expect(recs).toHaveLength(0);
  });

  it("each recommendation has required fields", () => {
    const recs = generateRecommendations({
      merchantStrength: 20,
      opportunityScore: 80,
      trendVelocity: 0.5,
      competitorAvgScore: 60,
      revenue30Days: 1000,
      orders30Days: 10,
      avgOrderValue: 20,
    });

    for (const rec of recs) {
      expect(rec.id).toBeDefined();
      expect(rec.title).toBeDefined();
      expect(rec.description).toBeDefined();
      expect(rec.category).toBeDefined();
      expect(rec.priority).toBeDefined();
      expect(rec.expectedImpact).toBeGreaterThan(0);
      expect(rec.implementationEffort).toBeGreaterThan(0);
      expect(rec.estimatedROI).toBeGreaterThan(0);
      expect(rec.actions.length).toBeGreaterThan(0);
      expect(rec.timeframe).toBeDefined();
    }
  });
});

describe("prioritizeRecommendations", () => {
  it("sorts by priority then by ROI", () => {
    const recs: Recommendation[] = [
      makeRec("low", 20),
      makeRec("critical", 50),
      makeRec("high", 30),
      makeRec("high", 60),
    ];

    const sorted = prioritizeRecommendations(recs);
    expect(sorted[0].priority).toBe("critical");
    expect(sorted[1].priority).toBe("high");
    expect(sorted[1].estimatedROI).toBe(60);
    expect(sorted[2].priority).toBe("high");
    expect(sorted[2].estimatedROI).toBe(30);
    expect(sorted[3].priority).toBe("low");
  });

  it("does not mutate original array", () => {
    const recs: Recommendation[] = [makeRec("low", 10), makeRec("critical", 50)];
    prioritizeRecommendations(recs);
    expect(recs[0].priority).toBe("low");
  });

  it("handles empty array", () => {
    expect(prioritizeRecommendations([])).toEqual([]);
  });
});

describe("groupRecommendationsByCategory", () => {
  it("groups recommendations into categories", () => {
    const recs: Recommendation[] = [
      { ...makeRec("high", 50), category: "strategy" },
      { ...makeRec("high", 30), category: "pricing" },
      { ...makeRec("medium", 20), category: "content" },
    ];

    const grouped = groupRecommendationsByCategory(recs);
    expect(grouped.strategy).toHaveLength(1);
    expect(grouped.pricing).toHaveLength(1);
    expect(grouped.content).toHaveLength(1);
    expect(grouped.targeting).toHaveLength(0);
    expect(grouped.operations).toHaveLength(0);
  });
});

describe("calculateRecommendationImpact", () => {
  it("calculates total impact, effort, and ROI", () => {
    const recs: Recommendation[] = [
      { ...makeRec("high", 50), expectedImpact: 30, implementationEffort: 3 },
      { ...makeRec("high", 40), expectedImpact: 20, implementationEffort: 2 },
    ];

    const result = calculateRecommendationImpact(recs);
    expect(result.totalImpact).toBe(50);
    expect(result.totalEffort).toBe(5);
    expect(result.roi).toBeGreaterThan(0);
  });

  it("returns 0 ROI for empty array", () => {
    const result = calculateRecommendationImpact([]);
    expect(result.totalImpact).toBe(0);
    expect(result.totalEffort).toBe(0);
  });
});

function makeRec(
  priority: Recommendation["priority"],
  roi: number
): Recommendation {
  return {
    id: `rec-${priority}-${roi}`,
    title: "Test recommendation",
    description: "Test description",
    category: "strategy",
    priority,
    expectedImpact: 25,
    implementationEffort: 3,
    estimatedROI: roi,
    timeframe: "week",
    actions: [{ step: "Step 1", description: "Do something", responsible: "Team" }],
  };
}
