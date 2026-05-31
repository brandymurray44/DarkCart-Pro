"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Competitor {
  id: string;
  name: string;
  shopDomain: string;
  productCount: number;
  avgPrice: number;
  avgRating: number;
  totalSales: number;
  weaknessScore: number;
}

export default function CompetitorsPage() {
  const router = useRouter();
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/competitor");
        if (!response.ok) {
          throw new Error("Failed to fetch competitors");
        }
        const json = await response.json();
        setCompetitors(json.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getWeaknessColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading competitors...</div>
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Competitor Analysis</h1>
          <p className="text-slate-400">Analyze your competitors and identify market opportunities</p>
        </div>

        {competitors.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-4">No competitors found</p>
            <button onClick={() => router.push("/dashboard")} className="text-indigo-400 hover:text-indigo-300">
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitors.map((competitor) => (
              <div key={competitor.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{competitor.name}</h3>
                    <p className="text-sm text-slate-400">{competitor.shopDomain}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${getWeaknessColor(competitor.weaknessScore)}`}>
                      {competitor.weaknessScore.toFixed(0)}
                    </span>
                    <p className="text-xs text-slate-400">Weakness</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Products</span>
                    <span className="text-white font-semibold">{competitor.productCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Avg Price</span>
                    <span className="text-white font-semibold">${competitor.avgPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Avg Rating</span>
                    <span className="text-white font-semibold">{competitor.avgRating.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Total Sales</span>
                    <span className="text-white font-semibold">{competitor.totalSales.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push(`/competitors/${competitor.id}`)}
                  className="w-full mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
