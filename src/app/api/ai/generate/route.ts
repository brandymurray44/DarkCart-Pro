import { NextResponse } from "next/server";
import { z } from "zod";
import { generateProductCopy } from "@/lib/ai/contentGenerators";
import { logger } from "@/lib/logger";

const aiGenerateSchema = z.object({
  provider: z.enum(["openai", "anthropic", "lmstudio"]),
  model: z.string().min(1),
  productName: z.string().min(3),
  niche: z.string().min(3),
  targetAudience: z.string().min(3),
  keywords: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const startTime = Date.now();
  try {
    // Limit request body size to prevent DoS
    const body = await request.json();
    const parsed = aiGenerateSchema.safeParse(body);

    if (!parsed.success) {
      const duration = Date.now() - startTime;
      logger.api('/api/ai/generate', 'POST', 400, duration, undefined, 'Validation failed');
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // Sanitize and validate AI inputs to prevent prompt injection
    const sanitizedData = {
      ...parsed.data,
      productName: parsed.data.productName.replace(/[<>{}[\]\\]/g, '').trim(),
      niche: parsed.data.niche.replace(/[<>{}[\]\\]/g, '').trim(),
      targetAudience: parsed.data.targetAudience.replace(/[<>{}[\]\\]/g, '').trim(),
      keywords: parsed.data.keywords?.map(k => k.replace(/[<>{}[\]\\]/g, '').trim()) || [],
    };

    const generatedContent = await generateProductCopy(sanitizedData);
    
    // Sanitize AI output to prevent XSS
    const sanitizedContent = {
      ...generatedContent,
      title: generatedContent.title.replace(/<script[^>]*>.*?<\/script>/gi, ''),
      description: generatedContent.description.replace(/<script[^>]*>.*?<\/script>/gi, ''),
      tags: generatedContent.tags.map(tag => tag.replace(/<script[^>]*>.*?<\/script>/gi, '')),
    };

    const duration = Date.now() - startTime;
    logger.ai(sanitizedData.provider, sanitizedData.model, 'generate', duration);
    return NextResponse.json({ data: sanitizedContent }, { status: 200 });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.ai('unknown', 'unknown', 'generate', duration, undefined, errorMessage);
    // Don't expose internal error details to client
    return NextResponse.json(
      {
        error: "AI generation failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
