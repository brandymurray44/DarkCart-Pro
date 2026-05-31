import { AIContentRequest, AIContentResponse } from "@/types/ai";
import { generateAIContent } from "@/lib/ai/engine";

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

function buildProductPrompt(request: ProductCopyRequest) {
  const keywords = request.keywords && request.keywords.length > 0 ? `\nKeywords: ${request.keywords.join(", ")}` : "";

  return `You are a Shopify AI product content specialist.
Generate a high-converting product title, description, tags, SEO title, SEO meta description, and image generation prompts for a Shopify product listing.

Product: ${request.productName}
Niche: ${request.niche}
Target audience: ${request.targetAudience}${keywords}

Output a single JSON object with keys: title, description, tags, seoTitle, seoDescription, imagePrompts.
- title: 1 short product title (max 80 characters)
- description: 3 short paragraphs with benefit-driven copy and product details
- tags: array of 8 relevant tags
- seoTitle: optimized SEO title under 70 characters
- seoDescription: SEO meta description under 155 characters
- imagePrompts: array of 3 image generation prompts for product marketing images

Return only valid JSON, no markdown, no additional explanation.`;
}

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
