export interface PerformanceReport {
  title: string;
  generatedAt: Date;
  period: { start: Date; end: Date };
  executive: ExecutiveSummary;
  metrics: MetricsReport;
  trends: TrendsReport;
  competitors: CompetitorsReport;
  recommendations: RecommendationsReport;
}

export interface ExecutiveSummary {
  overallScore: number;
  keyHighlights: string[];
  areasOfConcern: string[];
  nextSteps: string[];
}

export interface MetricsReport {
  revenue: MetricData;
  orders: MetricData;
  conversionRate: MetricData;
  avgOrderValue: MetricData;
  customerSatisfaction: MetricData;
}

export interface MetricData {
  current: number;
  previous: number;
  change: number;
  changePercent: number;
  trend: "up" | "down" | "flat";
  benchmark?: number;
}

export interface TrendsReport {
  topTrends: string[];
  emergingOpportunities: string[];
  declineWarnings: string[];
  marketVelocity: number;
}

export interface CompetitorsReport {
  positioningScore: number;
  competitiveAdvantages: string[];
  areasToImprove: string[];
  benchmarkGaps: Record<string, number>;
}

export interface RecommendationsReport {
  priority: string[];
  quickWins: string[];
  longTermStrategy: string[];
}

export function generateReport(data: any): PerformanceReport {
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  return {
    title: "Monthly Performance Report",
    generatedAt: now,
    period: { start: monthAgo, end: now },
    executive: {
      overallScore: data.merchantStrength || 65,
      keyHighlights: [
        `Revenue: $${data.revenue || 0}`,
        `Orders: ${data.orders || 0}`,
        `AOV: $${data.aov || 0}`,
      ],
      areasOfConcern: data.merchantStrength < 50 ? ["Low merchant strength"] : [],
      nextSteps: [
        "Review top opportunities",
        "Implement recommendations",
        "Monitor competitor activity",
      ],
    },
    metrics: {
      revenue: {
        current: data.revenue || 5000,
        previous: data.previousRevenue || 4500,
        change: (data.revenue || 5000) - (data.previousRevenue || 4500),
        changePercent:
          ((data.revenue || 5000) - (data.previousRevenue || 4500)) /
          (data.previousRevenue || 4500) *
          100,
        trend: (data.revenue || 5000) > (data.previousRevenue || 4500) ? "up" : "down",
      },
      orders: {
        current: data.orders || 25,
        previous: data.previousOrders || 22,
        change: (data.orders || 25) - (data.previousOrders || 22),
        changePercent:
          ((data.orders || 25) - (data.previousOrders || 22)) / (data.previousOrders || 22) * 100,
        trend: (data.orders || 25) > (data.previousOrders || 22) ? "up" : "down",
      },
      conversionRate: {
        current: 3.5,
        previous: 3.2,
        change: 0.3,
        changePercent: 9.375,
        trend: "up",
      },
      avgOrderValue: {
        current: data.aov || 200,
        previous: (data.previousRevenue || 4500) / (data.previousOrders || 22),
        change: (data.aov || 200) - ((data.previousRevenue || 4500) / (data.previousOrders || 22)),
        changePercent:
          ((data.aov || 200) - ((data.previousRevenue || 4500) / (data.previousOrders || 22))) /
          ((data.previousRevenue || 4500) / (data.previousOrders || 22)) *
          100,
        trend: "up",
      },
      customerSatisfaction: {
        current: 4.2,
        previous: 4.0,
        change: 0.2,
        changePercent: 5,
        trend: "up",
      },
    },
    trends: {
      topTrends: ["Trending Product A", "Trending Product B", "Trending Product C"],
      emergingOpportunities: ["Niche Opportunity 1", "Niche Opportunity 2"],
      declineWarnings: [],
      marketVelocity: 0.25,
    },
    competitors: {
      positioningScore: data.merchantStrength || 65,
      competitiveAdvantages: ["Better pricing", "Superior customer service"],
      areasToImprove: ["Product selection", "Shipping speed"],
      benchmarkGaps: {
        revenue: 5,
        marketShare: -10,
        satisfaction: 8,
      },
    },
    recommendations: {
      priority: [
        "Invest in top-trending products",
        "Optimize conversion funnel",
        "Expand marketing reach",
      ],
      quickWins: ["Implement upsell strategy", "Launch seasonal promotion"],
      longTermStrategy: [
        "Build brand authority",
        "Expand product catalog",
        "Enter new markets",
      ],
    },
  };
}

export function exportReportAsJSON(report: PerformanceReport): string {
  return JSON.stringify(report, null, 2);
}

export function exportReportAsHTML(report: PerformanceReport): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${report.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          section { margin-bottom: 30px; page-break-inside: avoid; }
          .metric { display: inline-block; width: 23%; margin-right: 2%; padding: 10px; border: 1px solid #ddd; }
          .up { color: green; }
          .down { color: red; }
        </style>
      </head>
      <body>
        <h1>${report.title}</h1>
        <p>Generated: ${report.generatedAt.toLocaleDateString()}</p>
        
        <section>
          <h2>Executive Summary</h2>
          <p><strong>Overall Score:</strong> ${report.executive.overallScore}/100</p>
          <h3>Highlights</h3>
          <ul>
            ${report.executive.keyHighlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </section>

        <section>
          <h2>Key Metrics</h2>
          ${Object.entries(report.metrics)
            .map(
              ([key, metric]) => `
            <div class="metric">
              <strong>${key}</strong><br/>
              Current: ${metric.current}<br/>
              Change: <span class="${metric.trend}">${metric.changePercent.toFixed(1)}%</span>
            </div>
          `,
            )
            .join("")}
        </section>

        <section>
          <h2>Recommendations</h2>
          <h3>Priority Actions</h3>
          <ol>
            ${report.recommendations.priority.map((r) => `<li>${r}</li>`).join("")}
          </ol>
        </section>
      </body>
    </html>
  `;
}

export function exportReportAsCSV(report: PerformanceReport): string {
  const rows = [
    ["Performance Report"],
    ["Generated", report.generatedAt.toISOString()],
    [],
    ["Executive Summary"],
    ["Overall Score", report.executive.overallScore],
    [],
    ["Metrics"],
  ];

  Object.entries(report.metrics).forEach(([key, metric]) => {
    rows.push([
      key,
      metric.current.toString(),
      metric.previous.toString(),
      metric.changePercent.toFixed(2) + "%",
    ]);
  });

  rows.push([]);
  rows.push(["Recommendations"]);
  report.recommendations.priority.forEach((rec) => {
    rows.push(["Priority", rec]);
  });

  return rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
}

export function scheduleReportEmail(report: PerformanceReport, email: string, frequency: "daily" | "weekly" | "monthly"): void {
  // Implementation would send report to email service
  console.log(`Report scheduled for ${email} - ${frequency}`);
}
