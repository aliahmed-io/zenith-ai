import { NextResponse } from 'next/server';
import { executeTrade } from '@/lib/actions/trading.actions';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { symbol, type, quantity, currentPrice } = body;

    if (!symbol || !type || !quantity || !currentPrice) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await executeTrade(symbol, type, quantity, currentPrice);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, transactionId: result.transactionId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
