export interface TrendMetrics {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  velocity: number;
  acceleration: number;
  classification: "explosive" | "growing" | "stable" | "declining" | "critical";
}

export interface TrendAnalysis {
  date: Date;
  metrics: TrendMetrics[];
  overall: {
    health: "excellent" | "good" | "fair" | "poor";
    momentum: number;
    volatility: number;
  };
}

export function analyzeTrend(data: number[], name: string, threshold = 0.2): TrendMetrics {
  if (data.length < 2) {
    return {
      name,
      value: data[0] || 0,
      change: 0,
      changePercent: 0,
      velocity: 0,
      acceleration: 0,
      classification: "stable",
    };
  }

  const current = data[data.length - 1];
  const previous = data[data.length - 2];
  const change = current - previous;
  const changePercent = previous !== 0 ? (change / Math.abs(previous)) * 100 : 0;

  // Calculate velocity (rate of change)
  let velocity = 0;
  if (data.length >= 3) {
    const recent = data.slice(-3);
    velocity = (recent[2] - recent[0]) / 2;
  } else {
    velocity = change;
  }

  // Calculate acceleration (change in velocity)
  let acceleration = 0;
  if (data.length >= 5) {
    const velocities = [];
    for (let i = 1; i < data.length; i++) {
      velocities.push(data[i] - data[i - 1]);
    }
    acceleration = velocities[velocities.length - 1] - velocities[velocities.length - 2];
  }

  // Classify the trend
  let classification: TrendMetrics["classification"] = "stable";
  if (changePercent > 50) {
    classification = "explosive";
  } else if (changePercent > 10) {
    classification = "growing";
  } else if (changePercent < -25) {
    classification = "critical";
  } else if (changePercent < -10) {
    classification = "declining";
  }

  return {
    name,
    value: current,
    change,
    changePercent: Math.round(changePercent * 100) / 100,
    velocity: Math.round(velocity * 100) / 100,
    acceleration: Math.round(acceleration * 100) / 100,
    classification,
  };
}

export function calculateTrendHealth(metrics: TrendMetrics[]): "excellent" | "good" | "fair" | "poor" {
  const criticalCount = metrics.filter((m) => m.classification === "critical").length;
  const declineCount = metrics.filter((m) => m.classification === "declining").length;
  const growthCount = metrics.filter((m) => m.classification === "explosive" || m.classification === "growing").length;

  if (criticalCount > metrics.length * 0.5) return "poor";
  if (declineCount > metrics.length * 0.3) return "fair";
  if (growthCount > metrics.length * 0.5) return "excellent";

  return "good";
}

export function calculateMomentum(metrics: TrendMetrics[]): number {
  const totalVelocity = metrics.reduce((sum, m) => sum + m.velocity, 0);
  return Math.min(Math.max(totalVelocity / metrics.length, -100), 100);
}

export function calculateVolatility(metrics: TrendMetrics[]): number {
  const changePercents = metrics.map((m) => m.changePercent);
  const mean = changePercents.reduce((a, b) => a + b, 0) / changePercents.length;
  const variance = changePercents.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / changePercents.length;
  return Math.sqrt(variance);
}

export function analyzeTrends(data: Record<string, number[]>): TrendAnalysis {
  const metrics = Object.entries(data).map(([name, values]) => analyzeTrend(values, name));

  const health = calculateTrendHealth(metrics);
  const momentum = calculateMomentum(metrics);
  const volatility = calculateVolatility(metrics);

  return {
    date: new Date(),
    metrics,
    overall: {
      health,
      momentum,
      volatility: Math.round(volatility * 100) / 100,
    },
  };
}

export interface TrendInsight {
  title: string;
  description: string;
  severity: "critical" | "warning" | "info" | "success";
  actionable: boolean;
}

export function generateTrendInsights(analysis: TrendAnalysis): TrendInsight[] {
  const insights: TrendInsight[] = [];

  // Critical metrics
  analysis.metrics.forEach((metric) => {
    if (metric.classification === "critical") {
      insights.push({
        title: `${metric.name} is declining rapidly`,
        description: `${metric.name} has dropped ${Math.abs(metric.changePercent)}% and shows continuing decline. Immediate action recommended.`,
        severity: "critical",
        actionable: true,
      });
    }
  });

  // Growth opportunities
  const explosiveMetrics = analysis.metrics.filter((m) => m.classification === "explosive");
  if (explosiveMetrics.length > 0) {
    insights.push({
      title: "Strong growth detected",
      description: `${explosiveMetrics.map((m) => m.name).join(", ")} showing explosive growth. Consider allocating more resources.`,
      severity: "success",
      actionable: true,
    });
  }

  // Momentum analysis
  if (analysis.overall.momentum > 50) {
    insights.push({
      title: "Strong positive momentum",
      description: "Your business metrics are accelerating upward. Maintain current strategy.",
      severity: "success",
      actionable: false,
    });
  } else if (analysis.overall.momentum < -50) {
    insights.push({
      title: "Negative momentum detected",
      description: "Multiple metrics are declining. Review strategy and consider adjustments.",
      severity: "warning",
      actionable: true,
    });
  }

  // Volatility analysis
  if (analysis.overall.volatility > 30) {
    insights.push({
      title: "High volatility detected",
      description: "Your metrics are fluctuating significantly. Implement stabilization measures.",
      severity: "warning",
      actionable: true,
    });
  }

  return insights;
}
