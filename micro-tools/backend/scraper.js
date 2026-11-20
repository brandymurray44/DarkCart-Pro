import * as cheerio from "cheerio";
import axios from "axios";
import pLimit from "p-limit";

const limit = pLimit(5);

// Theme detection patterns
const THEME_PATTERNS = {
  "Dawn": [".grid-product__content", ".product-card"],
  "Debut": [".product-grid-item", ".product-card"],
  "Brooklyn": [".product-item", ".collection-product-card"],
  "Narrative": [".product-block", ".grid-product__content"],
  "Warehouse": [".product-card", ".product-item"],
  "default": [".grid-product__content", ".product-grid-item", ".product-card", ".product-item", ".collection-product-card", ".product-block"]
};

function detectTheme(html) {
  const $ = cheerio.load(html);

  for (const [theme, selectors] of Object.entries(THEME_PATTERNS)) {
    if (theme === "default") continue;

    for (const selector of selectors) {
      if ($(selector).length > 0) {
        return theme;
      }
    }
  }

  return "default";
}

export async function scrapeStore(html, baseUrl) {
  const $ = cheerio.load(html);
  const theme = detectTheme(html);
  const products = [];

  // Use theme-specific selectors or fall back to defaults
  const selectors = THEME_PATTERNS[theme] || THEME_PATTERNS["default"];

  selectors.forEach((selector) => {
    $(selector).each((i, el) => {
      const title =
        $(el).find(".grid-product__title").text().trim() ||
        $(el).find(".product-card__title").text().trim() ||
        $(el).find(".product-item__title").text().trim() ||
        $(el).find("h2").text().trim() ||
        $(el).find(".product-title").text().trim() ||
        $(el).find("a[href*='/products/']").first().text().trim();

      const price =
        $(el).find(".grid-product__price").text().trim() ||
        $(el).find(".product-card__price").text().trim() ||
        $(el).find(".product-item__price").text().trim() ||
        $(el).find(".price").text().trim() ||
        $(el).find("[data-price]").attr("data-price") ||
        $(el).find(".money").text().trim();

      const image =
        $(el).find("img").attr("src") ||
        $(el).find("img").attr("data-src") ||
        $(el).find("img").attr("data-image") ||
        $(el).find("img").attr("data-lazy-src");

      // Extract variants with multiple fallback selectors
      const variants = [];
      const variantSelectors = [
        ".product-variant",
        ".variant-select",
        "select[name*='id'] option",
        ".product-option",
        "[data-option-selectors] option"
      ];

      variantSelectors.forEach(vSelector => {
        $(el).find(vSelector).each((i, variantEl) => {
          const variantTitle = $(variantEl).text().trim();
          const variantPrice = $(variantEl).attr("data-price") ||
                              $(variantEl).find(".price").text().trim() ||
                              $(variantEl).attr("data-variant-price");
          if (variantTitle && !variants.some(v => v.title === variantTitle)) {
            variants.push({ title: variantTitle, price: variantPrice });
          }
        });
      });

      if (title) {
        products.push({ title, price, image, variants, theme });
      }
    });
  });

  return { products, theme };
}

export async function followPagination(url, axiosInstance) {
  const pages = [];
  let nextUrl = url;

  while (nextUrl) {
    try {
      const res = await limit(() => axiosInstance.get(nextUrl));
      pages.push(res.data);

      const $ = cheerio.load(res.data);
      const nextLink =
        $("a[rel='next']").attr("href") ||
        $(".pagination__next").attr("href") ||
        $(".next").attr("href") ||
        $("a:contains('Next')").attr("href");

      if (nextLink) {
        nextUrl = nextLink.startsWith("http")
          ? nextLink
          : url.split("/collections")[0] + nextLink;
      } else {
        nextUrl = null;
      }
    } catch (error) {
      console.error("Pagination error:", error);
      break;
    }
  }

  return pages;
}

export async function scanCollection(url, axiosInstance) {
  const pages = await followPagination(url, axiosInstance);
  const allProducts = [];

  pages.forEach((pageHtml) => {
    const { products } = scrapeStore(pageHtml, url);
    allProducts.push(...products);
  });

  return { products: allProducts };
}