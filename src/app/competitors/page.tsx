"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import { usePremiumAccess, PremiumBadge } from "@/components/ui/PremiumLock";

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
  const { showToast } = useToast();
  const { canAccess: hasBlackAccess, loading: tierLoading } = usePremiumAccess("BLACK");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discoverNiche, setDiscoverNiche] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  async function fetchCompetitors() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/competitor");
      if (!response.ok) {
        throw new Error("Failed to fetch competitors");
      }
      const json = await response.json();
      setCompetitors(json.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDiscover() {
    const trimmed = discoverNiche.trim();
    if (!trimmed) {
      showToast("warning", "Enter a niche to discover competitors.");
      return;
    }
    setDiscovering(true);
    try {
      const res = await fetch("/api/competitor/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: trimmed }),
      });
      const json = await res.json();
      if (res.ok) {
        showToast("success", `Discovered ${json.discovered} stores.`);
        setDiscoverNiche("");
        await fetchCompetitors();
      } else {
        showToast("error", json.error || "Discovery failed.");
      }
    } catch (e) {
      console.error("Discovery error", e);
      showToast("error", "Discovery request failed.");
    } finally {
      setDiscovering(false);
    }
  }

  async function handleScan() {
    setScanning(true);
    try {
      const res = await fetch("/api/jobs/competitor", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        showToast("success", json.message || "Scan started.");
        await fetchCompetitors();
      } else {
        showToast("error", json.error || "Scan failed.");
      }
    } catch (e) {
      console.error("Scan error", e);
      showToast("error", "Scan request failed.");
    } finally {
      setScanning(false);
    }
  }

  const getWeaknessColor = (score: number) => {
    if (score >= 70) return "text-green-400";
    if (score >= 40) return "text-yellow-400";
    return "text-red-400";
  };

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

        {/* Discovery & Scan Controls — always visible */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <input
              value={discoverNiche}
              onChange={(e) => setDiscoverNiche(e.target.value)}
              placeholder="Enter a niche to discover competitors"
              className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white w-72"
            />
            <button
              onClick={handleDiscover}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded disabled:opacity-50"
              disabled={discovering}
            >
              {discovering ? "Discovering\u2026" : "Discover Competitors"}
            </button>
            <button
              onClick={handleScan}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded disabled:opacity-50"
              disabled={scanning}
            >
              {scanning ? "Scanning\u2026" : "Scan Now"}
            </button>
            <button
              onClick={fetchCompetitors}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded ml-auto"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400">Loading competitors...</div>
        ) : competitors.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400">No competitors found. Use the controls above to discover competitors in your niche.</p>
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
                    {hasBlackAccess ? (
                      <span className={`text-2xl font-bold ${getWeaknessColor(competitor.weaknessScore)}`}>
                        {competitor.weaknessScore.toFixed(0)}
                      </span>
                    ) : (
                      <span className="text-2xl font-bold text-slate-500">??</span>
                    )}
                    <p className="text-xs text-slate-400">
                      {hasBlackAccess ? "Weakness" : <PremiumBadge />}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {hasBlackAccess ? (
                    <>
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
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Products</span>
                        <span className="text-white font-semibold">{competitor.productCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300 text-sm">Avg Price</span>
                        <span className="text-white font-semibold">${competitor.avgPrice.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                </div>

                <button
                  onClick={() => router.push(`/competitors/${competitor.id}`)}
                  className={`w-full mt-4 px-4 py-2 rounded font-medium transition ${
                    hasBlackAccess
                      ? "bg-slate-700 hover:bg-slate-600 text-white"
                      : "bg-indigo-600/50 hover:bg-indigo-600 text-white border border-indigo-500/50"
                  }`}
                >
                  {hasBlackAccess ? "View Details" : <><PremiumBadge /> Premium Access</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
