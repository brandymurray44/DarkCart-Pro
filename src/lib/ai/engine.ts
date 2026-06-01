import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { AIContentRequest, AIContentResponse } from "@/types/ai";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateOpenAI(request: AIContentRequest): Promise<AIContentResponse> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });

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

async function generateAnthropic(request: AIContentRequest): Promise<AIContentResponse> {
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

async function generateLMStudio(request: AIContentRequest): Promise<AIContentResponse> {
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

export async function generateAIContent(request: AIContentRequest): Promise<AIContentResponse> {
  switch (request.provider) {
    case "openai":
      return generateOpenAI(request);
    case "anthropic":
      return generateAnthropic(request);
    case "lmstudio":
      return generateLMStudio(request);
    default:
      throw new Error(`Unsupported AI provider: ${request.provider}`);
  }
}
