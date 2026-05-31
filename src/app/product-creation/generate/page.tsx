"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface GenerateFormData {
  niche: string;
  productType: string;
  style: string;
  targetAudience: string;
}

export default function GenerateScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<GenerateFormData>({
    niche: "",
    productType: "",
    style: "",
    targetAudience: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "openai",
          model: "gpt-4",
          productName: formData.productType,
          niche: formData.niche,
          targetAudience: formData.targetAudience,
          keywords: [formData.style],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate product");
      }

      const json = await response.json();
      
      // Store generated data in sessionStorage for the review screen
      sessionStorage.setItem("generatedProduct", JSON.stringify(json.data));
      
      // Navigate to review screen
      router.push("/product-creation/review");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof GenerateFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Generate Product</h1>
          <p className="text-slate-400">Create an AI-powered product concept for your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Niche
            </label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) => handleInputChange("niche", e.target.value)}
              placeholder="e.g., Home Office, Fitness, Pet Care"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
            <p className="text-xs text-slate-400 mt-2">The market category for your product</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Product Type
            </label>
            <input
              type="text"
              value={formData.productType}
              onChange={(e) => handleInputChange("productType", e.target.value)}
              placeholder="e.g., Ergonomic Chair, Yoga Mat, Dog Bed"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
            <p className="text-xs text-slate-400 mt-2">The specific product you want to create</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Style
            </label>
            <input
              type="text"
              value={formData.style}
              onChange={(e) => handleInputChange("style", e.target.value)}
              placeholder="e.g., Minimalist, Modern, Vintage, Industrial"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition"
              required
            />
            <p className="text-xs text-slate-400 mt-2">The aesthetic style of the product</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Target Audience
            </label>
            <textarea
              value={formData.targetAudience}
              onChange={(e) => handleInputChange("targetAudience", e.target.value)}
              placeholder="e.g., Remote workers aged 25-40 who value comfort and productivity"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition h-24 resize-none"
              required
            />
            <p className="text-xs text-slate-400 mt-2">Who is this product designed for?</p>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              "Generate Product"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-slate-400 hover:text-slate-300 text-sm transition"
          >
            Cancel and return to dashboard
          </button>
        </div>
      </div>
    </main>
  );
}
