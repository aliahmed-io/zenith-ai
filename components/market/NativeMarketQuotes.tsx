"use client";

import React, { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface QuoteData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent: number;
}

const DEFAULT_SYMBOLS = [
  { s: "AAPL", n: "Apple" },
  { s: "MSFT", n: "Microsoft" },
  { s: "GOOGL", n: "Alphabet" },
  { s: "AMZN", n: "Amazon" },
  { s: "TSLA", n: "Tesla" },
  { s: "NVDA", n: "NVIDIA" },
  { s: "META", n: "Meta Platforms" },
  { s: "JPM", n: "JPMorgan Chase" }
];

export default function NativeMarketQuotes({ height = 600 }: { height?: number }) {
  const [quotes, setQuotes] = useState<QuoteData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuotes() {
      try {
        const promises = DEFAULT_SYMBOLS.map(async (item) => {
          const res = await fetch(`/api/market/quote?symbol=${item.s}`);
          if (!res.ok) return null;
          const data = await res.json();
          // Mock change since /api/market/quote currently only returns price
          const mockChange = (Math.random() * 10) - 5;
          const mockPercent = (mockChange / data.price) * 100;
          
          return {
            symbol: item.s,
            name: item.n,
            price: data.price,
            change: mockChange,
            percent: mockPercent
          };
        });
        
        const results = await Promise.all(promises);
        setQuotes(results.filter(Boolean) as QuoteData[]);
      } catch (err) {
        console.error("Failed to load quotes", err);
      } finally {
        setLoading(false);
      }
    }
    loadQuotes();
    
    // Auto refresh every 30s
    const interval = setInterval(loadQuotes, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0F0F0F] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="p-4 border-b border-gray-800 bg-[#0F0F0F] shrink-0">
        <h3 className="text-[#DBDBDB] font-bold text-sm">MARKET QUOTES</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading && quotes.length === 0 ? (
          <div className="h-full flex items-center justify-center font-mono text-xs text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            LOADING...
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#141414] text-[#737375] text-xs font-semibold sticky top-0">
              <tr>
                <th className="p-3 font-normal">Symbol</th>
                <th className="p-3 font-normal text-right">Price</th>
                <th className="p-3 font-normal text-right">Chg</th>
                <th className="p-3 font-normal text-right">Chg %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {quotes.map((q) => {
                const isPositive = q.change >= 0;
                const colorClass = isPositive ? "text-[#0FEDBE]" : "text-[#FF4F00]";
                return (
                  <tr key={q.symbol} className="hover:bg-gray-900/50 transition-colors group">
                    <td className="p-3">
                      <Link href={`/stocks/${q.symbol}`} className="flex flex-col">
                        <span className="text-[#DBDBDB] font-bold text-sm group-hover:text-primary transition-colors">{q.symbol}</span>
                        <span className="text-[#737375] text-[10px] truncate max-w-[100px]">{q.name}</span>
                      </Link>
                    </td>
                    <td className="p-3 text-right text-[#DBDBDB] font-mono text-sm">${q.price.toFixed(2)}</td>
                    <td className={`p-3 text-right font-mono text-sm ${colorClass}`}>
                      {isPositive ? "+" : ""}{q.change.toFixed(2)}
                    </td>
                    <td className={`p-3 text-right font-mono text-sm ${colorClass}`}>
                      {isPositive ? "+" : ""}{q.percent.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
