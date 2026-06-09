"use client";

import React, { useEffect, useState } from "react";

interface Trend {
  id: string;
  source: string;
  title: string;
  url: string;
  score: number;
  niche: string;
  freshness?: string;
  momentum?: number;
  velocity?: number;
  saturation?: number;
}

interface TrendInsights {
  insight: string;
  action: "Buy" | "Wait" | "Monitor" | "Differentiate";
  opportunity: string;
}

function getActionColor(action: TrendInsights["action"]) {
  switch (action) {
    case "Buy": return "text-emerald-400 bg-emerald-900/40 border border-emerald-500/50";
    case "Wait": return "text-amber-400 bg-amber-900/40 border border-amber-500/50";
    case "Differentiate": return "text-purple-400 bg-purple-900/40 border border-purple-500/50";
    default: return "text-blue-400 bg-blue-900/40 border border-blue-500/50";
  }
}

interface TrendDetailModalProps {
  trend: Trend | null;
  onClose: () => void;
  onSelect: (trend: Trend) => void;
}

export function TrendDetailModal({ trend, onClose, onSelect }: TrendDetailModalProps) {
  if (!trend) return null;


  const [insights, setInsights] = useState<TrendInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    if (!trend) return;
    setLoadingInsights(true);
    setInsights(null);
    const params = new URLSearchParams({
      title: trend.title,
      source: trend.source,
      score: String(trend.score),
      niche: trend.niche,
    });
    if (trend.velocity !== undefined) params.set("velocity", String(trend.velocity));
    if (trend.saturation !== undefined) params.set("saturation", String(trend.saturation));
    fetch(`/api/trends/insights?${params.toString()}`)
      .then((r) => r.json())
      .then((json) => { if (json.data) setInsights(json.data); })
      .catch(() => null)
      .finally(() => setLoadingInsights(false));
  }, [trend]);

  const getFreshnessColor = (freshness?: string) => {
    switch (freshness) {
      case "hot":
        return "text-red-400";
      case "warm":
        return "text-orange-400";
      case "cool":
        return "text-blue-400";
      default:
        return "text-slate-400";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-slate-400";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider text-indigo-400">{trend.source}</span>
                {trend.freshness && (
                  <span className={`text-xs uppercase tracking-wider ${getFreshnessColor(trend.freshness)}`}>
                    {trend.freshness}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{trend.title}</h2>
              <p className="text-sm text-slate-400">{trend.niche}</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-1">Trend Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(trend.score)}`}>{trend.score.toFixed(1)}</p>
            </div>
            {trend.momentum && (
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                <p className="text-xs text-slate-400 mb-1">Momentum</p>
                <p className="text-3xl font-bold text-white">{(trend.momentum * 100).toFixed(0)}%</p>
              </div>
            )}
          </div>

          {/* AI Insights Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">AI</span>
              </div>
              <h3 className="text-sm font-semibold text-white">AI Trend Analysis</h3>
              {loadingInsights && (
                <svg className="animate-spin h-3 w-3 text-indigo-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
            </div>
            {insights ? (
              <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Recommendation</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${getActionColor(insights.action)}`}>{insights.action}</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{insights.insight}</p>
                {insights.opportunity && (
                  <p className="text-xs text-indigo-300 italic">💡 {insights.opportunity}</p>
                )}
              </div>
            ) : !loadingInsights && (
              <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 italic">AI analysis unavailable</p>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3">Scoring Breakdown</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Demand</span>
                  <span className="text-white">{Math.min(trend.score + 10, 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${Math.min(trend.score + 10, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Growth Rate</span>
                  <span className="text-white">{Math.min(trend.score - 5, 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${Math.min(trend.score - 5, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Competition</span>
                  <span className="text-white">{Math.min(100 - trend.score, 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{ width: `${Math.min(100 - trend.score, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <a
              href={trend.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-center"
            >
              View Source
            </a>
            <button
              onClick={() => onSelect(trend)}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition"
            >
              Generate Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
