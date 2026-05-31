import { createHmac } from "crypto";

const SHOPIFY_API_VERSION = "2024-10";

export interface ShopifyTokenResponse {
  access_token: string;
  scope: string;
  expires_in?: number;
}

export interface ShopMetadata {
  name: string;
  domain: string;
  plan: string;
  currency: string;
  timezone: string;
  email: string;
  phone?: string;
}

/**
 * Validate HMAC signature from Shopify callback
 * Shopify signs the request with X-Shopify-Hmac-SHA256 header
 */
export function validateShopifyHmac(
  query: Record<string, string>,
  hmacHeader: string
): boolean {
  if (!process.env.SHOPIFY_API_SECRET) {
    throw new Error("Missing SHOPIFY_API_SECRET");
  }

  // Create a copy of query params excluding hmac
  const params = new URLSearchParams();

  // Sort and encode params (Shopify does this for HMAC verification)
  Object.keys(query)
    .sort()
    .forEach((key) => {
      if (key !== "hmac") {
        params.append(key, query[key]);
      }
    });

  // Create HMAC-SHA256
  const encodedParams = params.toString();
  const hmac = createHmac("sha256", process.env.SHOPIFY_API_SECRET);
  hmac.update(encodedParams, "utf8");
  const calculatedHmac = hmac.digest("base64");

  // Timing-safe comparison
  return constantTimeCompare(calculatedHmac, hmacHeader);
}

/**
 * Timing-safe string comparison to prevent timing attacks
 */
function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

/**
 * Exchange authorization code for offline access token
 */
export async function exchangeCodeForToken(
  shop: string,
  code: string
): Promise<ShopifyTokenResponse> {
  if (!process.env.SHOPIFY_API_KEY || !process.env.SHOPIFY_API_SECRET) {
    throw new Error("Missing Shopify API credentials");
  }

  const tokenUrl = `https://${shop}/admin/oauth/access_token`;

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${errorBody}`);
  }

  const data = (await response.json()) as ShopifyTokenResponse;

  if (!data.access_token) {
    throw new Error("No access token in response");
  }

  return data;
}

/**
 * Fetch shop metadata using Admin API
 */
export async function fetchShopMetadata(
  shop: string,
  accessToken: string
): Promise<ShopMetadata> {
  const response = await fetch(
    `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/shop.json`,
    {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch shop metadata: ${response.status}`);
  }

  const data = (await response.json()) as {
    shop?: {
      id?: string;
      name?: string;
      email?: string;
      phone?: string;
      primary_domain?: { host?: string };
      myshopify_domain?: string;
      plan_display_name?: string;
      currency?: string;
      timezone?: string;
    };
  };

  if (!data.shop) {
    throw new Error("No shop data in response");
  }

  const shopData = data.shop;

  return {
    name: shopData.name || "Unknown",
    domain: shopData.myshopify_domain || shop,
    plan: shopData.plan_display_name || "standard",
    currency: shopData.currency || "USD",
    timezone: shopData.timezone || "UTC",
    email: shopData.email || "",
    phone: shopData.phone,
  };
}

/**
 * Get shop product count (lightweight metadata)
 */
export async function getShopProductCount(
  shop: string,
  accessToken: string
): Promise<number> {
  try {
    const response = await fetch(
      `https://${shop}/admin/api/${SHOPIFY_API_VERSION}/products/count.json`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as { count?: number };
    return data.count || 0;
  } catch {
    return 0;
  }
}
