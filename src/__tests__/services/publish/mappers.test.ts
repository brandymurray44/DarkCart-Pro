import {
  mapAiProductToShopifyProduct,
  type AiProductInput,
} from "@/services/publish/mappers";

describe("mapAiProductToShopifyProduct", () => {
  const baseInput: AiProductInput = {
    title: "Test Product",
    description: "A great product for testing",
    price: 29.99,
  };

  it("maps basic product with title, description, and price", () => {
    const result = mapAiProductToShopifyProduct(baseInput);

    expect(result.product.title).toBe("Test Product");
    expect(result.product.body_html).toContain("A great product for testing");
    expect(result.product.variants).toHaveLength(1);
    expect(result.product.variants![0].title).toBe("Default");
    expect(result.product.variants![0].price).toBe("29.99");
  });

  it("escapes HTML entities in description", () => {
    const input: AiProductInput = {
      ...baseInput,
      description: 'Test <script>alert("xss")</script> & more',
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.body_html).not.toContain("<script>");
    expect(result.product.body_html).toContain("&lt;script&gt;");
    expect(result.product.body_html).toContain("&amp;");
  });

  it("includes bullets as HTML list", () => {
    const input: AiProductInput = {
      ...baseInput,
      bullets: ["Feature 1", "Feature 2", "Feature 3"],
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.body_html).toContain("<ul>");
    expect(result.product.body_html).toContain("<li>Feature 1</li>");
    expect(result.product.body_html).toContain("<li>Feature 2</li>");
    expect(result.product.body_html).toContain("<li>Feature 3</li>");
    expect(result.product.body_html).toContain("</ul>");
  });

  it("escapes HTML in bullets", () => {
    const input: AiProductInput = {
      ...baseInput,
      bullets: ['<b>Bold</b> & "quoted"'],
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.body_html).toContain("&lt;b&gt;Bold&lt;/b&gt; &amp; &quot;quoted&quot;");
  });

  it("maps tags as comma-separated string", () => {
    const input: AiProductInput = {
      ...baseInput,
      tags: ["tag1", "tag2", "tag3"],
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.tags).toBe("tag1, tag2, tag3");
  });

  it("uses empty string when no tags", () => {
    const result = mapAiProductToShopifyProduct(baseInput);
    expect(result.product.tags).toBe("");
  });

  it("maps images with alt text", () => {
    const input: AiProductInput = {
      ...baseInput,
      images: [
        { url: "https://example.com/img1.jpg", alt: "Front view" },
        { url: "https://example.com/img2.jpg" },
      ],
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.images).toHaveLength(2);
    expect(result.product.images![0].src).toBe("https://example.com/img1.jpg");
    expect(result.product.images![0].alt).toBe("Front view");
    expect(result.product.images![1].alt).toBe("Test Product"); // defaults to title
  });

  it("includes compare_at_price when provided", () => {
    const input: AiProductInput = {
      ...baseInput,
      compareAtPrice: 49.99,
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.variants![0].compare_at_price).toBe("49.99");
  });

  it("generates variant combinations", () => {
    const input: AiProductInput = {
      ...baseInput,
      variants: [
        { optionName: "Size", values: ["S", "M", "L"] },
        { optionName: "Color", values: ["Red", "Blue"] },
      ],
    };
    const result = mapAiProductToShopifyProduct(input);

    // 3 sizes * 2 colors = 6 variants
    expect(result.product.variants).toHaveLength(6);
    expect(result.product.variants![0].title).toBe("S / Red");
    expect(result.product.variants![1].title).toBe("S / Blue");
    expect(result.product.variants![2].title).toBe("M / Red");
    expect(result.product.variants![5].title).toBe("L / Blue");
  });

  it("uses default variant when variants array is empty", () => {
    const input: AiProductInput = {
      ...baseInput,
      variants: [],
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.variants).toHaveLength(1);
    expect(result.product.variants![0].title).toBe("Default");
  });

  it("sets product_type from niche", () => {
    const input: AiProductInput = {
      ...baseInput,
      niche: "Electronics",
    };
    const result = mapAiProductToShopifyProduct(input);

    expect(result.product.product_type).toBe("Electronics");
  });

  it("defaults product_type to AI Generated", () => {
    const result = mapAiProductToShopifyProduct(baseInput);
    expect(result.product.product_type).toBe("AI Generated");
  });

  it("sets status from publishMode", () => {
    const active: AiProductInput = { ...baseInput, publishMode: "active" };
    const draft: AiProductInput = { ...baseInput, publishMode: "draft" };

    expect(mapAiProductToShopifyProduct(active).product.status).toBe("active");
    expect(mapAiProductToShopifyProduct(draft).product.status).toBe("draft");
  });

  it("defaults status to draft", () => {
    const result = mapAiProductToShopifyProduct(baseInput);
    expect(result.product.status).toBe("draft");
  });

  it("includes vendor when provided", () => {
    const input: AiProductInput = {
      ...baseInput,
      vendor: "TrendPilot",
    };
    const result = mapAiProductToShopifyProduct(input);
    expect(result.product.vendor).toBe("TrendPilot");
  });

  it("all variant prices match input price", () => {
    const input: AiProductInput = {
      ...baseInput,
      price: 19.95,
      variants: [
        { optionName: "Size", values: ["S", "M"] },
      ],
    };
    const result = mapAiProductToShopifyProduct(input);

    for (const variant of result.product.variants!) {
      expect(variant.price).toBe("19.95");
    }
  });
});
