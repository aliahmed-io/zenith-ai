import { NextResponse } from 'next/server';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get('symbol');
    
    if (!symbol) {
      return NextResponse.json({ error: 'Missing symbol parameter' }, { status: 400 });
    }

    // This would typically fetch sentiment data processed by Inngest.
    // Mocking a response for the AI Mentor.
    const mockSentiments = ['Bullish', 'Bearish', 'Neutral'];
    const randomSentiment = mockSentiments[Math.floor(Math.random() * mockSentiments.length)];
    const mockScore = Math.floor(Math.random() * 100);

    return NextResponse.json({ 
      symbol: symbol.toUpperCase(), 
      sentiment: randomSentiment,
      score: mockScore,
      analysis: `Recent market data suggests a ${randomSentiment.toLowerCase()} trend for ${symbol.toUpperCase()}.`
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
