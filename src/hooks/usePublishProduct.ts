import { useState } from "react";

interface PublishProductRequest {
  title: string;
  description: string;
  bullets?: string[];
  tags?: string[];
  price: number;
  compareAtPrice?: number;
  images?: Array<{ url: string; alt?: string }>;
  variants?: Array<{ optionName: string; values: string[] }>;
  niche?: string;
  publishMode?: "draft" | "active";
  vendor?: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface PublishedProduct {
  id: string;
  title: string;
  shopifyUrl?: string;
}

interface UsePublishProductReturn {
  publish: (data: PublishProductRequest) => Promise<PublishedProduct | null>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function usePublishProduct(): UsePublishProductReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const publish = async (data: PublishProductRequest): Promise<PublishedProduct | null> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/publish/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await response.json();

      if (response.ok && json.success) {
        setSuccess(true);
        return json.product as PublishedProduct;
      } else {
        throw new Error(json.error || "Failed to publish product");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { publish, loading, error, success };
}
