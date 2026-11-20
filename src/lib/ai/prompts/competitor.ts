export function buildCompetitorPrompt(targetUrl: string) {
  return `Analyze the competitor product page at ${targetUrl} and return a JSON summary with keys: price, rating, reviewCount, summary.`;
}
