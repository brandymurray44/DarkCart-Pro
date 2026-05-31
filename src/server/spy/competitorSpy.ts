import * as cheerio from "cheerio";

export interface CompetitorProductData {
  productUrl: string;
  price?: number;
  title?: string;
  rating?: number;
  reviewCount?: number;
  images: string[];
  description?: string;
}

export async function scrapeCompetitorProduct(url: string): Promise<CompetitorProductData> {
  const response = await fetch(url, { headers: { "User-Agent": "TrendPilotBot/1.0" } });

  if (!response.ok) {
    throw new Error(`Failed to fetch competitor page: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const title = $("meta[property='og:title']").attr("content") || $("title").text().trim();
  const description = $("meta[name='description']").attr("content") || $("meta[property='og:description']").attr("content") || "";
  const images = $("img").toArray().map((img) => $(img).attr("src") || "").filter(Boolean);

  const priceText = $("meta[property='product:price:amount']").attr("content") || $("[itemprop='price']").attr("content") || "";
  const price = priceText ? Number(priceText.replace(/[^0-9.]/g, "")) : undefined;

  const ratingText = $("meta[itemprop='ratingValue']").attr("content") || "";
  const rating = ratingText ? Number(ratingText) : undefined;

  const reviewCountText = $("meta[itemprop='reviewCount']").attr("content") || "";
  const reviewCount = reviewCountText ? Number(reviewCountText) : undefined;

  return {
    productUrl: url,
    title: title || undefined,
    description: description || undefined,
    images,
    price,
    rating,
    reviewCount,
  };
}
