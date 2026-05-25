import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { search } from "duck-duck-scrape";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { symbol } = await req.json();
    
    if (!symbol) {
      return NextResponse.json({ explanation: "Please provide a stock symbol." }, { status: 400 });
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
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

    const systemPrompt = `INITIALIZATION COMPLETE. NATIVE AI ONLINE.
      You are the Zenith AI System Terminal. The user wants to know why ${symbol} is moving recently. 
      Analyze the provided real-time news search context and explain the movement in 2-3 concise, strictly analytical sentences. 
      If the context doesn't explain it, provide a general technical/market overview. Do not invent news.
      DO NOT use emojis. Maintain a tactical, objective, and brutalist tone.
      
      Real-Time Search Context (Credible Sources):
      ${searchContext}`;

    let generatedText = "";
    try {
      const { text } = await generateText({
        model: google("gemini-3.1-flash-lite"),
        system: systemPrompt,
        prompt: `[EXECUTE ANALYSIS]: Explain the recent price movement for ${symbol}.`,
      });
      generatedText = text;
    } catch (e) {
      console.warn("Primary model failed, falling back to gemini-3.5-flash", e);
      const { text } = await generateText({
        model: google("gemini-3.5-flash"),
        system: systemPrompt,
        prompt: `[EXECUTE ANALYSIS]: Explain the recent price movement for ${symbol}.`,
      });
      generatedText = text;
    }

    return NextResponse.json({ explanation: generatedText });
  } catch (error) {
    console.error("Explainer Error:", error);
    return NextResponse.json({ explanation: "Our AI Explainer is currently analyzing market data and is temporarily unavailable." }, { status: 500 });
  }
}
