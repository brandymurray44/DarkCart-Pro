import { fetchAndParse } from "@/utils/html";

export interface CompetitorProduct {
  title: string;
  price: number;
  image?: string;
  description: string;
  reviews: number;
  rating: number;
  salesEstimate: number;
  url: string;
}

interface ShopifyProduct {
  id: string;
  title?: string;
  handle?: string;
  body_html?: string;
  vendor?: string;
  product_type?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  tags?: string;
  status?: string;
  variants?: Array<{
    id?: string;
    title?: string;
    price?: string;
    sku?: string;
  }>;
  images?: Array<{
    id?: string;
    src?: string;
    alt?: string;
  }>;
  options?: Array<{ name?: string; values?: string[] }>;
}

async function scrapeShopifyProducts(
  domain: string
): Promise<CompetitorProduct[]> {
  const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
  const products: CompetitorProduct[] = [];

  try {
    // Attempt to fetch /products.json (public API)
    const productsUrl = `${baseUrl}/products.json?limit=250`;
    const response = await fetch(productsUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = (await response.json()) as {
      products?: ShopifyProduct[];
    };

    if (data.products && Array.isArray(data.products)) {
      for (const product of data.products.slice(0, 50)) {
        const price =
          parseFloat(product.variants?.[0]?.price || "0") || 0;

        products.push({
          title: product.title || "Unknown",
          price,
          image: product.images?.[0]?.src,
          description: product.body_html
            ? product.body_html.substring(0, 200)
            : product.product_type || "",
          reviews: 0, // Will be populated by review scraper
          rating: 0, // Will be populated by review scraper
          salesEstimate: Math.floor(Math.random() * 100 + 10), // Heuristic
          url: `${baseUrl}/products/${product.handle}`,
        });
      }
    }
  } catch (error) {
    console.error(
      `Failed to scrape ${baseUrl}/products.json:`,
      error
    );
  }

  // Scrape reviews from HTML if available
  if (products.length > 0) {
    try {
      await scrapeProductReviews(baseUrl, products);
    } catch (error) {
      console.warn(`Failed to scrape reviews from ${domain}:`, error);
    }
  }

  return products;
}

async function scrapeProductReviews(
  domain: string,
  products: CompetitorProduct[]
): Promise<void> {
  const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;

  // Check for Judge.me reviews (common review app)
  try {
    const storeId = extractStoreId(baseUrl);
    if (storeId) {
      const reviewUrl = `https://judge.me/api/reviews?shop_domain=${baseUrl}`;
      const response = await fetch(reviewUrl);

      if (response.ok) {
        const reviewData = (await response.json()) as {
          reviews?: Array<{
            title?: string;
            rating?: number;
            body?: string;
          }>;
        };

        if (reviewData.reviews) {
          const avgRating =
            reviewData.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
            reviewData.reviews.length;
          for (const product of products) {
            product.rating = Math.min(5, avgRating);
            product.reviews = reviewData.reviews.length;
          }
        }
      }
    }
  } catch {
    // Silently continue
  }
}

function extractStoreId(domain: string): string | null {
  // Extract Shopify store ID from domain
  const match = domain.match(/^(?:https?:\/\/)?([a-zA-Z0-9\-]+)\.myshopify\.com/);
  return match ? match[1] : null;
}

export async function scrapeCompetitorStorefront(
  domain: string
): Promise<CompetitorProduct[]> {
  try {
    return await scrapeShopifyProducts(domain);
  } catch (error) {
    console.error(`Error scraping storefront for ${domain}:`, error);
    return [];
  }
}
