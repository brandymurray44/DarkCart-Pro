export type AIProvider = "openai" | "anthropic" | "lmstudio";

export interface AIContentRequest {
  prompt: string;
  provider: AIProvider;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIContentResponse {
  text: string;
  raw: unknown;
}
