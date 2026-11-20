import { useState } from "react";

interface GenerateProductRequest {
  provider: string;
  model: string;
  productName: string;
  niche: string;
  targetAudience: string;
  keywords?: string[];
}

interface GeneratedProduct {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
}

interface UseGenerateProductReturn {
  generate: (data: GenerateProductRequest) => Promise<GeneratedProduct | null>;
  loading: boolean;
  error: string | null;
}

export function useGenerateProduct(): UseGenerateProductReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (data: GenerateProductRequest): Promise<GeneratedProduct | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate product");
      }

      const json = await response.json();
      return json.data as GeneratedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
}
