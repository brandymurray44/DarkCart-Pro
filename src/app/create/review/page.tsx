"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewEditor } from "@/components/product-creation/ReviewEditor";
import LivePreviewCard from "@/components/product-creation/LivePreviewCard";

interface GeneratedProduct {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
}

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

export default function ReviewPage() {
  const router = useRouter();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("generatedProduct");
    if (stored) {
      const data = JSON.parse(stored) as GeneratedProduct;
      setProduct({
        ...data,
        price: 29.99,
        bullets: [
          "Premium quality materials",
          "Sleek modern design",
          "Perfect for your lifestyle",
        ],
        images: [],
        variants: [],
      });
    } else {
      router.push("/create");
    }
    setLoading(false);
  }, [router]);

  const handlePublish = () => {
    if (!product) return;
    sessionStorage.setItem("productToPublish", JSON.stringify(product));
    router.push("/create/publish");
  };

  const handleRegenerate = () => {
    sessionStorage.removeItem("generatedProduct");
    router.push("/create");
  };

  const handleBack = () => {
    router.push("/create");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 flex items-center justify-center">
        <div className="text-slate-400">Loading product data...</div>
      </main>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Review & Edit Product</h1>
            <p className="text-slate-400">Edit your AI-generated product before publishing</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <ReviewEditor
              product={product}
              onChange={setProduct}
              onPublish={handlePublish}
              onRegenerate={handleRegenerate}
              onBack={handleBack}
            />
          </div>

          <div>
            <LivePreviewCard product={product} />
          </div>
        </div>
      </div>
    </main>
  );
}
