// Overview Metrics Widget - Key performance indicators

"use client";

import React from "react";
import { WidgetProps, WidgetContainer } from "@/lib/widgets/WidgetSystem";
import { useAnalyticsOverview } from "@/hooks/useDashboardAnalytics";

const OverviewMetricsWidget: React.FC<WidgetProps> = ({ id, filters, onRefresh, isLoading }) => {
  const { data, loading, error, refetch } = useAnalyticsOverview(filters);

  const handleRefresh = async () => {
    await refetch();
    onRefresh?.();
  };

  return (
    <WidgetContainer
      title="Performance Overview"
      size="large"
      loading={loading || isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      {data && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Revenue (30d)"
            value={`$${(data.performance.revenue30Days / 1000).toFixed(1)}K`}
            change={5.2}
          />
          <MetricCard
            label="Orders (30d)"
            value={data.performance.orders30Days.toLocaleString()}
            change={3.1}
          />
          <MetricCard
            label="Avg Order Value"
            value={`$${data.performance.avgOrderValue.toFixed(2)}`}
            change={-1.5}
          />
          <MetricCard
            label="Sales Velocity"
            value={data.performance.salesVelocity.toFixed(2)}
            change={2.8}
          />
          <MetricCard
            label="Merchant Strength"
            value={`${(data.performance.merchantStrength * 100).toFixed(0)}%`}
            change={0}
            highlight
          />
          <MetricCard
            label="Top Trends"
            value={data.trends.topTrends}
            change={0}
          />
          <MetricCard
            label="Avg Trend Score"
            value={data.trends.averageTrendScore.toFixed(1)}
            change={4.2}
          />
          <MetricCard
            label="Competitors"
            value={data.competitors.count}
            change={0}
          />
        </div>
      )}
    </WidgetContainer>
  );
};

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  highlight?: boolean;
}

function MetricCard({ label, value, change, highlight }: MetricCardProps) {
  const isPositive = (change ?? 0) >= 0;

  return (
    <div className={`p-3 rounded-lg ${highlight ? "bg-indigo-900/30 border border-indigo-700" : "bg-slate-700/30 border border-slate-600"}`}>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? "text-indigo-300" : "text-white"}`}>
        {value}
      </p>
      {change !== undefined && change !== 0 && (
        <p className={`text-xs mt-1 ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{change.toFixed(1)}%
        </p>
      )}
    </div>
  );
}

export default OverviewMetricsWidget;
