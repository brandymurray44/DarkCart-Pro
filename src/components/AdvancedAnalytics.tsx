"use client";

interface MetricsData {
  value: number;
  previousValue: number;
  trend: number[];
}

export function calculateTrend(values: number[]): string {
  if (values.length < 2) return "neutral";
  const recent = values.slice(-3);
  const older = values.slice(-6, -3);

  if (recent.length === 0 || older.length === 0) return "neutral";

  const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b) / older.length;

  const change = ((recentAvg - olderAvg) / olderAvg) * 100;

  if (change > 5) return "up";
  if (change < -5) return "down";
  return "neutral";
}

export function predictNextValue(trend: number[]): number {
  if (trend.length < 2) return trend[trend.length - 1] || 0;

  const recentValues = trend.slice(-7);
  const avg = recentValues.reduce((a, b) => a + b) / recentValues.length;

  // Simple linear regression
  let sumXY = 0;
  let sumX = 0;
  let sumX2 = 0;
  let sumY = 0;

  for (let i = 0; i < recentValues.length; i++) {
    sumXY += i * recentValues[i];
    sumX += i;
    sumX2 += i * i;
    sumY += recentValues[i];
  }

  const n = recentValues.length;
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return intercept + slope * n;
}

export function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

export interface ForecastedMetric {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: "up" | "down" | "neutral";
  growthRate: number;
}

export function forecastMetrics(data: {
  revenue?: { values: number[] };
  orders?: { values: number[] };
  merchantStrength?: { values: number[] };
}): ForecastedMetric[] {
  const forecasts: ForecastedMetric[] = [];

  Object.entries(data).forEach(([metric, { values }]) => {
    if (!values || values.length === 0) return;

    const current = values[values.length - 1];
    const previous = values[values.length - 2] || current;
    const predicted = predictNextValue(values);
    const trend = calculateTrend(values) as "up" | "down" | "neutral";
    const growthRate = calculateGrowthRate(current, previous);

    // Confidence based on consistency of trend
    const recentTrends = values.slice(-5);
    const consistency =
      recentTrends.every((v, i) => i === 0 || v > recentTrends[i - 1]) ||
      recentTrends.every((v, i) => i === 0 || v < recentTrends[i - 1])
        ? 0.9
        : 0.6;

    forecasts.push({
      metric: metric.charAt(0).toUpperCase() + metric.slice(1),
      current,
      predicted: Math.round(predicted * 100) / 100,
      confidence: Math.round(consistency * 100),
      trend,
      growthRate: Math.round(growthRate * 100) / 100,
    });
  });

  return forecasts;
}

interface ForecastChartProps {
  metrics: ForecastedMetric[];
}

export function ForecastChart({ metrics }: ForecastChartProps) {
  if (metrics.length === 0) return null;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">🔮 Metric Forecasts</h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.metric} className="bg-slate-700/30 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-white">{metric.metric}</p>
                <p className="text-xs text-slate-400">
                  Current: {metric.current} → Predicted: {metric.predicted}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${
                  metric.trend === "up" ? "text-green-400" :
                  metric.trend === "down" ? "text-red-400" :
                  "text-slate-400"
                }`}>
                  {metric.trend === "up" ? "📈" : metric.trend === "down" ? "📉" : "→"}
                  {" "}{metric.growthRate > 0 ? "+" : ""}{metric.growthRate}%
                </div>
                <p className="text-xs text-slate-400">
                  {metric.confidence}% confidence
                </p>
              </div>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  metric.confidence >= 80 ? "bg-green-500" :
                  metric.confidence >= 60 ? "bg-amber-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${metric.confidence}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
