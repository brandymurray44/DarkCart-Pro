import { AIContentRequest, AIContentResponse } from "@/types/ai";
import { generateAIContent } from "@/lib/ai/engine";
import { buildProductPrompt } from "@/lib/ai/prompts/product";

export interface ProductCopyRequest {
  provider: AIContentRequest["provider"];
  model: string;
  productName: string;
  niche: string;
  targetAudience: string;
  keywords?: string[];
}

export interface ProductCopyResponse {
  title: string;
  description: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  imagePrompts: string[];
  raw: unknown;
}

// product prompt builder moved to prompts/product.ts

function parseJSONOutput(rawText: string): unknown {
  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Unable to parse AI JSON output");
  }
  return JSON.parse(match[0]);
}

export async function generateProductCopy(request: ProductCopyRequest): Promise<ProductCopyResponse> {
  const aiRequest: AIContentRequest = {
    provider: request.provider,
    model: request.model,
    prompt: buildProductPrompt(request),
    maxTokens: 700,
    temperature: 0.7,
  };

  const result = await generateAIContent(aiRequest);
  const payload = parseJSONOutput(result.text || String(result.raw));

  return {
    title: String((payload as any).title ?? ""),
    description: String((payload as any).description ?? ""),
    tags: Array.isArray((payload as any).tags) ? (payload as any).tags.map(String) : [],
    seoTitle: String((payload as any).seoTitle ?? ""),
    seoDescription: String((payload as any).seoDescription ?? ""),
    imagePrompts: Array.isArray((payload as any).imagePrompts) ? (payload as any).imagePrompts.map(String) : [],
    raw: result.raw,
  };
}
