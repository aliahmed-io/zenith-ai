'use server';

import { connectToDatabase } from "@/database/mongoose";
import { Portfolio } from "@/database/models/portfolio.model";
import { Transaction } from "@/database/models/transaction.model";
import { auth, memoryDb, persistAuthDb } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import mongoose from "mongoose";

export const executeTrade = async (symbol: string, type: 'BUY' | 'SELL', quantity: number, currentPrice: number) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });
    if (!session || !session.user) {
      throw new Error("Unauthorized");
    }
    
    const userId = session.user.id;
    const totalAmount = quantity * currentPrice;

    // Check user in memory DB first
    const memUser = memoryDb.user.find((u) => u.id === userId || u.email === session.user.email);
    let virtualBalance = typeof memUser?.virtualBalance === 'number' ? memUser.virtualBalance : 100000;

    const mongoConn = await connectToDatabase();
    const db = mongoConn?.connection?.db;
    
    if (db) {
      const isHex = mongoose.Types.ObjectId.isValid(userId);
      const query = isHex ? { $or: [{ _id: new mongoose.Types.ObjectId(userId) }, { id: userId }] } : { id: userId };
      const user = await db.collection("user").findOne(query);
      if (typeof user?.virtualBalance === 'number') {
        virtualBalance = user.virtualBalance;
      }
    }

    if (type === 'BUY') {
      if (virtualBalance < totalAmount) {
        throw new Error("Insufficient funds");
      }
      virtualBalance -= totalAmount;
    } else if (type === 'SELL') {
      virtualBalance += totalAmount;
    }

    // Update memory user balance
    if (memUser) {
      memUser.virtualBalance = virtualBalance;
      persistAuthDb();
    }

    // Persist to mongo if available
    if (db) {
      const isHex = mongoose.Types.ObjectId.isValid(userId);
      const query = isHex ? { $or: [{ _id: new mongoose.Types.ObjectId(userId) }, { id: userId }] } : { id: userId };
      await db.collection("user").updateOne(query, { $set: { virtualBalance } });

      try {
        const transaction = await Transaction.create({
          userId,
          symbol,
          type,
          quantity,
          price: currentPrice,
          totalAmount,
          status: 'COMPLETED'
        });

        if (type === 'BUY') {
          const existingPosition = await Portfolio.findOne({ userId, symbol });
          if (existingPosition) {
            const newTotalQuantity = existingPosition.quantity + quantity;
            const totalValue = (existingPosition.quantity * existingPosition.averagePrice) + totalAmount;
            existingPosition.quantity = newTotalQuantity;
            existingPosition.averagePrice = totalValue / newTotalQuantity;
            await existingPosition.save();
          } else {
            await Portfolio.create({
              userId,
              symbol,
              quantity,
              averagePrice: currentPrice
            });
          }
        } else if (type === 'SELL') {
          const existingPosition = await Portfolio.findOne({ userId, symbol });
          if (existingPosition) {
            existingPosition.quantity -= quantity;
            if (existingPosition.quantity <= 0) {
              await Portfolio.deleteOne({ _id: existingPosition._id });
            } else {
              await existingPosition.save();
            }
          }
        }

        return { success: true, transactionId: String((transaction as unknown as { _id: unknown })._id) };
      } catch (dbErr) {
        console.warn('Trade DB transaction logging skipped (offline):', dbErr);
      }
    }

    return { success: true, transactionId: `local-${Date.now()}` };
  } catch (error: unknown) {
    console.error("Trade execution failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
};
