// Trend Insights Widget - Current trends and momentum

"use client";

import React from "react";
import { WidgetProps, WidgetContainer } from "@/lib/widgets/WidgetSystem";

const TrendInsightsWidget: React.FC<WidgetProps> = ({ id, filters, onRefresh, isLoading }) => {
  // Mock data - integrate with real trend analysis service
  const trends = [
    { name: "Sustainable Fashion", momentum: 0.85, velocity: 0.72, health: "excellent" },
    { name: "Home Automation", momentum: 0.68, velocity: 0.55, health: "good" },
    { name: "Minimalist Decor", momentum: 0.42, velocity: 0.35, health: "fair" },
  ];

  return (
    <WidgetContainer
      title="Trend Insights"
      size="medium"
      loading={isLoading}
      onRefresh={onRefresh}
    >
      <div className="space-y-3">
        {trends.map((trend) => (
          <div key={trend.name} className="p-3 border border-slate-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white text-sm">{trend.name}</h4>
              <HealthBadge health={trend.health} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Momentum:</span>
                <div className="w-full bg-slate-700 rounded h-1 mt-1">
                  <div
                    className="bg-blue-500 h-1 rounded"
                    style={{ width: `${trend.momentum * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <span className="text-slate-400">Velocity:</span>
                <div className="w-full bg-slate-700 rounded h-1 mt-1">
                  <div
                    className="bg-green-500 h-1 rounded"
                    style={{ width: `${trend.velocity * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};

function HealthBadge({ health }: { health: string }) {
  const colors = {
    excellent: "bg-green-900/30 text-green-400 border border-green-700",
    good: "bg-blue-900/30 text-blue-400 border border-blue-700",
    fair: "bg-yellow-900/30 text-yellow-400 border border-yellow-700",
    poor: "bg-red-900/30 text-red-400 border border-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[health as keyof typeof colors]}`}>
      {health}
    </span>
  );
}

export default TrendInsightsWidget;
