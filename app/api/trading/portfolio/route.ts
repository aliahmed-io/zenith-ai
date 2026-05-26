import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    await connectToDatabase();
    
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if(!db) throw new Error('MongoDB connection not found');
    
    const user = await db.collection("user").findOne({ id: userId });
    const virtualBalance = typeof user?.virtualBalance === 'number' ? user.virtualBalance : 100000;

    const portfolio = await Portfolio.find({ userId });

    return NextResponse.json({
      virtualBalance,
      positions: portfolio
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
