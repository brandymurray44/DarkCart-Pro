"use client";

import { Badge } from "@/components/ui";
import { TrendCandidate } from "@/server/trends/trendEngine";

interface TrendIntelligenceCardProps {
  trend: TrendCandidate;
  onClick?: () => void;
}

export function TrendIntelligenceCard({ trend, onClick }: TrendIntelligenceCardProps) {
  const intelligenceColors = {
    "public": "default",
    "restricted": "intelligence",
    "classified": "classified",
    "top-secret": "classified"
  } as const;

  const intelligenceLabels = {
    "public": "PUBLIC",
    "restricted": "RESTRICTED",
    "classified": "CLASSIFIED",
    "top-secret": "TOP SECRET"
  };

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <Badge 
          variant={intelligenceColors[trend.intelligenceLevel || "public"]}
          pulse={trend.intelligenceLevel === "top-secret"}
        >
          {intelligenceLabels[trend.intelligenceLevel || "public"]}
        </Badge>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">
            {trend.score.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">SCORE</div>
        </div>
      </div>
      
      <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors">
        {trend.title}
      </h3>
      
      <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
        <span>Source: {trend.source}</span>
        {trend.niche && <span>• {trend.niche}</span>}
      </div>

      {trend.confidence !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">CONFIDENCE</span>
            <span className="text-purple-300">{trend.confidence.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-500"
              style={{ width: `${trend.confidence}%` }}
            />
          </div>
        </div>
      )}

      {trend.velocity !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">VELOCITY:</span>
          <span className={trend.velocity > 0 ? "text-green-400" : "text-red-400"}>
            {trend.velocity > 0 ? "+" : ""}{trend.velocity.toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
