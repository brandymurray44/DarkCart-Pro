export interface TrendInsightRequest {
  title: string;
  source: string;
  score: number;
  velocity?: number;
  saturation?: number;
  niche: string;
}

export function buildTrendInsightPrompt(request: TrendInsightRequest): string {
  return `You are a trend analyst for a Shopify dropshipping platform. Analyze the following trend and provide a concise insight summary (2-3 sentences) for a merchant.

Trend: "${request.title}"
Source: ${request.source}
Niche: ${request.niche}
Trend Score: ${request.score}/100
Velocity: ${request.velocity !== undefined ? `${request.velocity > 0 ? "+" : ""}${request.velocity.toFixed(0)}%` : "unknown"}
Market Saturation: ${request.saturation !== undefined ? `${request.saturation.toFixed(0)}%` : "unknown"}

Return a JSON object with this structure:
{
  "insight": "2-3 sentence insight text",
  "action": "one-word action: Buy | Wait | Monitor | Differentiate",
  "opportunity": "one-line opportunity note"
}

Rules:
- Keep insight under 120 characters
- action must be one of: Buy, Wait, Monitor, Differentiate
- Be specific and actionable, not generic
`;
}
