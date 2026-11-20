import Anthropic from "@anthropic-ai/sdk";
import { AIContentRequest, AIContentResponse } from "@/types/ai";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateAnthropic(request: AIContentRequest): Promise<AIContentResponse> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is missing or empty.");
  }

  const response = await anthropic.messages.create({
    model: request.model,
    max_tokens: request.maxTokens ?? 512,
    messages: [{ role: "user", content: request.prompt }],
    temperature: request.temperature ?? 0.7,
  });

  const text = response.content[0]?.type === "text" ? response.content[0].text : "";

  return {
    text,
    raw: response,
  };
}
