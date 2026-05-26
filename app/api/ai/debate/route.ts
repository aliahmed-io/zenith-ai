import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "nodejs";

interface DebateMessage {
  side: "BULL" | "BEAR";
  round: number;
  argument: string;
}

function buildBullPrompt(symbol: string, round: number, previousBearArg?: string): string {
  if (round === 1) {
    return [
      `You are an aggressively BULLISH Wall Street analyst making the case for ${symbol}.`,
      `Round 1 of 3. Open with your strongest fundamental argument.`,
      `Be specific with numbers, market position, and growth catalysts.`,
      `Keep it to 2-3 punchy sentences. Use ALL CAPS for emphasis on key words.`,
      `Do NOT use markdown formatting.`,
    ].join("\n");
  }

  return [
    `You are an aggressively BULLISH Wall Street analyst making the case for ${symbol}.`,
    `The bear just said: "${previousBearArg}"`,
    `Counter their argument. Round ${round} of 3.`,
    `Be specific with numbers, market position, and growth catalysts.`,
    `Keep it to 2-3 punchy sentences. Use ALL CAPS for emphasis on key words.`,
    `Do NOT use markdown formatting.`,
  ].join("\n");
}

function buildBearPrompt(symbol: string, round: number, previousBullArg: string): string {
  return [
    `You are an aggressively BEARISH Wall Street analyst arguing against ${symbol}.`,
    `The bull just said: "${previousBullArg}"`,
    `Counter their argument. Round ${round} of 3.`,
    `Be specific with risks, valuation concerns, and competitive threats.`,
    `Keep it to 2-3 punchy sentences. Use ALL CAPS for emphasis on key words.`,
    `Do NOT use markdown formatting.`,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const symbol = (body.symbol as string | undefined)?.trim().toUpperCase();

    if (!symbol || symbol.length === 0 || symbol.length > 10) {
      return NextResponse.json(
        { error: "A valid stock symbol is required (1-10 characters)." },
        { status: 400 },
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const model = google("gemini-2.5-flash");
    const debate: DebateMessage[] = [];

    // Round 1 — Bull opens
    const { text: bull1 } = await generateText({
      model,
      prompt: buildBullPrompt(symbol, 1),
    });
    debate.push({ side: "BULL", round: 1, argument: bull1 });

    // Round 1 — Bear counters
    const { text: bear1 } = await generateText({
      model,
      prompt: buildBearPrompt(symbol, 1, bull1),
    });
    debate.push({ side: "BEAR", round: 1, argument: bear1 });

    // Round 2 — Bull counters bear
    const { text: bull2 } = await generateText({
      model,
      prompt: buildBullPrompt(symbol, 2, bear1),
    });
    debate.push({ side: "BULL", round: 2, argument: bull2 });

    // Round 2 — Bear counters
    const { text: bear2 } = await generateText({
      model,
      prompt: buildBearPrompt(symbol, 2, bull2),
    });
    debate.push({ side: "BEAR", round: 2, argument: bear2 });

    // Round 3 — Bull final
    const { text: bull3 } = await generateText({
      model,
      prompt: buildBullPrompt(symbol, 3, bear2),
    });
    debate.push({ side: "BULL", round: 3, argument: bull3 });

    // Round 3 — Bear final
    const { text: bear3 } = await generateText({
      model,
      prompt: buildBearPrompt(symbol, 3, bull3),
    });
    debate.push({ side: "BEAR", round: 3, argument: bear3 });

    return NextResponse.json({ debate });
  } catch (error) {
    console.error("Debate API Error:", error);
    return NextResponse.json(
      { error: "The AI Debate engine is temporarily unavailable. Try again shortly." },
      { status: 500 },
    );
  }
}
