"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TrendDetailModal } from "@/components/trends/TrendDetailModal";

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
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [niche, setNiche] = useState<string>("home office");
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    const fetchTrends = async () => {
      const params = new URLSearchParams();
      if (niche) params.set("niche", niche);
      if (source) params.set("source", source);
      const response = await fetch(`/api/trends?${params.toString()}`);
      const json = await response.json();
      setTrends(json.data || []);
      setLoading(false);
    };
    fetchTrends();
  }, [niche, source]);

  const handleSelectTrend = (trend: Trend) => {
    setSelectedTrend(trend);
  };

  const handleGenerateProduct = (trend: Trend) => {
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

        <div className="mb-6 flex items-center gap-4">
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="Niche (e.g., home office)"
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          />
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Source (optional, e.g., tiktok)"
            className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white"
          />
          <button
            onClick={() => { setLoading(true); /* triggers useEffect */ }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded"
          >
            Filter
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={async () => {
                setScraping(true);
                try {
                  const res = await fetch('/api/jobs/trends', { method: 'POST' });
                  const json = await res.json();
                  if (res.ok) {
                    // refetch
                    const params = new URLSearchParams();
                    if (niche) params.set('niche', niche);
                    if (source) params.set('source', source);
                    const r2 = await fetch(`/api/trends?${params.toString()}`);
                    const j2 = await r2.json();
                    setTrends(j2.data || []);
                    alert(json.message || 'Scrape completed');
                  } else if (res.status === 401) {
                    alert('Unauthorized. Please log in to run scrapes.');
                  } else {
                    alert(json.message || 'Scrape failed');
                  }
                } catch (e) {
                  console.error('Scrape error', e);
                  alert('Scrape request failed');
                } finally {
                  setScraping(false);
                }
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded"
              disabled={scraping}
            >
              {scraping ? 'Scraping…' : 'Scrape Now'}
            </button>
            <button
              onClick={async () => {
                setLoading(true);
                const params = new URLSearchParams();
                if (niche) params.set('niche', niche);
                if (source) params.set('source', source);
                const r2 = await fetch(`/api/trends?${params.toString()}`);
                const j2 = await r2.json();
                setTrends(j2.data || []);
                setLoading(false);
              }}
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
