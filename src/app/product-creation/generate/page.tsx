"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GenerateForm } from "@/components/product-creation/GenerateForm";
import { LivePreviewCard } from "@/components/product-creation/LivePreviewCard";
import { useGenerateProduct } from "@/hooks/useGenerateProduct";

export default function GenerateScreen() {
  const router = useRouter();
  const { generate, loading, error } = useGenerateProduct();
  const [prefill, setPrefill] = useState<{
    niche?: string;
    productType?: string;
    source?: string;
    trendTitle?: string;
    score?: number;
  } | null>(null);

  useEffect(() => {
    const trendData = sessionStorage.getItem("trendForGenerator");
    if (trendData) {
      try {
        setPrefill(JSON.parse(trendData));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  const handleSubmit = async (data: { niche: string; productType: string; style: string; targetAudience: string }) => {
    const result = await generate({
      provider: "openai",
      model: "gpt-4",
      productName: data.productType,
      niche: data.niche,
      targetAudience: data.targetAudience,
      keywords: [data.style],
    });

    if (result) {
      sessionStorage.setItem("generatedProduct", JSON.stringify(result));
      router.push("/product-creation/review");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Generate Product</h1>
          <p className="text-slate-400">Create an AI-powered product concept for your store</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="max-w-md">
            <GenerateForm onSubmit={handleSubmit} loading={loading} error={error} prefill={prefill || undefined} />
          </div>

          <div className="flex items-center justify-center">
            {loading ? (
              <div className="text-center">
                <svg className="animate-spin h-16 w-16 text-indigo-500 mx-auto mb-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-slate-400">Generating your product...</p>
              </div>
            ) : (
              <LivePreviewCard />
            )}
          </div>
        </div>

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
