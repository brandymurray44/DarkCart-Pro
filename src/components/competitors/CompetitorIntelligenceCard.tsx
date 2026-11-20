"use client";

import { Badge, ProgressBar, StatusIndicator } from "@/components/ui";
import { CompetitorIntelligence } from "@/services/competitorEngine";

interface CompetitorIntelligenceCardProps {
  competitor: CompetitorIntelligence;
  onClick?: () => void;
}

export function CompetitorIntelligenceCard({ competitor, onClick }: CompetitorIntelligenceCardProps) {
  const threatColors = {
    low: "default",
    medium: "intelligence",
    high: "classified",
    critical: "danger"
  } as const;

  const threatLabels = {
    low: "LOW THREAT",
    medium: "MEDIUM THREAT",
    high: "HIGH THREAT",
    critical: "CRITICAL THREAT"
  };

  const intelligenceColors = {
    public: "default",
    restricted: "intelligence",
    classified: "classified",
    "top-secret": "classified"
  } as const;

  const intelligenceLabels = {
    public: "PUBLIC",
    restricted: "RESTRICTED",
    classified: "CLASSIFIED",
    "top-secret": "TOP SECRET"
  };

  return (
    <div 
      onClick={onClick}
      className="bg-slate-900/80 border border-slate-700 rounded-lg p-4 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-2">
          <Badge 
            variant={threatColors[competitor.threatLevel || "low"]}
            pulse={competitor.threatLevel === "critical"}
          >
            {threatLabels[competitor.threatLevel || "low"]}
          </Badge>
          <Badge 
            variant={intelligenceColors[competitor.intelligenceLevel || "public"]}
          >
            {intelligenceLabels[competitor.intelligenceLevel || "public"]}
          </Badge>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-400">
            {competitor.score.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">THREAT SCORE</div>
        </div>
      </div>
      
      <h3 className="text-white font-semibold mb-2 group-hover:text-purple-300 transition-colors">
        {competitor.competitorDomain}
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-lg font-bold text-white">
            {competitor.productCount}
          </div>
          <div className="text-xs text-slate-400">PRODUCTS</div>
        </div>

        <div className="bg-slate-800/50 rounded p-2">
          <div className="text-lg font-bold text-white">
            {competitor.avgRating.toFixed(1)}
          </div>
          <div className="text-xs text-slate-400">AVG RATING</div>
        </div>
      </div>

      {competitor.marketShare !== undefined && (
        <div className="mb-3">
          <ProgressBar 
            value={competitor.marketShare}
            max={100}
            variant="intelligence"
            showLabel
            label="MARKET SHARE"
          />
        </div>
      )}

      {competitor.velocity !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">VELOCITY:</span>
          <span className={competitor.velocity > 0 ? "text-green-400" : "text-red-400"}>
            {competitor.velocity > 0 ? "+" : ""}{competitor.velocity.toFixed(2)}
          </span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
        <StatusIndicator 
          status={competitor.threatLevel === "critical" ? "classified" : "operational"}
          size="sm"
          label={competitor.lastUpdated.toLocaleDateString()}
        />
      </div>
    </div>
  );
}
