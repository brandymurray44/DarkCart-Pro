"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PublishStatus } from "@/components/product-creation/PublishStatus";
import { usePublishProduct } from "@/hooks/usePublishProduct";

interface ProductToPublish {
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

export default function PublishPage() {
  const router = useRouter();
  const [product, setProduct] = useState<ProductToPublish | null>(null);
  const [loading, setLoading] = useState(true);
  const { publish, loading: publishing, error, success } = usePublishProduct();

  useEffect(() => {
    const stored = sessionStorage.getItem("productToPublish");
    if (stored) {
      setProduct(JSON.parse(stored));
    } else {
      router.push("/create");
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (product && !loading) {
      publish({
        title: product.title,
        description: product.description,
        bullets: product.bullets,
        tags: product.tags,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: product.images,
        variants: product.variants,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        publishMode: "draft",
      });
    }
  }, [product, loading, publish]);

  const handleRetry = () => {
    if (product) {
      publish({
        title: product.title,
        description: product.description,
        bullets: product.bullets,
        tags: product.tags,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        images: product.images,
        variants: product.variants,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        publishMode: "draft",
      });
    }
  };

  const handleBack = () => {
    router.push("/create/review");
  };

  const handleViewDashboard = () => {
    sessionStorage.removeItem("generatedProduct");
    sessionStorage.removeItem("productToPublish");
    router.push("/dashboard");
  };

  const handleCreateAnother = () => {
    sessionStorage.removeItem("generatedProduct");
    sessionStorage.removeItem("productToPublish");
    router.push("/create");
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Publishing Product…</h1>
          <p className="text-slate-400">Your product is being published to Shopify</p>
        </div>

        <PublishStatus
          status={publishing ? "loading" : success ? "success" : "error"}
          productTitle={product.title}
          shopifyUrl={success ? undefined : undefined}
          errorMessage={error || undefined}
          onRetry={handleRetry}
          onBack={handleBack}
          onViewDashboard={handleViewDashboard}
          onCreateAnother={handleCreateAnother}
        />
      </div>
    </main>
  );
}
