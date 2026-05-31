export interface RedditTrend {
  id: string;
  title: string;
  description: string;
  score: number;
  url: string;
  image?: string;
  timestamp: Date;
}

const REDDIT_SUBREDDITS = [
  "Entrepreneur",
  "SmallBusiness",
  "Shopify",
  "SideProject",
  "BuyItForLife",
];

async function fetchRedditTrends(subreddit: string): Promise<RedditTrend[]> {
  try {
    const response = await fetch(
      `https://www.reddit.com/r/${subreddit}/top.json?t=week&limit=25`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      }
    );

    if (!response.ok) {
      console.error(`Reddit API error for r/${subreddit}: ${response.status}`);
      return [];
    }

    const data = (await response.json()) as {
      data?: {
        children?: Array<{
          data?: {
            id?: string;
            title?: string;
            selftext?: string;
            score?: number;
            url?: string;
            thumbnail?: string;
            created_utc?: number;
          };
        }>;
      };
    };

    const posts = data.data?.children || [];
    return posts
      .slice(0, 10)
      .map((post) => {
        const p = post.data;
        if (!p?.id || !p.title) return null;

        return {
          id: p.id,
          title: p.title.substring(0, 100),
          description: (p.selftext || "").substring(0, 250),
          score: Math.min(100, Math.floor((p.score || 0) / 10)),
          url: `https://reddit.com${p.url}`,
          image:
            p.thumbnail && p.thumbnail.startsWith("http")
              ? p.thumbnail
              : undefined,
          timestamp: new Date((p.created_utc || 0) * 1000),
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null);
  } catch (error) {
    console.error(`Error fetching Reddit r/${subreddit}:`, error);
    return [];
  }
}

export async function scrapeReddit(): Promise<RedditTrend[]> {
  const allTrends: RedditTrend[] = [];

  for (const subreddit of REDDIT_SUBREDDITS) {
    const trends = await fetchRedditTrends(subreddit);
    allTrends.push(...trends);
    // Rate limiting: small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return allTrends;
}
