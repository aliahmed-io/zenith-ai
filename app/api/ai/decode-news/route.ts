import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

export const runtime = "nodejs";

interface DecodeRequestBody {
  headline: string;
  summary: string;
}

interface DecodedAnalysis {
  whatHappened: string;
  whyItMatters: string;
  affectedTickers: string[];
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  actionItem: string;
}

const SYSTEM_PROMPT = `You are an elite financial news analyst working for an institutional trading desk. Your job is to decode news headlines and provide structured, actionable intelligence for traders. Be precise, analytical, and avoid speculation. Only include tickers you are confident are directly affected.`;

function buildPrompt(headline: string, summary: string): string {
  return `Decode this headline for a trader.

Headline: ${headline}
Summary: ${summary}

Respond in EXACTLY this JSON format (no markdown fences, no extra text):
{
  "whatHappened": "One clear sentence about the event",
  "whyItMatters": "One sentence on market impact",
  "affectedTickers": ["AAPL", "MSFT"],
  "direction": "BULLISH" or "BEARISH" or "NEUTRAL",
  "confidence": 1-10 number,
  "actionItem": "One sentence: what a trader should consider doing"
}`;
}

function parseAnalysis(text: string): DecodedAnalysis {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  const parsed = JSON.parse(cleaned) as DecodedAnalysis;

  if (
    !parsed.whatHappened ||
    !parsed.whyItMatters ||
    !Array.isArray(parsed.affectedTickers) ||
    !parsed.direction ||
    typeof parsed.confidence !== "number" ||
    !parsed.actionItem
  ) {
    throw new Error("Invalid analysis structure from model");
  }

  const validDirections = ["BULLISH", "BEARISH", "NEUTRAL"] as const;
  if (!validDirections.includes(parsed.direction)) {
    parsed.direction = "NEUTRAL";
  }

  parsed.confidence = Math.max(1, Math.min(10, Math.round(parsed.confidence)));
  parsed.affectedTickers = parsed.affectedTickers
    .map((t) => t.trim().toUpperCase())
    .filter((t) => t.length > 0 && t.length <= 6);

  return parsed;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DecodeRequestBody;
    const { headline, summary } = body;

    if (!headline || typeof headline !== "string") {
      return NextResponse.json(
        { error: "headline is required and must be a string" },
        { status: 400 }
      );
    }

    if (!summary || typeof summary !== "string") {
      return NextResponse.json(
        { error: "summary is required and must be a string" },
        { status: 400 }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey:
        process.env.GEMINI_API_KEY ||
        process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const prompt = buildPrompt(headline, summary);

    let generatedText = "";
    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        system: SYSTEM_PROMPT,
        prompt,
      });
      generatedText = text;
    } catch (primaryError) {
      console.warn(
        "Primary model (gemini-2.5-flash) failed, falling back:",
        primaryError
      );
      const { text } = await generateText({
        model: google("gemini-2.0-flash"),
        system: SYSTEM_PROMPT,
        prompt,
      });
      generatedText = text;
    }

    const analysis = parseAnalysis(generatedText);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Decode News API Error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to decode news. The AI analysis engine is temporarily unavailable.",
      },
      { status: 500 }
    );
  }
}
