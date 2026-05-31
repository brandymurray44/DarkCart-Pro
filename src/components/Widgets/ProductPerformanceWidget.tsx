// Product Performance Widget - Top performing products table

"use client";

import React from "react";
import { WidgetProps, WidgetContainer } from "@/lib/widgets/WidgetSystem";
import { useAnalyticsProducts } from "@/hooks/useDashboardAnalytics";

const ProductPerformanceWidget: React.FC<WidgetProps> = ({ id, filters, onRefresh, isLoading }) => {
  const { data, loading, error, refetch } = useAnalyticsProducts(filters);

  const handleRefresh = async () => {
    await refetch();
    onRefresh?.();
  };

  return (
    <WidgetContainer
      title="Product Performance"
      size="large"
      loading={loading || isLoading}
      error={error}
      onRefresh={handleRefresh}
    >
      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-700/50 border-b border-slate-600">
              <tr>
                <th className="text-left px-4 py-2 font-semibold text-white">Product</th>
                <th className="text-center px-4 py-2 font-semibold text-white">Price</th>
                <th className="text-center px-4 py-2 font-semibold text-white">Trend Alignment</th>
                <th className="text-center px-4 py-2 font-semibold text-white">Price Comp.</th>
                <th className="text-center px-4 py-2 font-semibold text-white">Reviews Comp.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-600">
              {data.slice(0, 8).map((product) => (
                <tr key={product.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white truncate">{product.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {product.published ? "✓ Published" : "○ Draft"}
                      </p>
                    </div>
                  </td>
                  <td className="text-center px-4 py-3 text-white font-semibold">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="text-center px-4 py-3">
                    <ScoreBar score={product.trendAlignment} />
                  </td>
                  <td className="text-center px-4 py-3">
                    <ScoreBar score={product.competitorComparison.priceCompetitiveness} />
                  </td>
                  <td className="text-center px-4 py-3">
                    <ScoreBar score={product.competitorComparison.reviewCompetitiveness} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">No products found for the selected period.</p>
      )}
    </WidgetContainer>
  );
};

function ScoreBar({ score }: { score: number }) {
  const percentage = Math.round(score * 100);
  const color =
    percentage >= 75 ? "bg-green-500" : percentage >= 50 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-xs font-semibold text-white w-6">{percentage}%</span>
    </div>
  );
}

export default ProductPerformanceWidget;
