"use server";

import { connectToDatabase } from "@/database/mongoose";
import SandboxSimulation from "@/database/models/sandbox.model";
import { getHistoricalNews } from "./finnhub.actions";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

async function getYahooHistoricalCandles(symbol: string, toTimestamp: number, daysBack: number) {
  try {
    const period2 = new Date(toTimestamp * 1000);
    const period1 = new Date((toTimestamp - daysBack * 24 * 60 * 60) * 1000);
    
    const results = await yahooFinance.historical(symbol, {
      period1,
      period2,
      interval: '1d'
    });
    
    return results.map(r => ({
      time: Math.floor(r.date.getTime() / 1000),
      open: r.open,
      high: r.high,
      low: r.low,
      close: r.close,
      value: r.volume
    }));
  } catch (err) {
    console.error(`Yahoo finance error for ${symbol}:`, err);
    return [];
  }
}

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const POPULAR_STOCKS = ["AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "TSLA", "META", "NFLX"];

// Generate a random scenario
export async function generateSandboxScenario() {
  const symbol = POPULAR_STOCKS[Math.floor(Math.random() * POPULAR_STOCKS.length)];
  
  // Pick a random date between 11 months ago and 2 months ago (to ensure future data exists and free tier candles work)
  const now = new Date();
  const elevenMonthsAgo = new Date();
  elevenMonthsAgo.setMonth(now.getMonth() - 11);
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);
  
  const randomTime = elevenMonthsAgo.getTime() + Math.random() * (twoMonthsAgo.getTime() - elevenMonthsAgo.getTime());
  const scenarioDate = new Date(randomTime);
  const toTimestamp = Math.floor(randomTime / 1000);
  
  // Get candles up to the scenario date
  const candles = await getYahooHistoricalCandles(symbol, toTimestamp, 90);
  
  // Get news from the 30 days prior
  const fromNewsDate = new Date(randomTime - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const toNewsDate = scenarioDate.toISOString().split('T')[0];
  const news = await getHistoricalNews(symbol, fromNewsDate, toNewsDate);
  
  return {
    symbol,
    scenarioDate: scenarioDate.toISOString(),
    candles,
    news: news.slice(0, 10), // return top 10 news articles
  };
}

export async function evaluateSandboxDecision(
  userId: string,
  symbol: string,
  scenarioDateStr: string,
  decision: "BUY" | "SELL"
) {
  await connectToDatabase();
  
  const scenarioDate = new Date(scenarioDateStr);
  const toTimestamp = Math.floor(scenarioDate.getTime() / 1000);
  
  // Fetch candles up to the decision point to get the exact price
  const decisionCandles = await getYahooHistoricalCandles(symbol, toTimestamp, 5);
  const priceAtDecision = decisionCandles && decisionCandles.length > 0 ? decisionCandles[decisionCandles.length - 1].close : 100;
  
  // Fetch future data (30 days ahead)
  const futureDate = new Date(scenarioDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  const futureTimestamp = Math.floor(futureDate.getTime() / 1000);
  const futureCandles = await getYahooHistoricalCandles(symbol, futureTimestamp, 35);
  
  // Filter future candles to only include days AFTER the scenario date
  const actualFutureData = futureCandles?.filter((c: any) => c.time > toTimestamp) || [];
  const priceAfter30Days = actualFutureData.length > 0 ? actualFutureData[actualFutureData.length - 1].close : priceAtDecision;
  
  // Determine outcome
  const priceIncreased = priceAfter30Days > priceAtDecision;
  const isCorrect = (decision === "BUY" && priceIncreased) || (decision === "SELL" && !priceIncreased);
  const outcome = isCorrect ? "CORRECT" : "INCORRECT";
  
  // Use Gemini to analyze the trade
  const prompt = `
    You are an elite, highly-confident institutional trading mentor. The user just played a trading simulation.
    - Asset: ${symbol}
    - Decision Date: ${scenarioDateStr}
    - User Action: ${decision} at $${priceAtDecision}
    - Reality: 30 days later, the price hit $${priceAfter30Days}.
    - User Outcome: ${outcome}
    
    Do NOT hedge or use weak phrases like "might have" or "it is possible that". Speak with absolute conviction based on the historical reality of this specific time period.
    
    In a brief, punchy paragraph (3-4 sentences):
    1. Declare exactly WHY the stock moved the way it did during that specific 30-day window (reference actual historical macro/company trends if you know them).
    2. Deliver a harsh but fair critique or high praise.
    3. Provide ONE clear, actionable trading lesson they must learn from this.
    Keep it brutalist, concise, and highly professional. Use ALL CAPS for the most critical words.
  `;
  
  const { text: aiAnalysis } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
  });
  
  // Save to database
  const simulation = await SandboxSimulation.create({
    userId,
    symbol,
    scenarioDate,
    decision,
    outcome,
    priceAtDecision,
    priceAfter30Days,
    aiAnalysis,
  });
  
  return {
    simulationId: simulation._id.toString(),
    outcome,
    priceAtDecision,
    priceAfter30Days,
    actualFutureData,
    aiAnalysis,
  };
}

export async function getUserSimulations(userId: string) {
  await connectToDatabase();
  const simulations = await SandboxSimulation.find({ userId }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(simulations));
}
