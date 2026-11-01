import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { Transaction } from '@/database/models/transaction.model';
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

    const userId = session.user.id;
    let history: unknown[] = [];

    try {
      const mongoose = await connectToDatabase();
      if (mongoose?.connection?.db) {
        history = await Transaction.find({ 
          userId, 
          symbol: symbol.toUpperCase() === 'ALL' ? { $exists: true } : symbol.toUpperCase() 
        }).sort({ timestamp: -1 });
      }
    } catch (dbErr) {
      console.warn('Transaction history database query skipped (offline fallback):', dbErr);
    }

    return NextResponse.json({ history });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
