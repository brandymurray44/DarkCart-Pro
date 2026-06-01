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

export function LivePreviewCard() {
  const [product, setProduct] = useState<PreviewProduct | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("generatedProduct") || sessionStorage.getItem("productToPublish");
    if (stored) {
      try {
        setProduct(JSON.parse(stored));
      } catch (e) {
        setProduct(null);
      }
    }
  }, []);

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
"use client";

import React from "react";

interface ProductPreview {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  tags: string[];
  images: Array<{ url: string; alt?: string }>;
}

interface LivePreviewCardProps {
  product: ProductPreview;
}

export function LivePreviewCard({ product }: LivePreviewCardProps) {
  const primaryImage = product.images[0]?.url;

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 sticky top-8">
      <h3 className="text-lg font-semibold text-white mb-4">Live Preview</h3>
      
      <div className="bg-white rounded-lg overflow-hidden mb-4">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e5e7eb'/%3E%3Ctext x='200' y='100' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='14'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
            <p className="text-slate-400 text-sm">No image</p>
          </div>
        )}
        
        <div className="p-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">${product.compareAtPrice.toFixed(2)}</span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">{product.description}</p>
          
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 4).map((tag, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-2">Typography Preview</h4>
        <p className="text-xs text-slate-400 mb-1">Title:</p>
        <p className="text-sm text-white font-semibold mb-3">{product.title}</p>
        <p className="text-xs text-slate-400 mb-1">Description:</p>
        <p className="text-xs text-slate-300 line-clamp-4">{product.description}</p>
      </div>
    </div>
  );
}
