import {
  shopifyAuthSchema,
  shopifyPublishSchema,
  trendRequestSchema,
} from "@/lib/validators";

describe("shopifyAuthSchema", () => {
  it("accepts valid shop domain", () => {
    const result = shopifyAuthSchema.safeParse({ shop: "my-store.myshopify.com" });
    expect(result.success).toBe(true);
  });

  it("accepts shop with numbers", () => {
    const result = shopifyAuthSchema.safeParse({ shop: "store123.myshopify.com" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid domain format", () => {
    const result = shopifyAuthSchema.safeParse({ shop: "invalid-domain.com" });
    expect(result.success).toBe(false);
  });

  it("rejects uppercase characters", () => {
    const result = shopifyAuthSchema.safeParse({ shop: "My-Store.myshopify.com" });
    expect(result.success).toBe(false);
  });

  it("rejects empty string", () => {
    const result = shopifyAuthSchema.safeParse({ shop: "" });
    expect(result.success).toBe(false);
  });

  it("rejects missing shop field", () => {
    const result = shopifyAuthSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects special characters in subdomain", () => {
    const result = shopifyAuthSchema.safeParse({ shop: "my_store.myshopify.com" });
    expect(result.success).toBe(false);
  });
});

describe("shopifyPublishSchema", () => {
  const validInput = {
    shopDomain: "my-store.myshopify.com",
    title: "Test Product",
    description: "This is a valid product description that is long enough.",
    tags: ["tag1", "tag2"],
  };

  it("accepts valid input", () => {
    const result = shopifyPublishSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it("accepts with optional seoTitle and seoDescription", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      seoTitle: "SEO Title",
      seoDescription: "SEO Description for the product",
    });
    expect(result.success).toBe(true);
  });

  it("rejects title shorter than 3 characters", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      title: "AB",
    });
    expect(result.success).toBe(false);
  });

  it("rejects description shorter than 20 characters", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      description: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 20 tags", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      tags: Array.from({ length: 21 }, (_, i) => `tag${i}`),
    });
    expect(result.success).toBe(false);
  });

  it("rejects seoTitle longer than 70 characters", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      seoTitle: "x".repeat(71),
    });
    expect(result.success).toBe(false);
  });

  it("rejects seoDescription longer than 320 characters", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      seoDescription: "x".repeat(321),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid shop domain", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      shopDomain: "not-a-shopify-domain.com",
    });
    expect(result.success).toBe(false);
  });

  it("accepts with optional aiPrompt", () => {
    const result = shopifyPublishSchema.safeParse({
      ...validInput,
      aiPrompt: "Generate a trendy product",
    });
    expect(result.success).toBe(true);
  });
});

describe("trendRequestSchema", () => {
  it("accepts valid niche and source", () => {
    const result = trendRequestSchema.safeParse({
      niche: "fashion",
      source: "tiktok",
    });
    expect(result.success).toBe(true);
  });

  it("accepts empty object (all optional)", () => {
    const result = trendRequestSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts all valid source types", () => {
    const sources = ["tiktok", "amazon", "google", "etsy", "reddit"];
    for (const source of sources) {
      const result = trendRequestSchema.safeParse({ source });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid source", () => {
    const result = trendRequestSchema.safeParse({ source: "invalid" });
    expect(result.success).toBe(false);
  });

  it("rejects niche shorter than 2 characters", () => {
    const result = trendRequestSchema.safeParse({ niche: "x" });
    expect(result.success).toBe(false);
  });

  it("accepts niche of exactly 2 characters", () => {
    const result = trendRequestSchema.safeParse({ niche: "ab" });
    expect(result.success).toBe(true);
  });
});
