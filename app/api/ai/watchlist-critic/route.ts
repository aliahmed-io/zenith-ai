import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { watchlist } = await req.json();
    
    if (!watchlist || !Array.isArray(watchlist) || watchlist.length === 0) {
      return NextResponse.json({ critique: "Your watchlist is currently empty. Add some assets to get a personalized portfolio critique." });
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const symbols = watchlist.map((item: { symbol: string }) => item.symbol).join(", ");

    const systemPrompt = "INITIALIZATION COMPLETE. NATIVE AI ONLINE.\nYou are the Zenith System Portfolio Auditor. The user will provide a list of stock symbols they are currently watching. Your job is to act as a 'Watchlist Critic'. You must analyze the sectors and types of stocks they are watching. Provide a punchy, 2-to-3 sentence critique highlighting their exposure risks (e.g., 'Overweight in technology sector', 'High volatility exposure') and suggest one broad area for diversification. DO NOT use emojis. Keep it strictly analytical, brutalist, and objective. Format as plain text.";

    let generatedText = "";
    try {
      const { text } = await generateText({
        model: google("gemini-3.1-flash-lite"),
        system: systemPrompt,
        prompt: `Analyze this watchlist: ${symbols}`,
      });
      generatedText = text;
    } catch (e) {
      console.warn("Primary model failed, falling back to gemini-3.5-flash", e);
      const { text } = await generateText({
        model: google("gemini-3.5-flash"),
        system: systemPrompt,
        prompt: `Analyze this watchlist: ${symbols}`,
      });
      generatedText = text;
    }

    return NextResponse.json({ critique: generatedText });
  } catch (error) {
    console.error("Watchlist Critic Error:", error);
    return NextResponse.json({ critique: "Our AI Critic is currently analyzing market data and is temporarily unavailable." }, { status: 500 });
  }
}
