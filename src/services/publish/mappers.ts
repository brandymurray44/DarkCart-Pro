import { ShopifyProductPayload } from "./shopifyClient";

export interface AiProductInput {
  title: string;
  description: string;
  bullets?: string[];
  tags?: string[];
  price: number;
  compareAtPrice?: number;
  images?: Array<{ url: string; alt?: string }>;
  variants?: Array<{
    optionName: string;
    values: string[];
  }>;
  niche?: string;
  publishMode?: "draft" | "active";
  vendor?: string;
}

/**
 * Map AI-generated product to Shopify product format
 */
export function mapAiProductToShopifyProduct(
  input: AiProductInput
): ShopifyProductPayload {
  // Build body_html from description and bullets
  let bodyHtml = `<p>${escapeHtml(input.description)}</p>`;

  if (input.bullets && input.bullets.length > 0) {
    bodyHtml += "<ul>";
    for (const bullet of input.bullets) {
      bodyHtml += `<li>${escapeHtml(bullet)}</li>`;
    }
    bodyHtml += "</ul>";
  }

  // Map images
  const images = input.images
    ? input.images.map((img) => ({
        src: img.url,
        alt: img.alt || input.title,
      }))
    : undefined;

  // Build default variant (required by Shopify)
  const defaultVariant = {
    title: "Default",
    price: input.price.toFixed(2),
    ...(input.compareAtPrice && {
      compare_at_price: input.compareAtPrice.toFixed(2),
    }),
  };

  // If custom variants provided, use them; otherwise use default
  let variants: ShopifyProductPayload["product"]["variants"];

  if (input.variants && input.variants.length > 0) {
    // Generate variant combinations
    variants = generateVariantCombinations(
      input.variants,
      input.price,
      input.compareAtPrice
    );
  } else {
    variants = [defaultVariant];
  }

  return {
    product: {
      title: input.title,
      body_html: bodyHtml,
      product_type: input.niche || "AI Generated",
      tags: input.tags ? input.tags.join(", ") : "",
      status: input.publishMode || "draft",
      vendor: input.vendor,
      images,
      variants,
    },
  };
}

/**
 * Generate all combinations of variants
 * Example: sizes [S, M] × colors [Red, Blue] = 4 variants
 */
function generateVariantCombinations(
  variantSpecs: Array<{ optionName: string; values: string[] }>,
  price: number,
  compareAtPrice?: number
): ShopifyProductPayload["product"]["variants"] {
  if (variantSpecs.length === 0) {
    return [
      {
        title: "Default",
        price: price.toFixed(2),
        ...(compareAtPrice && { compare_at_price: compareAtPrice.toFixed(2) }),
      },
    ];
  }

  const combinations: ShopifyProductPayload["product"]["variants"] = [];

  function cartesian(
    specs: typeof variantSpecs,
    index: number,
    current: string[]
  ): void {
    if (index === specs.length) {
      const title = current.join(" / ");
      combinations!.push({
        title,
        price: price.toFixed(2),
        ...(compareAtPrice && {
          compare_at_price: compareAtPrice.toFixed(2),
        }),
      });
      return;
    }

    for (const value of specs[index].values) {
      cartesian(specs, index + 1, [...current, value]);
    }
  }

  cartesian(variantSpecs, 0, []);
  return combinations;
}

/**
 * Escape HTML entities in text for safe display
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
