"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AnalyticsOverview {
  shop: {
    domain: string;
    name: string;
  };
  performance: {
    revenue30Days: number;
    orders30Days: number;
    salesVelocity: number;
    avgOrderValue: number;
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

export default function AnalyticsOverviewPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/overview");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }
        const json = await response.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading analytics...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load analytics"}</p>
          <button onClick={() => router.push("/dashboard")} className="text-indigo-400 hover:text-indigo-300">
            Return to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Analytics Overview</h1>
          <p className="text-slate-400">{data.shop.name} - {data.shop.domain}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Revenue (30 Days)</p>
            <p className="text-2xl font-bold text-white">${data.performance.revenue30Days.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Orders (30 Days)</p>
            <p className="text-2xl font-bold text-white">{data.performance.orders30Days.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Sales Velocity</p>
            <p className="text-2xl font-bold text-white">{data.performance.salesVelocity.toFixed(2)}/day</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Avg Order Value</p>
            <p className="text-2xl font-bold text-white">${data.performance.avgOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Trend Intelligence</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Top Trends</span>
                <span className="text-white font-semibold">{data.trends.topTrends}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Trend Velocity</span>
                <span className="text-green-400 font-semibold">{(data.trends.trendVelocity * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Avg Trend Score</span>
                <span className="text-amber-400 font-semibold">{data.trends.averageTrendScore.toFixed(0)}/100</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Competitor Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Competitors</span>
                <span className="text-white font-semibold">{data.competitors.count}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Avg Competitor Score</span>
                <span className="text-blue-400 font-semibold">{data.competitors.avgScore.toFixed(0)}/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Market Opportunity</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-300">Trend Coverage</span>
                <span className="text-white font-semibold">{data.overlap.trendCoverage.toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Opportunity Score</span>
                <span className="text-indigo-400 font-semibold">{data.overlap.opportunityScore.toFixed(0)}/100</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Merchant Strength</h2>
            <div className="flex items-center justify-center">
              <span className="text-5xl font-bold text-white">{data.performance.merchantStrength.toFixed(0)}%</span>
            </div>
            <p className="text-center text-slate-400 text-sm mt-2">Overall store health score</p>
          </div>
        </div>
      </div>
    </main>
  );
}
