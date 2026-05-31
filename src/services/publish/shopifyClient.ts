const SHOPIFY_API_VERSION = "2024-10";

export interface ShopifyProductPayload {
  product: {
    title: string;
    body_html: string;
    product_type: string;
    tags: string;
    status: "draft" | "active";
    vendor?: string;
    images?: Array<{ src: string; alt?: string }>;
    variants?: Array<{
      title: string;
      price: string;
      compare_at_price?: string;
      sku?: string;
      weight?: number;
      weight_unit?: string;
      requires_shipping?: boolean;
    }>;
  };
}

export interface ShopifyCreateProductResponse {
  product: {
    id: number;
    title: string;
    handle: string;
    status: "draft" | "active";
    tags: string;
    created_at: string;
    updated_at: string;
  };
}

export class ShopifyClientError extends Error {
  constructor(
    public status: number,
    public shopDomain: string,
    message: string
  ) {
    super(`[${shopDomain}] ${message}`);
    this.name = "ShopifyClientError";
  }
}

/**
 * Create a product via Shopify Admin API
 */
export async function createShopifyProduct(
  shopDomain: string,
  accessToken: string,
  payload: ShopifyProductPayload
): Promise<ShopifyCreateProductResponse> {
  if (!accessToken) {
    throw new ShopifyClientError(
      400,
      shopDomain,
      "Missing access token"
    );
  }

  const url = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/products.json`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as {
      product?: ShopifyCreateProductResponse["product"];
      errors?: Record<string, unknown>;
    };

    if (!response.ok) {
      const errorMessage =
        typeof data.errors === "object"
          ? JSON.stringify(data.errors)
          : "Product creation failed";

      throw new ShopifyClientError(
        response.status,
        shopDomain,
        `HTTP ${response.status}: ${errorMessage}`
      );
    }

    if (!data.product) {
      throw new ShopifyClientError(
        500,
        shopDomain,
        "No product in response"
      );
    }

    return { product: data.product };
  } catch (error) {
    if (error instanceof ShopifyClientError) {
      throw error;
    }

    throw new ShopifyClientError(
      500,
      shopDomain,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

/**
 * Get a product by Shopify ID
 */
export async function getShopifyProduct(
  shopDomain: string,
  accessToken: string,
  productId: string
): Promise<{ product: { id: number; title: string; handle: string; status: string } }> {
  const url = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}/products/${productId}.json`;

  const response = await fetch(url, {
    headers: {
      "X-Shopify-Access-Token": accessToken,
    },
  });

  if (!response.ok) {
    throw new ShopifyClientError(
      response.status,
      shopDomain,
      `Failed to fetch product: ${response.status}`
    );
  }

  return response.json() as Promise<{ product: { id: number; title: string; handle: string; status: string } }>;
}
