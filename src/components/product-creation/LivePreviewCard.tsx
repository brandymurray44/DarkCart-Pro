"use client";

import React, { useEffect, useState } from "react";

interface PreviewProduct {
  title?: string;
  description?: string;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  imagePrompts?: string[];
  price?: number;
}

interface LivePreviewCardProps {
  product?: PreviewProduct;
}

export function LivePreviewCard({ product: productProp }: LivePreviewCardProps) {
  const [storedProduct, setStoredProduct] = useState<PreviewProduct | null>(null);

  useEffect(() => {
    if (!productProp) {
      const stored = sessionStorage.getItem("generatedProduct") || sessionStorage.getItem("productToPublish");
      if (stored) {
        try {
          setStoredProduct(JSON.parse(stored));
        } catch (e) {
          setStoredProduct(null);
        }
      }
    }
  }, [productProp]);

  const product = productProp ?? storedProduct;

  if (!product) {
    return (
      <div className="text-center max-w-sm">
        <div className="mb-6">
          <svg className="h-24 w-24 text-slate-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Preview will appear here</h3>
        <p className="text-slate-400 text-sm">Generate a product to see a live preview of the listing.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
        <span className="text-slate-400">Product Image</span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900">{product.title ?? "Untitled Product"}</h3>
        <p className="text-sm text-slate-600 mt-2 line-clamp-3">{product.description ?? "No description yet."}</p>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="text-slate-500 text-xs">Price</div>
            <div className="text-lg font-bold text-slate-900">${(product.price ?? 29.99).toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-slate-500 text-xs">Tags</div>
            <div className="flex gap-2 mt-1 justify-end flex-wrap">
              {(product.tags ?? []).slice(0, 4).map((t, i) => (
                <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
