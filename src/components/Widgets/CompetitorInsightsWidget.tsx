// Competitor Insights Widget - Market positioning and competitive analysis

"use client";

import React from "react";
import { WidgetProps, WidgetContainer } from "@/lib/widgets/WidgetSystem";

const CompetitorInsightsWidget: React.FC<WidgetProps> = ({ id, filters, onRefresh, isLoading }) => {
  // Mock data - integrate with real competitor benchmarking service
  const competitors = [
    { name: "Market Leader", strength: 0.92, weakness: 0.15, position: "leader" },
    { name: "Strong Competitor", strength: 0.78, weakness: 0.32, position: "above-avg" },
    { name: "Average Player", strength: 0.55, weakness: 0.55, position: "average" },
  ];

  const yourPosition = { strength: 0.68, opportunity: 0.72 };

  return (
    <WidgetContainer
      title="Competitor Analysis"
      size="medium"
      loading={isLoading}
      onRefresh={onRefresh}
    >
      <div className="space-y-4">
        <div className="bg-indigo-900/30 border border-indigo-700 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-indigo-300 mb-2">Your Position</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-indigo-400">Strength</span>
              <p className="text-lg font-bold text-indigo-200 mt-1">
                {(yourPosition.strength * 100).toFixed(0)}%
              </p>
            </div>
            <div>
              <span className="text-indigo-400">Opportunity Gap</span>
              <p className="text-lg font-bold text-indigo-200 mt-1">
                {(yourPosition.opportunity * 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 px-1">Competitor Landscape</p>
          {competitors.map((comp) => (
            <div key={comp.name} className="p-2 border border-slate-600 rounded">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">{comp.name}</span>
                <PositionBadge position={comp.position} />
              </div>
              <div className="flex gap-2 text-xs">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Strength</span>
                    <span className="font-semibold text-white">{(comp.strength * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-1">
                    <div
                      className="bg-red-500 h-1 rounded"
                      style={{ width: `${comp.strength * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-400">Weakness</span>
                    <span className="font-semibold text-white">{(comp.weakness * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded h-1">
                    <div
                      className="bg-green-500 h-1 rounded"
                      style={{ width: `${comp.weakness * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetContainer>
  );
};

function PositionBadge({ position }: { position: string }) {
  const colors = {
    leader: "bg-purple-900/30 text-purple-400 border border-purple-700",
    "above-avg": "bg-green-900/30 text-green-400 border border-green-700",
    average: "bg-yellow-900/30 text-yellow-400 border border-yellow-700",
    "below-avg": "bg-red-900/30 text-red-400 border border-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[position as keyof typeof colors]}`}>
      {position.replace("-", " ")}
    </span>
  );
}

export default CompetitorInsightsWidget;
