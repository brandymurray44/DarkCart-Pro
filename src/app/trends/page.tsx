"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TrendDetailModal } from "@/components/trends/TrendDetailModal";
import { useToast } from "@/components/ui/Toast";

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

export default function TrendsPage() {
  const router = useRouter();
  const { showToast } = useToast();
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

  const handleGenerateProduct = (_trend: Trend) => {
    setSelectedTrend(null);
    router.push(`/create`);
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
          <input
            value={niche}
            onChange={(e) => handleNicheChange(e.target.value)}
            placeholder="Niche (e.g., home office)"
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          />
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trends.map((trend, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectTrend(trend)}
                className="text-left p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-indigo-500 hover:bg-slate-800 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase tracking-wider text-indigo-400">{trend.source}</span>
                  <span className={`text-sm font-semibold ${getScoreColor(trend.score)}`}>{trend.score.toFixed(1)}</span>
                </div>
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{trend.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">{trend.niche}</p>
                  {trend.freshness && (
                    <span className={`text-xs px-2 py-1 rounded border ${getFreshnessColor(trend.freshness)}`}>
                      {trend.freshness}
                    </span>
                  )}
                </div>
              </button>
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
