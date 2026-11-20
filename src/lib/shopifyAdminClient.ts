import { createHmac } from "crypto";

const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2026-04";

export interface ShopifyAdminClientOptions {
  shopDomain: string;
  accessToken: string;
}

export class ShopifyAdminClient {
  private shopDomain: string;
  private accessToken: string;

  constructor(options: ShopifyAdminClientOptions) {
    this.shopDomain = options.shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");
    this.accessToken = options.accessToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `https://${this.shopDomain}/admin/api/${SHOPIFY_API_VERSION}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "X-Shopify-Access-Token": this.accessToken,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Shopify API error (${response.status}): ${errorBody}`
      );
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string): Promise<void> {
    await this.request(endpoint, { method: "DELETE" });
  }

  // Product operations
  async createProduct(product: {
    title: string;
    body_html?: string;
    tags?: string[];
    seo_title?: string;
    seo_description?: string;
    status?: "active" | "draft" | "archived";
    product_type?: string;
    vendor?: string;
  }) {
    const productData: Record<string, Record<string, unknown>> = {
      product: {
        title: product.title,
        status: product.status || "draft",
      },
    };

    if (product.body_html) productData.product.body_html = product.body_html;
    if (product.tags) productData.product.tags = product.tags.join(", ");
    if (product.product_type) productData.product.product_type = product.product_type;
    if (product.vendor) productData.product.vendor = product.vendor;

    // Add SEO metafields
    if (product.seo_title || product.seo_description) {
      productData.product.metafields = [
        {
          namespace: "global",
          key: "seo_title",
          value: product.seo_title || "",
          type: "single_line_text_field",
        },
        {
          namespace: "global",
          key: "seo_description",
          value: product.seo_description || "",
          type: "single_line_text_field",
        },
      ];
    }

    return this.post("/products.json", productData);
  }

  async updateProduct(
    productId: string,
    updates: {
      title?: string;
      body_html?: string;
      tags?: string[];
      seo_title?: string;
      seo_description?: string;
      status?: "active" | "draft" | "archived";
    }
  ) {
    const productData: Record<string, Record<string, unknown>> = {
      product: {},
    };

    if (updates.title) productData.product.title = updates.title;
    if (updates.body_html) productData.product.body_html = updates.body_html;
    if (updates.tags) productData.product.tags = updates.tags.join(", ");
    if (updates.status) productData.product.status = updates.status;

    if (updates.seo_title !== undefined || updates.seo_description !== undefined) {
      productData.product.metafields = [
        {
          namespace: "global",
          key: "seo_title",
          value: updates.seo_title || "",
          type: "single_line_text_field",
        },
        {
          namespace: "global",
          key: "seo_description",
          value: updates.seo_description || "",
          type: "single_line_text_field",
        },
      ];
    }

    return this.put(`/products/${productId}.json`, productData);
  }

  async getProduct(productId: string) {
    return this.get(`/products/${productId}.json`);
  }

  async listProducts(params?: {
    limit?: number;
    page_info?: string;
    since_id?: number;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set("limit", params.limit.toString());
    if (params?.page_info) queryParams.set("page_info", params.page_info);
    if (params?.since_id) queryParams.set("since_id", params.since_id.toString());

    const query = queryParams.toString();
    return this.get(`/products.json${query ? `?${query}` : ""}`);
  }

  async getProductCount() {
    return this.get<{ count: number }>("/products/count.json");
  }

  // Shop operations
  async getShopInfo() {
    return this.get("/shop.json");
  }
}

export function createShopifyAdminClient(
  shopDomain: string,
  accessToken: string
): ShopifyAdminClient {
  return new ShopifyAdminClient({ shopDomain, accessToken });
}