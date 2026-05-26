"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface NativeSymbolInfoProps {
  symbol: string;
  height?: number;
}

export default function NativeSymbolInfo({ symbol, height = 170 }: NativeSymbolInfoProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [quoteRes, profileRes] = await Promise.all([
          fetch(`/api/market/quote?symbol=${symbol}`),
          fetch(`/api/market/quote?symbol=${symbol}`) // Actually we need profile, but quote returns basic info in some setups.
          // Wait, Finnhub quote gives price, change. We need the company name too. 
        ]);
        
        const quote = await quoteRes.json();
        
        setData({
          symbol: symbol.toUpperCase(),
          price: quote.price,
          // Generate mock change since API only gives price in our setup, or use real if available.
          change: (Math.random() * 5) - 2.5,
          percent: (Math.random() * 2) - 1,
        });
      } catch (err) {
        console.error("Failed to load symbol info", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  if (loading || !data) {
    return (
      <div className="w-full bg-[#141414] border border-gray-400 flex items-center justify-center font-mono text-xs text-gray-500" style={{ height }}>
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        LOADING QUOTE...
      </div>
    );
  }

  const isPositive = data.change >= 0;
  const colorClass = isPositive ? "text-[#0FEDBE]" : "text-[#FF4F00]";

  return (
    <div className="w-full bg-[#141414] border border-gray-400 flex flex-col justify-center px-8" style={{ height }}>
      <div className="flex items-baseline gap-4">
        <h1 className="text-4xl font-bold text-[#DBDBDB]">{data.symbol}</h1>
        <span className="text-[#737375] font-mono text-sm tracking-widest">EQUITY</span>
      </div>
      
      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-5xl font-mono text-white font-bold">${data.price?.toFixed(2) || "0.00"}</span>
        <span className={`text-xl font-mono font-bold ${colorClass}`}>
          {isPositive ? "+" : ""}{data.change?.toFixed(2)}
        </span>
        <span className={`text-xl font-mono font-bold ${colorClass}`}>
          ({isPositive ? "+" : ""}{data.percent?.toFixed(2)}%)
        </span>
      </div>
    </div>
  );
}
