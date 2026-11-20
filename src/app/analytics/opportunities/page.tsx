"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Opportunity {
  id: string;
  title: string;
  trendScore: number;
  competitorWeakness: number;
  merchantReadiness: number;
  opportunityScore: number;
  reason: string;
}

export default function AnalyticsOpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/opportunities?limit=20");
        if (!response.ok) {
          throw new Error("Failed to fetch opportunities");
        }
        const json = await response.json();
        setOpportunities(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSelectOpportunity = (opportunity: Opportunity) => {
    sessionStorage.setItem("selectedOpportunity", JSON.stringify(opportunity));
    router.push("/create");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading opportunities...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button onClick={() => router.push("/dashboard")} className="text-indigo-400 hover:text-indigo-300">
            Return to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Market Opportunities</h1>
          <p className="text-slate-400">High-potential product opportunities ranked by opportunity score</p>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-4">No opportunities found</p>
            <button onClick={() => router.push("/dashboard")} className="text-indigo-400 hover:text-indigo-300">
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition cursor-pointer"
                onClick={() => handleSelectOpportunity(opp)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{opp.title}</h3>
                    <p className="text-sm text-slate-400">{opp.reason}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-indigo-400">{opp.opportunityScore.toFixed(0)}</span>
                    <p className="text-xs text-slate-400">Opportunity Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Trend Score</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${opp.trendScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-400">{opp.trendScore.toFixed(0)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Competitor Gap</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${opp.competitorWeakness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-blue-400">{opp.competitorWeakness.toFixed(0)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Your Readiness</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500"
                          style={{ width: `${opp.merchantReadiness}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-purple-400">{opp.merchantReadiness.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
