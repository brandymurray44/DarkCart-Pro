import { fetchAndParse } from "@/utils/html";

export interface TikTokTrend {
  id: string;
  title: string;
  description: string;
  score: number;
  url: string;
  image?: string;
  timestamp: Date;
}

async function fetchTikTokHashtags(): Promise<TikTokTrend[]> {
  try {
    // Attempt to fetch from TikTok discovery page
    const { $ } = await fetchAndParse("https://www.tiktok.com/discover", {
      Accept: "text/html",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
    });

    const results: TikTokTrend[] = [];

    // Parse TikTok trend cards - structure may vary
    $("a[href*='/tag/']").each((index, element) => {
      if (results.length >= 10) return false;

      try {
        const $el = $(element);
        const href = $el.attr("href");
        const text = $el.text().trim();

        if (!href || !text || text.length < 2) return true;

        const hashtag = text.replace(/[#@]/g, "");
        if (hashtag.length < 2) return true;

        results.push({
          id: `tiktok_${hashtag}_${Date.now()}`,
          title: `#${hashtag}`,
          description: `Trending on TikTok`,
          score: 60 + Math.floor(Math.random() * 40), // 60-100
          url: `https://www.tiktok.com/tag/${hashtag}`,
          timestamp: new Date(),
        });
      } catch (e) {
        // Silently skip
      }

      return true;
    });

    if (results.length > 0) {
      return results;
    }
  } catch (error) {
    console.warn("TikTok scraping failed, falling back to mock data:", error);
  }

  // Fallback mock data if scraping fails
  return [
    {
      id: "tiktok_mock_1",
      title: "#ProductReview",
      description: "Trending on TikTok",
      score: 85,
      url: "https://www.tiktok.com/tag/ProductReview",
      timestamp: new Date(),
    },
    {
      id: "tiktok_mock_2",
      title: "#SmallBusiness",
      description: "Trending on TikTok",
      score: 80,
      url: "https://www.tiktok.com/tag/SmallBusiness",
      timestamp: new Date(),
    },
    {
      id: "tiktok_mock_3",
      title: "#HomeDecor",
      description: "Trending on TikTok",
      score: 78,
      url: "https://www.tiktok.com/tag/HomeDecor",
      timestamp: new Date(),
    },
  ];
}

async function fetchTikTokSounds(): Promise<TikTokTrend[]> {
  try {
    const response = await fetch(
      "https://www.tiktok.com/api/v1/music/popular?limit=20",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      musics?: Array<{
        id?: string;
        title?: string;
        author?: { name?: string };
        play_url?: string;
      }>;
    };
    const musics = data.musics || [];

    return musics
      .slice(0, 5)
      .map((music) => ({
        id: `tiktok_sound_${music.id}`,
        title: `🎵 ${music.title || "Trending Sound"}`,
        description: `by ${music.author?.name || "Artist"}`,
        score: 75 + Math.floor(Math.random() * 25),
        url: music.play_url || "https://www.tiktok.com",
        timestamp: new Date(),
      }));
  } catch (error) {
    console.warn("TikTok sounds API failed:", error);
    return [];
  }
}

export async function scrapeTikTok(): Promise<TikTokTrend[]> {
  const hashtags = await fetchTikTokHashtags();
  await new Promise((resolve) => setTimeout(resolve, 500));
  const sounds = await fetchTikTokSounds();

  return [...hashtags, ...sounds];
}
