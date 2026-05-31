import { fetchAndParse } from "@/utils/html";

export interface EtsyTrend {
  id: string;
  title: string;
  description: string;
  score: number;
  url: string;
  image?: string;
  timestamp: Date;
}

async function scrapeEtsySearch(query: string): Promise<EtsyTrend[]> {
  try {
    const searchUrl = `https://www.etsy.com/search?q=${encodeURIComponent(query)}&sort=trending`;
    const { $ } = await fetchAndParse(searchUrl);

    const results: EtsyTrend[] = [];

    // Parse Etsy product listings
    $("div[data-listing-id]").each((index, element) => {
      if (results.length >= 8) return false; // Limit to 8 per query

      try {
        const $el = $(element);
        const title = $el
          .find("h3 a")
          .first()
          .text()
          .trim()
          .substring(0, 100);
        const url = $el.find("h3 a").first().attr("href");
        const image = $el.find("img").first().attr("src");
        const priceText = $el.find('[data-price]').text().trim();

        if (!title || !url) return true;

        results.push({
          id: `etsy_${index}_${Date.now()}`,
          title,
          description: `Trending on Etsy: ${priceText || "Price varies"}`,
          score: 70 + Math.floor(Math.random() * 30), // 70-100
          url: url.startsWith("http") ? url : `https://www.etsy.com${url}`,
          image: image || undefined,
          timestamp: new Date(),
        });
      } catch (e) {
        // Silently skip problematic entries
      }

      return true;
    });

    return results;
  } catch (error) {
    console.error(`Error scraping Etsy for "${query}":`, error);
    return [];
  }
}

export async function scrapeEtsy(): Promise<EtsyTrend[]> {
  const queries = [
    "trending",
    "handmade",
    "vintage",
    "home decor",
    "personalized gifts",
  ];
  const allTrends: EtsyTrend[] = [];

  for (const query of queries) {
    const trends = await scrapeEtsySearch(query);
    allTrends.push(...trends);
    // Rate limiting: delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return allTrends;
}
