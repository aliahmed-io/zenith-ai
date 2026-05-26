import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { connectToDatabase } from "@/database/mongoose";
import { Portfolio } from "@/database/models/portfolio.model";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

export const runtime = "nodejs";

interface RoastResponse {
  archetype: string;
  grades: {
    diversification: string;
    riskManagement: string;
    timing: string;
    conviction: string;
  };
  roast: string;
  advice: string;
}

interface QuoteResult {
  symbol: string;
  price: number;
}

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const mongoose = await connectToDatabase();
    if (!mongoose) throw new Error("MongoDB connection failed");
    const db = mongoose.connection.db;
    if (!db) throw new Error("MongoDB connection not found");

    const user = await db.collection("user").findOne({ id: userId });
    const virtualBalance =
      typeof user?.virtualBalance === "number" ? user.virtualBalance : 100000;

    const positions = await Portfolio.find({ userId });

    if (positions.length === 0) {
      return NextResponse.json(
        {
          error:
            "Your portfolio is empty. Buy some stocks first so we have something to roast.",
        },
        { status: 400 }
      );
    }

    // Fetch live prices for each position
    const livePrices: Record<string, number> = {};
    await Promise.all(
      positions.map(async (pos) => {
        try {
          const baseUrl =
            process.env.BETTER_AUTH_URL || "http://localhost:3001";
          const quoteRes = await fetch(
            `${baseUrl}/api/market/quote?symbol=${pos.symbol}`,
            {
              headers: {
                cookie: (await headers()).get("cookie") || "",
              },
            }
          );
          if (quoteRes.ok) {
            const quoteData: QuoteResult = await quoteRes.json();
            livePrices[pos.symbol.toUpperCase()] =
              quoteData.price || pos.averagePrice;
          } else {
            livePrices[pos.symbol.toUpperCase()] = pos.averagePrice;
          }
        } catch {
          livePrices[pos.symbol.toUpperCase()] = pos.averagePrice;
        }
      })
    );

    // Build portfolio summary for AI analysis
    const totalHoldingsValue = positions.reduce((acc, pos) => {
      const livePrice =
        livePrices[pos.symbol.toUpperCase()] ?? pos.averagePrice;
      return acc + pos.quantity * livePrice;
    }, 0);

    const totalEquity = virtualBalance + totalHoldingsValue;
    const cashAllocation = ((virtualBalance / totalEquity) * 100).toFixed(1);

    const positionSummaries = positions.map((pos) => {
      const livePrice =
        livePrices[pos.symbol.toUpperCase()] ?? pos.averagePrice;
      const marketValue = pos.quantity * livePrice;
      const costBasis = pos.quantity * pos.averagePrice;
      const pnl = marketValue - costBasis;
      const pnlPercent = ((pnl / costBasis) * 100).toFixed(2);
      const allocationPercent = ((marketValue / totalEquity) * 100).toFixed(1);

      return {
        symbol: pos.symbol,
        quantity: pos.quantity,
        avgCost: pos.averagePrice.toFixed(2),
        livePrice: livePrice.toFixed(2),
        marketValue: marketValue.toFixed(2),
        pnl: pnl.toFixed(2),
        pnlPercent: `${pnlPercent}%`,
        allocationPercent: `${allocationPercent}%`,
      };
    });

    // Sort by allocation descending to highlight concentration
    positionSummaries.sort(
      (a, b) =>
        parseFloat(b.allocationPercent) - parseFloat(a.allocationPercent)
    );

    const portfolioDataString = `
Total Portfolio Equity: $${totalEquity.toLocaleString("en-US", { minimumFractionDigits: 2 })}
Cash Balance: $${virtualBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })} (${cashAllocation}% of portfolio)
Number of Positions: ${positions.length}
Total Holdings Value: $${totalHoldingsValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}

Positions (sorted by allocation):
${positionSummaries
  .map(
    (p) =>
      `- ${p.symbol}: ${p.quantity} shares, Avg Cost $${p.avgCost}, Live $${p.livePrice}, Value $${p.marketValue}, P&L $${p.pnl} (${p.pnlPercent}), Allocation ${p.allocationPercent}`
  )
  .join("\n")}
`.trim();

    const google = createGoogleGenerativeAI({
      apiKey:
        process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const systemPrompt = `You are a ruthless Wall Street hedge fund portfolio manager reviewing a junior analyst's portfolio. Be brutally honest.

Portfolio:
${portfolioDataString}

You must respond in EXACTLY this JSON format:
{
  "archetype": "A 2-3 word trader archetype label e.g. 'Reckless Momentum Chaser' or 'Disciplined Value Hunter'",
  "grades": {
    "diversification": "A-F letter grade",
    "riskManagement": "A-F letter grade",
    "timing": "A-F letter grade",
    "conviction": "A-F letter grade"
  },
  "roast": "A 3-4 sentence devastating but educational critique. Use ALL CAPS for key words. Be specific about their actual holdings.",
  "advice": "One clear, actionable improvement they should make immediately."
}

Respond with ONLY the JSON object. No markdown formatting, no code fences, no explanation.`;

    let generatedText = "";
    try {
      const { text } = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: systemPrompt,
      });
      generatedText = text;
    } catch (e) {
      console.warn(
        "Primary model (gemini-2.5-flash) failed, falling back:",
        e
      );
      const { text } = await generateText({
        model: google("gemini-2.0-flash"),
        prompt: systemPrompt,
      });
      generatedText = text;
    }

    // Parse JSON from the response, stripping any markdown fences
    const cleanedText = generatedText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    let parsedResponse: RoastResponse;
    try {
      parsedResponse = JSON.parse(cleanedText) as RoastResponse;
    } catch {
      // Attempt to extract JSON from the text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]) as RoastResponse;
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Validate required fields
    if (
      !parsedResponse.archetype ||
      !parsedResponse.grades ||
      !parsedResponse.roast ||
      !parsedResponse.advice
    ) {
      throw new Error("AI response missing required fields");
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Portfolio Roast Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "The roast engine is temporarily offline. Even AI needs a break from your portfolio.",
      },
      { status: 500 }
    );
  }
}
