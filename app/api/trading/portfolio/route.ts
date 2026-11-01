import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/database/mongoose';
import { Portfolio } from '@/database/models/portfolio.model';
import { auth, memoryDb } from '@/lib/better-auth/auth';
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
    let virtualBalance = 100000;
    let positions: unknown[] = [];

    // Check in-memory user virtual balance first
    const memUser = memoryDb.user.find((u) => u.id === userId || u.email === session.user.email);
    if (memUser && typeof memUser.virtualBalance === 'number') {
      virtualBalance = memUser.virtualBalance;
    }

    try {
      const mongoose = await connectToDatabase();
      const db = mongoose?.connection?.db;
      if (db) {
        const user = await db.collection("user").findOne({ id: userId });
        if (typeof user?.virtualBalance === 'number') {
          virtualBalance = user.virtualBalance;
        }
        positions = await Portfolio.find({ userId });
      }
    } catch (dbErr) {
      console.warn('Portfolio database query skipped (offline fallback):', dbErr);
    }

    return NextResponse.json({
      virtualBalance,
      positions
    });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
