"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePremiumAccess, PremiumLock, PremiumBadge } from "@/components/ui/PremiumLock";

interface CompetitorProduct {
  id: string;
  title: string;
  price: number;
  rating: number;
  sales: number;
  imageUrl?: string;
}

interface WeaknessBreakdown {
  pricing: number;
  ratings: number;
  reviews: number;
  productVariety: number;
}

interface AISummary {
  overall: string;
  pricing: string;
  recommendations: string[];
}


interface CompetitorDetail {
  id: string;
  name: string;
  shopDomain: string;
  productCount: number;
  avgPrice: number;
  avgRating: number;
  totalSales: number;
  weaknessScore: number;
  weaknessBreakdown: WeaknessBreakdown;
  products: CompetitorProduct[];
  aiSummary: AISummary;
  charts: {
    priceRange: number[];
    ratings: number[];
    reviewCounts: number[];
    timeline: Array<{ date: string; price: number | null; rating: number | null }>;
  };
}

export default function CompetitorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [competitor, setCompetitor] = useState<CompetitorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { canAccess: hasBlackAccess } = usePremiumAccess("BLACK");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/competitor/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch competitor details");
        }
        const json = await response.json();
        setCompetitor(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-400";
    if (rating >= 3) return "text-yellow-400";
    return "text-red-400";
  };


  const getWeaknessColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };


  const getWeaknessBgColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getBarColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading competitor details...</div>
      </main>
    );
  }

  if (error || !competitor) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || "Failed to load competitor"}</p>
          <button onClick={() => router.push("/competitors")} className="text-indigo-400 hover:text-indigo-300">
            Back to Competitors
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => router.push("/competitors")}
          className="text-slate-400 hover:text-slate-300 mb-6 inline-block"
        >
          ← Back to Competitors
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{competitor.name}</h1>
          <p className="text-slate-400">{competitor.shopDomain}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Products</p>
            <p className="text-2xl font-bold text-white">{competitor.productCount}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Avg Price</p>
            <p className="text-2xl font-bold text-white">${competitor.avgPrice.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Avg Rating</p>
            <p className={`text-2xl font-bold ${getRatingColor(competitor.avgRating)}`}>
              {competitor.avgRating.toFixed(1)}/5
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">Total Sales</p>
            <p className="text-2xl font-bold text-white">{competitor.totalSales.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <p className="text-sm text-slate-400 mb-2">
              {hasBlackAccess ? "Weakness Score" : <PremiumBadge />}
            </p>
            {hasBlackAccess ? (
              <p className={`text-2xl font-bold ${getWeaknessColor(competitor.weaknessScore)}`}>
                {competitor.weaknessScore}/100
              </p>
            ) : (
              <p className="text-2xl font-bold text-slate-500">??/100</p>
            )}
          </div>
        </div>

        {/* Weakness Breakdown — Premium */}
        {hasBlackAccess ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Opportunity Analysis</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Pricing Gap</span>
                  <span className="text-white font-semibold">{competitor.weaknessBreakdown.pricing}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${getBarColor(competitor.weaknessBreakdown.pricing)}`} style={{ width: `${competitor.weaknessBreakdown.pricing}%` }} />
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Rating Gap</span>
                  <span className="text-white font-semibold">{competitor.weaknessBreakdown.ratings}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${getBarColor(competitor.weaknessBreakdown.ratings)}`} style={{ width: `${competitor.weaknessBreakdown.ratings}%` }} />
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Review Gap</span>
                  <span className="text-white font-semibold">{competitor.weaknessBreakdown.reviews}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${getBarColor(competitor.weaknessBreakdown.reviews)}`} style={{ width: `${competitor.weaknessBreakdown.reviews}%` }} />
                </div>
              </div>
              <div className="bg-slate-800/40 rounded-lg p-3">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">Variety Gap</span>
                  <span className="text-white font-semibold">{Math.round(competitor.weaknessBreakdown.productVariety)}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${getBarColor(competitor.weaknessBreakdown.productVariety)}`} style={{ width: `${competitor.weaknessBreakdown.productVariety}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <h2 className="text-2xl font-bold text-white">AI Competitor Analysis</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Overall Assessment</p>
              <p className="text-white">{competitor.aiSummary.overall}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Pricing Strategy</p>
              <p className="text-white">{competitor.aiSummary.pricing}</p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-2">Recommendations</p>
              <ul className="space-y-2">
                {competitor.aiSummary.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white text-sm">
                    <span className="text-indigo-400 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        ) : (
          <div className="mb-8">
            <PremiumLock message="Unlock Opportunity Analysis, AI Insights, and detailed charts with Black-Access" />
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Top Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitor.products.map((product) => (
              <div key={product.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="mb-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-full h-40 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-40 bg-slate-700 rounded flex items-center justify-center">
                      <p className="text-slate-400 text-sm">No image</p>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.title}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Price</span>
                    <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Rating</span>
                    <span className={`font-semibold ${getRatingColor(product.rating)}`}>
                      {product.rating.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300 text-sm">Sales</span>
                    <span className="text-white font-semibold">{product.sales.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hasBlackAccess ? (
          <>
        {/* Price Chart Visualization */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Price Distribution</h2>
          <div className="space-y-3">
            {competitor.charts.priceRange.length > 0 ? (
              competitor.charts.priceRange.slice(0, 10).map((price, idx) => {
                const maxPrice = Math.max(...competitor.charts.priceRange);
                const percentage = maxPrice > 0 ? (price / maxPrice) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-white font-mono w-20 text-right">${price.toFixed(2)}</span>
                    <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400">No price data available</p>
            )}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Rating Distribution</h2>
          <div className="space-y-3">
            {competitor.charts.ratings.length > 0 ? (
              competitor.charts.ratings.slice(0, 10).map((rating, idx) => {
                const percentage = (rating / 5) * 100;
                return (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-white font-mono w-20 text-right">{rating.toFixed(1)}/5</span>
                    <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${getBarColor(percentage)}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400">No rating data available</p>
            )}
          </div>
        </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
