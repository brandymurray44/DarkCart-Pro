import { shopifyAuthSchema } from "@/lib/validators";

const SHOPIFY_API_VERSION = "2024-10";

export function buildShopifyAuthUrl(shop: string, state: string): string {
  const scopes = encodeURIComponent(
    process.env.SHOPIFY_SCOPES ??
      "read_products,write_products,read_orders,read_customers"
  );
  const redirectUri = encodeURIComponent(
    process.env.SHOPIFY_REDIRECT_URI ??
      "http://localhost:3000/api/shopify/callback"
  );
  const clientId = process.env.SHOPIFY_API_KEY;

  if (!clientId) {
    throw new Error("Missing SHOPIFY_API_KEY");
  }

  return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
}

export function validateShopifyShop(shop: string) {
  shopifyAuthSchema.parse({ shop });
  return shop;
}

export async function createShopifyProduct(shopDomain: string, accessToken: string, product: {
  title: string;
  body_html: string;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
}) {
  const response = await fetch(`https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/products.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({
      product: {
        title: product.title,
        body_html: product.body_html,
        tags: product.tags.join(", "),
        metafields: [
          {
            namespace: "seo",
            key: "seo_title",
            value: product.seo_title ?? "",
            type: "single_line_text_field",
          },
          {
            namespace: "seo",
            key: "seo_description",
            value: product.seo_description ?? "",
            type: "single_line_text_field",
          },
        ],
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Shopify publish failed: ${response.status} ${body}`);
  }

  return response.json();
}
