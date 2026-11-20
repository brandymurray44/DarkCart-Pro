// Opportunities List Widget - Top high-value opportunities

"use client";

import React from "react";
import { WidgetProps, WidgetContainer } from "@/lib/widgets/WidgetSystem";
import { useAnalyticsOpportunities } from "@/hooks/useDashboardAnalytics";

const OpportunitiesListWidget: React.FC<WidgetProps> = ({ id, filters, onRefresh, isLoading }) => {
  const { data, loading, error, refetch } = useAnalyticsOpportunities(filters, 10);

  const handleRefresh = async () => {
    await refetch();
    onRefresh?.();
  };

  return (
    <WidgetContainer
      title="Top Opportunities"
      size="large"
      loading={loading || isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((opp) => (
            <OpportunityRow key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-sm">No opportunities found for the selected period.</p>
      )}
    </WidgetContainer>
  );
};

interface OpportunityRowProps {
  opportunity: any;
}

function OpportunityRow({ opportunity }: OpportunityRowProps) {
  const score = Math.round(opportunity.opportunityScore || 0);
  const scoreColor =
    score >= 75 ? "bg-green-900/30 text-green-400 border border-green-700" : score >= 50 ? "bg-yellow-900/30 text-yellow-400 border border-yellow-700" : "bg-orange-900/30 text-orange-400 border border-orange-700";

  return (
    <div className="p-3 border border-slate-600 rounded-lg hover:border-indigo-500 hover:bg-slate-700/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-white flex-1">{opportunity.title}</h4>
        <span className={`px-2 py-1 rounded text-xs font-bold ${scoreColor}`}>{score}</span>
      </div>
      <p className="text-sm text-slate-300 mb-2">{opportunity.reason}</p>
      <div className="flex items-center gap-4 text-xs">
        <div>
          <span className="text-slate-400">Trend Score:</span>
          <span className="font-semibold ml-1 text-white">{(opportunity.trendScore * 100).toFixed(0)}%</span>
        </div>
        <div>
          <span className="text-slate-400">Readiness:</span>
          <span className="font-semibold ml-1 text-white">{(opportunity.merchantReadiness * 100).toFixed(0)}%</span>
        </div>
        <div>
          <span className="text-slate-400">Competition:</span>
          <span className="font-semibold ml-1 text-white">{(opportunity.competitorWeakness * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}

export default OpportunitiesListWidget;
