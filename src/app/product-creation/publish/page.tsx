"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProductToPublish {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
  price: number;
  bullets: string[];
}

type PublishStatus = "idle" | "publishing" | "success" | "error";

export default function PublishScreen() {
  const router = useRouter();
  const [product, setProduct] = useState<ProductToPublish | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [publishMode, setPublishMode] = useState<"draft" | "active">("draft");
  const [error, setError] = useState<string | null>(null);
  const [publishedProduct, setPublishedProduct] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("productToPublish");
    if (stored) {
      setProduct(JSON.parse(stored));
    } else {
      router.push("/product-creation/generate");
    }
    setLoading(false);
  }, [router]);

  const handlePublish = async () => {
    if (!product) return;

    setStatus("publishing");
    setError(null);

    try {
      const response = await fetch("/api/publish/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: product.title,
          description: product.description,
          bullets: product.bullets,
          tags: product.tags,
          price: product.price,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          publishMode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setPublishedProduct(data.product || data);
        
        // Clear session storage
        sessionStorage.removeItem("generatedProduct");
        sessionStorage.removeItem("productToPublish");
      } else {
        setStatus("error");
        setError(data.error || "Failed to publish product");
      }
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  const handleCreateAnother = () => {
    sessionStorage.removeItem("generatedProduct");
    sessionStorage.removeItem("productToPublish");
    router.push("/product-creation/generate");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Publish Product</h1>
          <p className="text-slate-400">Review and publish your product to Shopify</p>
        </div>

        {/* Product Summary */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Product Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Title</p>
              <p className="text-white font-semibold">{product.title}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Price</p>
              <p className="text-white text-2xl font-bold">${product.price.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Description</p>
              <p className="text-slate-300 text-sm line-clamp-3">{product.description}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-indigo-600/30 text-indigo-300 text-xs rounded border border-indigo-600/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Publish Mode Selection */}
        {status === "idle" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Publish Mode</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="radio"
                  value="draft"
                  checked={publishMode === "draft"}
                  onChange={(e) => setPublishMode(e.target.value as "draft" | "active")}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div>
                  <p className="text-white font-semibold">Draft</p>
                  <p className="text-slate-400 text-sm">Save as draft in Shopify (not visible to customers)</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-slate-900/50 border border-slate-600 rounded-lg cursor-pointer hover:border-indigo-500 transition">
                <input
                  type="radio"
                  value="active"
                  checked={publishMode === "active"}
                  onChange={(e) => setPublishMode(e.target.value as "draft" | "active")}
                  className="w-4 h-4 accent-indigo-600"
                />
                <div>
                  <p className="text-white font-semibold">Active</p>
                  <p className="text-slate-400 text-sm">Publish immediately (visible to customers)</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Publishing Status */}
        {status === "publishing" && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="animate-spin h-12 w-12 text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Publishing to Shopify...</h3>
            <p className="text-slate-400">This may take a few moments</p>
          </div>
        )}

        {/* Success State */}
        {status === "success" && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Product Published Successfully!</h3>
            <p className="text-slate-300 mb-6">
              Your product "{product.title}" has been {publishMode === "draft" ? "saved as a draft" : "published"} to Shopify.
            </p>
            {publishedProduct && publishedProduct.id && (
              <p className="text-xs text-slate-400 mb-6">Product ID: {publishedProduct.id}</p>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleGoToDashboard}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleCreateAnother}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
              >
                Create Another Product
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "error" && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Publishing Failed</h3>
            <p className="text-slate-300 text-sm mb-4">{error}</p>
            <div className="flex gap-4">
              <button
                onClick={() => setStatus("idle")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/product-creation/review")}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition"
              >
                Back to Review
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {status === "idle" && (
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/product-creation/review")}
              className="flex-1 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
            >
              Back to Review
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
            >
              Publish to Shopify
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
