"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductAnalytics {
  id: string;
  title: string;
  price: number;
  published: boolean;
  trendAlignment: number;
  competitorComparison: {
    priceCompetitiveness: number;
    reviewCompetitiveness: number;
  };
}

export default function AnalyticsProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/analytics/products");
        if (!response.ok) {
          throw new Error("Failed to fetch product analytics");
        }
        const json = await response.json();
        setProducts(json.data || []);
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
        <div className="text-slate-400">Loading product analytics...</div>
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
          <h1 className="text-4xl font-bold text-white mb-2">Product Performance</h1>
          <p className="text-slate-400">Analyze your products' trend alignment and competitiveness</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-4">No products found</p>
            <button onClick={() => router.push("/create")} className="text-indigo-400 hover:text-indigo-300">
              Create Your First Product
            </button>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/50 border-b border-slate-600">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-white">Product</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-white">Status</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-white">Trend Alignment</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-white">Price Comp.</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-white">Review Comp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">{product.title}</p>
                      <p className="text-xs text-slate-400">${product.price.toFixed(2)}</p>
                    </td>
                    <td className="text-center px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.published
                          ? "bg-green-600/30 text-green-400"
                          : "bg-slate-600/30 text-slate-400"
                      }`}>
                        {product.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500"
                            style={{ width: `${product.trendAlignment}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-green-400">{product.trendAlignment.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500"
                            style={{ width: `${product.competitorComparison.priceCompetitiveness}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-blue-400">{product.competitorComparison.priceCompetitiveness.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td className="text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500"
                            style={{ width: `${product.competitorComparison.reviewCompetitiveness}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-purple-400">{product.competitorComparison.reviewCompetitiveness.toFixed(0)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
