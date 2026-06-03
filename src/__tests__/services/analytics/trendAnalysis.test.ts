import {
  analyzeTrend,
  calculateTrendHealth,
  calculateMomentum,
  calculateVolatility,
  analyzeTrends,
  generateTrendInsights,
  type TrendMetrics,
  type TrendAnalysis,
} from "@/services/analytics/trendAnalysis";

describe("analyzeTrend", () => {
  it("returns stable classification for single data point", () => {
    const result = analyzeTrend([50], "test");
    expect(result.name).toBe("test");
    expect(result.value).toBe(50);
    expect(result.change).toBe(0);
    expect(result.classification).toBe("stable");
  });

  it("returns empty data value as 0", () => {
    const result = analyzeTrend([], "empty");
    expect(result.value).toBe(0);
  });

  it("classifies explosive growth (>50%)", () => {
    const result = analyzeTrend([100, 200], "explosive");
    expect(result.classification).toBe("explosive");
    expect(result.changePercent).toBe(100);
  });

  it("classifies growing trend (10-50%)", () => {
    const result = analyzeTrend([100, 120], "growing");
    expect(result.classification).toBe("growing");
    expect(result.changePercent).toBe(20);
  });

  it("classifies stable trend (-10% to 10%)", () => {
    const result = analyzeTrend([100, 105], "stable");
    expect(result.classification).toBe("stable");
    expect(result.changePercent).toBe(5);
  });

  it("classifies declining trend (-10% to -25%)", () => {
    const result = analyzeTrend([100, 85], "declining");
    expect(result.classification).toBe("declining");
    expect(result.changePercent).toBe(-15);
  });

  it("classifies critical decline (< -25%)", () => {
    const result = analyzeTrend([100, 50], "critical");
    expect(result.classification).toBe("critical");
    expect(result.changePercent).toBe(-50);
  });

  it("calculates velocity with 3+ data points", () => {
    const result = analyzeTrend([10, 20, 30], "velocity");
    // velocity = (30 - 10) / 2 = 10
    expect(result.velocity).toBe(10);
  });

  it("calculates acceleration with 5+ data points", () => {
    // velocities: [10, 10, 10, 20] -> acceleration = 20 - 10 = 10
    const result = analyzeTrend([10, 20, 30, 40, 60], "acceleration");
    expect(result.acceleration).toBe(10);
  });

  it("handles previous value of 0 for changePercent", () => {
    const result = analyzeTrend([0, 50], "from-zero");
    expect(result.changePercent).toBe(0);
    expect(result.change).toBe(50);
  });
});

describe("calculateTrendHealth", () => {
  it("returns poor when majority are critical", () => {
    const metrics: TrendMetrics[] = [
      makeMetric("critical"),
      makeMetric("critical"),
      makeMetric("critical"),
      makeMetric("stable"),
    ];
    expect(calculateTrendHealth(metrics)).toBe("poor");
  });

  it("returns fair when many are declining", () => {
    const metrics: TrendMetrics[] = [
      makeMetric("declining"),
      makeMetric("declining"),
      makeMetric("stable"),
      makeMetric("stable"),
      makeMetric("stable"),
    ];
    expect(calculateTrendHealth(metrics)).toBe("fair");
  });

  it("returns excellent when majority are growing", () => {
    const metrics: TrendMetrics[] = [
      makeMetric("explosive"),
      makeMetric("growing"),
      makeMetric("growing"),
      makeMetric("stable"),
    ];
    expect(calculateTrendHealth(metrics)).toBe("excellent");
  });

  it("returns good as default", () => {
    const metrics: TrendMetrics[] = [
      makeMetric("stable"),
      makeMetric("stable"),
      makeMetric("growing"),
    ];
    expect(calculateTrendHealth(metrics)).toBe("good");
  });
});

describe("calculateMomentum", () => {
  it("returns average velocity", () => {
    const metrics: TrendMetrics[] = [
      { ...makeMetric("growing"), velocity: 10 },
      { ...makeMetric("growing"), velocity: 20 },
    ];
    expect(calculateMomentum(metrics)).toBe(15);
  });

  it("clamps to -100 to 100 range", () => {
    const highMetrics: TrendMetrics[] = [
      { ...makeMetric("explosive"), velocity: 200 },
    ];
    expect(calculateMomentum(highMetrics)).toBe(100);

    const lowMetrics: TrendMetrics[] = [
      { ...makeMetric("critical"), velocity: -200 },
    ];
    expect(calculateMomentum(lowMetrics)).toBe(-100);
  });
});

describe("calculateVolatility", () => {
  it("returns 0 for uniform change percents", () => {
    const metrics: TrendMetrics[] = [
      { ...makeMetric("stable"), changePercent: 5 },
      { ...makeMetric("stable"), changePercent: 5 },
      { ...makeMetric("stable"), changePercent: 5 },
    ];
    expect(calculateVolatility(metrics)).toBe(0);
  });

  it("returns higher value for varied change percents", () => {
    const uniform: TrendMetrics[] = [
      { ...makeMetric("stable"), changePercent: 10 },
      { ...makeMetric("stable"), changePercent: 10 },
    ];
    const varied: TrendMetrics[] = [
      { ...makeMetric("explosive"), changePercent: 80 },
      { ...makeMetric("critical"), changePercent: -50 },
    ];
    expect(calculateVolatility(varied)).toBeGreaterThan(calculateVolatility(uniform));
  });
});

describe("analyzeTrends", () => {
  it("combines all analyses", () => {
    const result = analyzeTrends({
      revenue: [100, 120, 150],
      orders: [50, 55, 58],
    });

    expect(result.metrics).toHaveLength(2);
    expect(result.overall.health).toBeDefined();
    expect(result.overall.momentum).toBeDefined();
    expect(result.overall.volatility).toBeDefined();
    expect(result.date).toBeInstanceOf(Date);
  });
});

describe("generateTrendInsights", () => {
  it("generates critical insight for critical metrics", () => {
    const analysis: TrendAnalysis = {
      date: new Date(),
      metrics: [
        { ...makeMetric("critical"), name: "Revenue", changePercent: -30 },
      ],
      overall: { health: "poor", momentum: -50, volatility: 30 },
    };

    const insights = generateTrendInsights(analysis);
    expect(insights.some((i) => i.severity === "critical")).toBe(true);
    expect(insights.some((i) => i.title.includes("Revenue"))).toBe(true);
  });

  it("generates success insight for explosive growth", () => {
    const analysis: TrendAnalysis = {
      date: new Date(),
      metrics: [
        { ...makeMetric("explosive"), name: "Sales" },
      ],
      overall: { health: "excellent", momentum: 80, volatility: 10 },
    };

    const insights = generateTrendInsights(analysis);
    expect(insights.some((i) => i.severity === "success")).toBe(true);
  });

  it("generates momentum insight for high momentum", () => {
    const analysis: TrendAnalysis = {
      date: new Date(),
      metrics: [makeMetric("growing")],
      overall: { health: "excellent", momentum: 60, volatility: 5 },
    };

    const insights = generateTrendInsights(analysis);
    expect(insights.some((i) => i.title.includes("momentum"))).toBe(true);
  });
});

function makeMetric(
  classification: TrendMetrics["classification"]
): TrendMetrics {
  return {
    name: "test",
    value: 100,
    change: 10,
    changePercent: 10,
    velocity: 5,
    acceleration: 1,
    classification,
  };
}
