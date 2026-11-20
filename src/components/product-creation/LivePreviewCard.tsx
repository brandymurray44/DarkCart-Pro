"use client";

import React, { useState, useEffect } from "react";

interface ProductData {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
  price: number;
  compareAtPrice?: number;
  bullets: string[];
  images: Array<{ url: string; alt?: string }>;
  variants: Array<{ optionName: string; values: string[] }>;
}

interface LivePreviewCardProps {
  product?: ProductData;
}

export default function LivePreviewCard({ product: productProp }: LivePreviewCardProps) {
  const [sessionProduct, setSessionProduct] = useState<ProductData | null>(null);

  useEffect(() => {
    const stored =
      sessionStorage.getItem("generatedProduct") ||
      sessionStorage.getItem("productToPublish");

    if (stored) {
      try {
        setSessionProduct(JSON.parse(stored));
      } catch {
        setSessionProduct(null);
      }
    }
  }, []);

  const product = productProp ?? sessionProduct;

  if (!product) {
    return (
      <div className="text-center max-w-sm">
        <div className="mb-6">
          <svg
            className="h-24 w-24 text-slate-600 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Preview will appear here
        </h3>
        <p className="text-slate-400 text-sm">
          Generate a product to see a live preview of the listing.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* use product fields here */}
    </div>
  );
}
