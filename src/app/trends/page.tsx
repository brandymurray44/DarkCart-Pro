"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TrendDetailModal } from "@/components/trends/TrendDetailModal";
import { useToast } from "@/components/ui/Toast";
import { usePremiumAccess, PremiumBadge } from "@/components/ui/PremiumLock";

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
  description?: string;
}

export default function TrendsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { canAccess: hasBlackAccess } = usePremiumAccess("BLACK");
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [niche, setNiche] = useState<string>("home office");
  const [source, setSource] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadTrends = useCallback(async (nicheVal: string, sourceVal: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (nicheVal) params.set("niche", nicheVal);
      if (sourceVal) params.set("source", sourceVal);
      const response = await fetch(`/api/trends?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch trends");
      const json = await response.json();
      setTrends(json.data || []);
    } catch (e) {
      console.error("Fetch trends error", e);
      showToast("error", "Failed to load trends.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTrends(niche, source);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = () => {
    loadTrends(niche, source);
  };

  const handleNicheChange = (value: string) => {
    setNiche(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadTrends(value, source);
    }, 500);
  };

  const handleSourceChange = (value: string) => {
    setSource(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      loadTrends(niche, value);
    }, 500);
  };

  const handleScrape = async () => {
    setScraping(true);
    try {
      const res = await fetch("/api/jobs/trends", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        await loadTrends(niche, source);
        showToast("success", json.message || "Scrape completed.");
      } else if (res.status === 401) {
        showToast("error", "Unauthorized. Please log in to run scrapes.");
      } else {
        showToast("error", json.message || "Scrape failed.");
      }
    } catch (e) {
      console.error("Scrape error", e);
      showToast("error", "Scrape request failed.");
    } finally {
      setScraping(false);
    }
  };

  const handleSelectTrend = (trend: Trend) => {
    setSelectedTrend(trend);
  };

  const handleGenerateProduct = (trend: Trend) => {
    setSelectedTrend(null);
    // Store trend data for the generator to use
    sessionStorage.setItem("trendForGenerator", JSON.stringify({
      title: trend.title,
      niche: trend.niche,
      source: trend.source,
      score: trend.score,
    }));
    router.push(`/product-creation/generate`);
  };

  const getFreshnessColor = (freshness?: string) => {
    switch (freshness) {
      case "hot":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "warm":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "cool":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default:
        return "bg-slate-600/20 text-slate-400 border-slate-600/50";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-slate-400";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold text-white">Trending Products</h1>
          <p className="text-slate-400">Select a product to generate content for</p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Niche:</span>
            <input
              value={niche}
              onChange={(e) => handleNicheChange(e.target.value)}
              placeholder="home office"
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white w-48"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-sm">Source:</span>
            <select
              value={source}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white w-36"
            >
              <option value="">All Sources</option>
              <option value="tiktok">TikTok</option>
              <option value="etsy">Etsy</option>
              <option value="reddit">Reddit</option>
            </select>
          </div>
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium"
          >
            Filter
          </button>
          <input
            value={source}
            onChange={(e) => handleSourceChange(e.target.value)}
            placeholder="Source (optional, e.g., tiktok)"
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          />
          <button
            onClick={handleFilter}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
          >
            Filter
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={handleScrape}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded disabled:opacity-50"
              disabled={scraping}
            >
              {scraping ? "Scraping\u2026" : "Scrape Now"}
            </button>
            <button
              onClick={() => loadTrends(niche, source)}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Loading trends...</div>
        ) : trends.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No Trends Found</h3>
            <p className="text-slate-400 mb-4">Run a scrape to discover trending products</p>
            <button
              onClick={handleScrape}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium"
            >
              Scrape Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map((trend, idx) => (
              <div
                key={idx}
                className="group relative bg-slate-800/50 border border-slate-700 rounded-lg p-5 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300"
              >
                {/* Velocity indicator */}
                {trend.velocity !== undefined && (
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">
                      {trend.velocity > 0 ? "+" : ""}{trend.velocity.toFixed(0)}%
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleSelectTrend(trend)}
                  className="w-full text-left"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs uppercase tracking-wider text-indigo-400 font-semibold">{trend.source}</span>
                    {trend.freshness && (
                      <span className={`text-xs px-2 py-0.5 rounded border ${getFreshnessColor(trend.freshness)}`}>
                        {trend.freshness}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {trend.title}
                  </h3>

                  {/* Score bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Trend Score</span>
                      <span className={`font-semibold ${getScoreColor(trend.score)}`}>{trend.score.toFixed(1)}</span>
                    </div>
                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${trend.score >= 80 ? "bg-gradient-to-r from-green-500 to-emerald-400" : trend.score >= 60 ? "bg-gradient-to-r from-yellow-500 to-orange-400" : "bg-slate-500"}`}
                        style={{ width: `${trend.score}%` }}
                      />
                    </div>
                  </div>

                  {/* Saturation heatmap indicator */}
                  {trend.saturation !== undefined && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-slate-400">Market Saturation</span>
                      <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${trend.saturation < 40 ? "bg-green-500" : trend.saturation < 70 ? "bg-yellow-500" : "bg-red-500"}`}
                          style={{ width: `${trend.saturation}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{trend.saturation.toFixed(0)}%</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">{trend.niche}</p>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>View Details</span>
                    </div>
                  </div>
                </button>

                {/* Hover action: Add to Generator */}
                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => handleSelectTrend(trend)}
                    className="text-xs text-slate-400 hover:text-white transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => hasBlackAccess ? handleGenerateProduct(trend) : router.push("/settings")}
                    className={`px-3 py-1.5 text-xs rounded font-medium transition flex items-center gap-1 ${
                      hasBlackAccess
                        ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                        : "bg-indigo-600/50 hover:bg-indigo-600 text-white border border-indigo-500/50"
                    }`}
                  >
                    {hasBlackAccess ? "Generate Product" : <><PremiumBadge /> Premium Access</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <TrendDetailModal
          trend={selectedTrend}
          onClose={() => setSelectedTrend(null)}
          onSelect={handleGenerateProduct}
        />
      </div>
    </main>
  );
}
