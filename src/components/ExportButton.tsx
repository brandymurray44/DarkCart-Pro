"use client";

interface AnalyticsData {
  performance: {
    revenue30Days: number;
    orders30Days: number;
    avgOrderValue: number;
    salesVelocity: number;
    merchantStrength: number;
  };
  trends: {
    topTrends: number;
    trendVelocity: number;
    averageTrendScore: number;
  };
  competitors: {
    count: number;
    avgScore: number;
  };
  overlap: {
    trendCoverage: number;
    opportunityScore: number;
  };
}

export function exportToCSV(data: AnalyticsData, filename: string = "dashboard-analytics.csv") {
  const rows = [
    ["DarkCart-Pro Dashboard Analytics Export"],
    ["Generated:", new Date().toLocaleString()],
    [],
    ["PERFORMANCE METRICS (30 Days)"],
    ["Metric", "Value"],
    ["Revenue", `$${data.performance.revenue30Days.toLocaleString()}`],
    ["Orders", data.performance.orders30Days],
    ["Average Order Value", `$${data.performance.avgOrderValue.toFixed(2)}`],
    ["Sales Velocity (orders/day)", data.performance.salesVelocity.toFixed(2)],
    ["Merchant Strength", `${data.performance.merchantStrength}%`],
    [],
    ["TREND INTELLIGENCE"],
    ["Metric", "Value"],
    ["Active Trends", data.trends.topTrends],
    ["Trend Velocity (daily growth)", `${(data.trends.trendVelocity * 100).toFixed(1)}%`],
    ["Average Trend Score", `${data.trends.averageTrendScore.toFixed(0)}/100`],
    [],
    ["COMPETITOR ANALYSIS"],
    ["Metric", "Value"],
    ["Competitors Tracked", data.competitors.count],
    ["Average Competitor Score", `${data.competitors.avgScore.toFixed(0)}/100`],
    [],
    ["OPPORTUNITY METRICS"],
    ["Metric", "Value"],
    ["Trend Coverage", `${data.overlap.trendCoverage}%`],
    ["Opportunity Score", `${data.overlap.opportunityScore}%`],
  ];

  const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export function exportToJSON(data: AnalyticsData, filename: string = "dashboard-analytics.json") {
  const exportData = {
    exportedAt: new Date().toISOString(),
    ...data,
  };

  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

interface ExportButtonProps {
  data: AnalyticsData | null;
  loading?: boolean;
}

export function ExportButton({ data, loading }: ExportButtonProps) {
  const handleExportCSV = () => {
    if (!data) return;
    exportToCSV(data);
  };

  const handleExportJSON = () => {
    if (!data) return;
    exportToJSON(data);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportCSV}
        disabled={!data || loading}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition text-sm"
        title="Export as CSV"
      >
        📥 Export CSV
      </button>
      <button
        onClick={handleExportJSON}
        disabled={!data || loading}
        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition text-sm"
        title="Export as JSON"
      >
        📥 Export JSON
      </button>
    </div>
  );
}
