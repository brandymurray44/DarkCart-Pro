import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { generateProductCopy } from "@/lib/ai/contentGenerators";

const aiGenerateSchema = z.object({
  provider: z.enum(["openai", "anthropic", "lmstudio"]),
  model: z.string().min(1),
  productName: z.string().min(3),
  niche: z.string().min(3),
  targetAudience: z.string().min(3),
  keywords: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = aiGenerateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const generatedContent = await generateProductCopy(parsed.data);
    return NextResponse.json({ data: generatedContent }, { status: 200 });
  } catch (error) {
    console.error("[AI] generate route error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "AI generation failed. Check provider configuration.",
      },
      { status: 500 }
    );
  }
}
