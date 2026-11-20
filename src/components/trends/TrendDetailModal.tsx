"use client";

import React from "react";

interface Trend {
  id: string;
  source: string;
  title: string;
  url: string;
  score: number;
  niche: string;
  freshness?: string;
  momentum?: number;
}

interface TrendDetailModalProps {
  trend: Trend | null;
  onClose: () => void;
  onSelect: (trend: Trend) => void;
}

export function TrendDetailModal({ trend, onClose, onSelect }: TrendDetailModalProps) {
  if (!trend) return null;

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
