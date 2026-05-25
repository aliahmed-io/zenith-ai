import { NextResponse } from 'next/server';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
}

// Cache to prevent Finnhub rate limits (60/min free tier)
let heatmapCache: StockData[] | null = null;
let lastFetch = 0;

const STOCKS = [
  // Technology
  { symbol: "AAPL", name: "Apple", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft", sector: "Technology" },
  { symbol: "GOOGL", name: "Google", sector: "Technology" },
  { symbol: "META", name: "Meta", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA", sector: "Technology" },
  { symbol: "TSLA", name: "Tesla", sector: "Technology" },
  
  // Finance
  { symbol: "JPM", name: "JP Morgan", sector: "Finance" },
  { symbol: "BAC", name: "Bank of America", sector: "Finance" },
  { symbol: "WFC", name: "Wells Fargo", sector: "Finance" },
  { symbol: "GS", name: "Goldman Sachs", sector: "Finance" },
  
  // Healthcare
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare" },
  { symbol: "UNH", name: "UnitedHealth", sector: "Healthcare" },
  { symbol: "PFE", name: "Pfizer", sector: "Healthcare" },
  { symbol: "ABBV", name: "AbbVie", sector: "Healthcare" },
  
  // Energy
  { symbol: "XOM", name: "Exxon Mobil", sector: "Energy" },
  { symbol: "CVX", name: "Chevron", sector: "Energy" },
  { symbol: "COP", name: "ConocoPhillips", sector: "Energy" },
  
  // Consumer
  { symbol: "AMZN", name: "Amazon", sector: "Consumer" },
  { symbol: "WMT", name: "Walmart", sector: "Consumer" },
  { symbol: "HD", name: "Home Depot", sector: "Consumer" },
  { symbol: "MCD", name: "McDonald's", sector: "Consumer" },
];

export async function GET() {
  try {
    const token = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
    if (!token) {
      return NextResponse.json({ error: 'Finnhub API key missing' }, { status: 500 });
    }

    const now = Date.now();
    // Cache for 60 seconds
    if (heatmapCache && (now - lastFetch < 60000)) {
      return NextResponse.json({ data: heatmapCache });
    }

    const results = await Promise.all(
      STOCKS.map(async (stock) => {
        try {
          const res = await fetch(`${FINNHUB_BASE_URL}/quote?symbol=${stock.symbol}&token=${token}`);
          if(!res.ok) throw new Error('Fetch failed');
          const data = await res.json();
          return {
            ...stock,
            price: data.c,
            change: data.dp // Percentage change
          };
        } catch (_err) {
          // Fallback if rate limited or fails
          return { ...stock, price: 0, change: 0 };
        }
      })
    );

    heatmapCache = results;
    lastFetch = now;

    return NextResponse.json({ data: results });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
