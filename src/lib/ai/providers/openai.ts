import OpenAI from "openai";
import { AIContentRequest, AIContentResponse } from "@/types/ai";

export async function generateOpenAI(request: AIContentRequest): Promise<AIContentResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing or empty.");
  }

  const client = new OpenAI({ apiKey });

  const completion = await client.chat.completions.create({
    model: request.model,
    messages: [
      {
        role: "user",
        content: request.prompt,
      },
    ],
    max_tokens: request.maxTokens ?? 512,
    temperature: request.temperature ?? 0.7,
  });

  const text = completion.choices[0]?.message?.content ?? "";

  return {
    text,
    raw: completion,
  };
}
