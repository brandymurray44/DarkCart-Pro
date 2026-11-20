"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

interface CompetitorProduct {
  id: string;
  title: string;
  price: number;
  rating: number;
  sales: number;
  imageUrl?: string;
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
  products: CompetitorProduct[];
}

export default function CompetitorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [competitor, setCompetitor] = useState<CompetitorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
        </div>

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

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Price & Rating Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Price Distribution</h3>
              <div className="space-y-2">
                {competitor.products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <span className="text-slate-300 text-sm flex-1 truncate">{product.title}</span>
                    <span className="text-white font-semibold">${product.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Rating Distribution</h3>
              <div className="space-y-2">
                {competitor.products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <span className="text-slate-300 text-sm flex-1 truncate">{product.title}</span>
                    <span className={`font-semibold ${getRatingColor(product.rating)}`}>
                      {product.rating.toFixed(1)}/5
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
