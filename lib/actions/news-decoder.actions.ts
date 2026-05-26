"use server";

interface FinnhubNewsArticle {
  id: number;
  category: string;
  datetime: number;
  headline: string;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface NewsArticle {
  id: number;
  headline: string;
  summary: string;
  source: string;
  url: string;
  image: string;
  datetime: number;
  related: string;
}

export async function getLatestNews(): Promise<NewsArticle[]> {
  const FINNHUB_API_KEY =
    process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  if (!FINNHUB_API_KEY) {
    console.error("FINNHUB API key is not configured for news-decoder");
    return [];
  }

  try {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_API_KEY}`;

    const res = await fetch(url, {
      cache: "force-cache",
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      throw new Error(
        `Finnhub news fetch failed with status ${res.status}: ${errorText}`
      );
    }

    const rawArticles = (await res.json()) as FinnhubNewsArticle[];

    if (!Array.isArray(rawArticles)) {
      return [];
    }

    const seen = new Set<string>();
    const deduped: FinnhubNewsArticle[] = [];

    for (const article of rawArticles) {
      if (
        !article.headline ||
        !article.summary ||
        article.headline.trim().length === 0
      ) {
        continue;
      }

      const key = `${article.id}-${article.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);

      deduped.push(article);
      if (deduped.length >= 15) break;
    }

    return deduped.map((article) => ({
      id: article.id,
      headline: article.headline,
      summary: article.summary,
      source: article.source,
      url: article.url,
      image: article.image,
      datetime: article.datetime,
      related: article.related,
    }));
  } catch (error) {
    console.error("getLatestNews error:", error);
    return [];
  }
}
