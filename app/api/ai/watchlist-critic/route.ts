import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { watchlist } = await req.json();
    
    if (!watchlist || !Array.isArray(watchlist) || watchlist.length === 0) {
      return NextResponse.json({ critique: "Your watchlist is currently empty. Add some assets to get a personalized portfolio critique." });
    }

    const groq = createGroq({
      apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
    });

    const symbols = watchlist.map(({ symbol: string }) => item.symbol).join(", ");

    const { text } = await generateText({
      model: groq("llama3-8b-8192"),
      system: "INITIALIZATION COMPLETE. NATIVE AI ONLINE.\nYou are the Zenith System Portfolio Auditor. The user will provide a list of stock symbols they are currently watching. Your job is to act as a 'Watchlist Critic'. You must analyze the sectors and types of stocks they are watching. Provide a punchy, 2-to-3 sentence critique highlighting their exposure risks (e.g., 'Overweight in technology sector', 'High volatility exposure') and suggest one broad area for diversification. DO NOT use emojis. Keep it strictly analytical, brutalist, and objective. Format as plain text.",
      prompt: `Analyze this watchlist: ${symbols}`,
    });

    return NextResponse.json({ critique: text });
  } catch (error) {
    console.error("Watchlist Critic Error:", error);
    return NextResponse.json({ critique: "Our AI Critic is currently analyzing market data and is temporarily unavailable." }, { status: 500 });
  }
}
