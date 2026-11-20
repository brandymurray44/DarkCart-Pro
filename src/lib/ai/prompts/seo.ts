export function buildSEOPrompt(_title: string, _description: string) {
  return `Generate an SEO-friendly title and meta description for the following product.

Title: ${_title}
Description: ${_description}

Return JSON with keys: seoTitle, seoDescription.`;
}
