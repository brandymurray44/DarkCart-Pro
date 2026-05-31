import * as cheerio from "cheerio";

export interface CheerioWrapper {
  $: cheerio.CheerioAPI;
  html: string;
}

export async function parseHTML(html: string): Promise<CheerioWrapper> {
  const $ = cheerio.load(html);
  return { $, html };
}

export async function fetchAndParse(url: string, headers?: Record<string, string>): Promise<CheerioWrapper> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    return parseHTML(html);
  } catch (error) {
    throw new Error(
      `Failed to fetch and parse ${url}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
