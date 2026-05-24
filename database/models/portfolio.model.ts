import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface PortfolioPosition extends Document {
  userId: string;
  symbol: string;
  quantity: number;
  averagePrice: number;
  updatedAt: Date;
}

const PortfolioSchema = new Schema<PortfolioPosition>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    averagePrice: { type: Number, required: true },
  },
  { timestamps: true }
);

PortfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Portfolio: Model<PortfolioPosition> =
  (models?.Portfolio as Model<PortfolioPosition>) || model<PortfolioPosition>('Portfolio', PortfolioSchema);
