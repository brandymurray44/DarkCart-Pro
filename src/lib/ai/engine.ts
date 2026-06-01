import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { AIContentRequest, AIContentResponse } from "@/types/ai";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function generateOpenAI(request: AIContentRequest): Promise<AIContentResponse> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  import { AIContentRequest, AIContentResponse } from "@/types/ai";
  import { generateOpenAI } from "./providers/openai";
  import { generateAnthropic } from "./providers/anthropic";
  import { generateLMStudio } from "./providers/lmstudio";

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
    text,
