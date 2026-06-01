import { AIContentRequest, AIContentResponse } from "@/types/ai";

export async function generateLMStudio(request: AIContentRequest): Promise<AIContentResponse> {
  const endpoint = process.env.LMSTUDIO_URL ?? "http://localhost:8080/v1/generate";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: request.model,
      prompt: request.prompt,
      max_tokens: request.maxTokens ?? 512,
      temperature: request.temperature ?? 0.7,
    }),
  });

  const json = await response.json();
  return {
    text: String(json.output ?? json.text ?? ""),
    raw: json,
  };
}
