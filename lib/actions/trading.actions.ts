'use server';

import { connectToDatabase } from "@/database/mongoose";
import { Portfolio } from "@/database/models/portfolio.model";
import { Transaction } from "@/database/models/transaction.model";
import { auth } from "@/lib/better-auth/auth";
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

    await connectToDatabase();
    const db = mongoose.connection.db;
    if(!db) throw new Error('MongoDB connection not found');
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await db.collection("user").findOne({ _id: userObjectId });
    if (!user) throw new Error("User not found");
    
    // User might have it directly from the db doc, defaults to 0 if missing somehow
    const virtualBalance = typeof user.virtualBalance === 'number' ? user.virtualBalance : 100000;

    // Create the transaction record as pending
    const transaction = await Transaction.create({
      userId,
      symbol,
      type,
      quantity,
      price: currentPrice,
      totalAmount,
      status: 'PENDING'
    });

    if (type === 'BUY') {
      if (virtualBalance < totalAmount) {
        transaction.status = 'FAILED';
        await transaction.save();
        throw new Error("Insufficient funds");
      }
      
      // Update user's virtual balance
      await db.collection("user").updateOne({ _id: userObjectId }, { $inc: { virtualBalance: -totalAmount } });
      
      // Upsert portfolio
      const existingPosition = await Portfolio.findOne({ userId, symbol });
      if (existingPosition) {
        const newTotalQuantity = existingPosition.quantity + quantity;
        const totalValue = (existingPosition.quantity * existingPosition.averagePrice) + totalAmount;
        const newAveragePrice = totalValue / newTotalQuantity;
        
        existingPosition.quantity = newTotalQuantity;
        existingPosition.averagePrice = newAveragePrice;
        await existingPosition.save();
      } else {
        await Portfolio.create({
          userId,
          symbol,
          quantity,
          averagePrice: currentPrice
        });
      }
      
      transaction.status = 'COMPLETED';
      await transaction.save();
      
    } else if (type === 'SELL') {
      const existingPosition = await Portfolio.findOne({ userId, symbol });
      if (!existingPosition || existingPosition.quantity < quantity) {
        transaction.status = 'FAILED';
        await transaction.save();
        throw new Error("Insufficient shares in portfolio");
      }
      
      // Update user's virtual balance
      await db.collection("user").updateOne({ _id: userObjectId }, { $inc: { virtualBalance: totalAmount } });
      
      // Update portfolio
      existingPosition.quantity -= quantity;
      if (existingPosition.quantity === 0) {
        await Portfolio.deleteOne({ _id: existingPosition._id });
      } else {
        await existingPosition.save();
      }
      
      transaction.status = 'COMPLETED';
      await transaction.save();
    }

    return { success: true, transactionId: String((transaction as unknown as { _id: unknown })._id) };
  } catch (error: unknown) {
    console.error("Trade execution failed:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
