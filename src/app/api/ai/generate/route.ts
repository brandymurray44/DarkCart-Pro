import { NextResponse } from "next/server";
import { z } from "zod";
import { generateProductCopy } from "@/lib/ai/contentGenerators";
import { validateBody, apiErrorResponse } from "@/lib/api/apiUtils";

const aiGenerateSchema = z.object({
  provider: z.enum(["openai", "anthropic", "lmstudio"]),
  model: z.string().min(1),
  productName: z.string().min(3),
  niche: z.string().min(3),
  targetAudience: z.string().min(3),
  keywords: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const validation = await validateBody(request, aiGenerateSchema);
  if (validation.response) return validation.response;

  try {
    const generatedContent = await generateProductCopy(validation.data);
    return NextResponse.json({ data: generatedContent }, { status: 200 });
  } catch (error) {
    console.error("[AI] generate route error:", error);
    return apiErrorResponse(
      error,
      "AI generation failed. Check provider configuration."
    );
  }
}
