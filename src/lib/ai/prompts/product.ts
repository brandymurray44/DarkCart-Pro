import { ProductCopyRequest } from "@/lib/ai/contentGenerators";

export function buildProductPrompt(request: ProductCopyRequest) {
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
