import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { search } from "duck-duck-scrape";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json();
    
    if (!symbol) {
      return NextResponse.json({ explanation: "Please provide a stock symbol." }, { status: 400 });
    }

    const groq = createGroq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    });

    // 1. Fetch real-time context from DuckDuckGo with credible sources preferred
    let searchContext = "";
    try {
        const searchResults = await search(`${symbol} stock news (site:bloomberg.com OR site:reuters.com OR site:cnbc.com OR site:wsj.com OR site:finance.yahoo.com)`);
        searchContext = searchResults.results
            .slice(0, 4)
            .map(r => `[${r.title}]: ${r.description}`)
            .join("\n");
    } catch (e) {
        console.warn("Search failed:", e);
        searchContext = "No real-time search context available. Rely on existing knowledge.";
    }

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      system: `INITIALIZATION COMPLETE. NATIVE AI ONLINE.
      You are the Zenith AI System Terminal. The user wants to know why ${symbol} is moving recently. 
      Analyze the provided real-time news search context and explain the movement in 2-3 concise, strictly analytical sentences. 
      If the context doesn't explain it, provide a general technical/market overview. Do not invent news.
      DO NOT use emojis. Maintain a tactical, objective, and brutalist tone.
      
      Real-Time Search Context (Credible Sources):
      ${searchContext}`,
      prompt: `[EXECUTE ANALYSIS]: Explain the recent price movement for ${symbol}.`,
    });

    return NextResponse.json({ explanation: text });
  } catch (error) {
    console.error("Explainer Error:", error);
    return NextResponse.json({ explanation: "Our AI Explainer is currently analyzing market data and is temporarily unavailable." }, { status: 500 });
  }
}
