import { NextResponse } from "next/server";
import { z } from "zod";

const aiGenerateSchema = z.object({
  provider: z.enum(["openai", "anthropic", "lmstudio"]),
  model: z.string().min(1),
  productName: z.string().min(3),
  niche: z.string().min(3),
  targetAudience: z.string().min(3),
  keywords: z.array(z.string()).optional(),
});

function generateMockContent(productName: string, niche: string) {
  return {
    title: `${productName} - Premium ${niche} Solution`,
    description: `Discover the perfect ${productName} designed for modern ${niche} enthusiasts. This premium solution combines sleek design with functional excellence.\n\nElevate your workspace with features that matter. Engineered for comfort and style, this product transforms how you work and create.\n\nJoin thousands of satisfied customers who trust this brand for quality, durability, and unmatched value. Order today and experience the difference.`,
    tags: [
      niche,
      "premium",
      "quality",
      "home",
      "lifestyle",
      "productivity",
      "ergonomic",
      "modern",
    ],
    seoTitle: `${productName} | Premium ${niche} Products`,
    seoDescription: `Shop premium ${productName} perfect for ${niche}. High-quality, affordable pricing. Free shipping on orders over $50.`,
    imagePrompts: [
      `Professional product photography of ${productName}, clean white background, dramatic studio lighting, lifestyle setting`,
      `Flat lay styling of ${productName} with complementary accessories, minimalist aesthetic, top-down angle`,
      `${productName} in use scenario, modern workspace, natural lighting, professional product photography`,
    ],
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = aiGenerateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const mockContent = generateMockContent(parsed.data.productName, parsed.data.niche);
  return NextResponse.json({ data: mockContent });
}
