import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface TransactionRecord extends Document {
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  timestamp: Date;
}

const TransactionSchema = new Schema<TransactionRecord>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    type: { type: String, enum: ['BUY', 'SELL'], required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'FAILED'], required: true, default: 'PENDING' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const Transaction: Model<TransactionRecord> =
  (models?.Transaction as Model<TransactionRecord>) || model<TransactionRecord>('Transaction', TransactionSchema);
