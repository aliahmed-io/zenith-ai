"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getRecommendationTrends } from "@/lib/actions/finnhub.actions";

export default function NativeTechnicalAnalysis({ symbol, height = 400 }: { symbol: string, height?: number }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const trends = await getRecommendationTrends(symbol);
        setData(trends);
      } catch (err) {
        console.error("Failed to load technicals", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  return (
    <div className="w-full bg-[#141414] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="p-4 border-b border-gray-800 bg-[#0F0F0F] shrink-0">
        <h3 className="text-[#DBDBDB] font-bold text-sm uppercase">TECHNICAL ANALYSIS: {symbol}</h3>
      </div>
      
      <div className="flex-1 p-6 flex flex-col justify-center">
        {loading ? (
          <div className="h-full flex items-center justify-center font-mono text-xs text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            COMPUTING GAUGE...
          </div>
        ) : !data ? (
          <div className="h-full flex items-center justify-center text-[#DBDBDB] text-xs font-mono">No analysis data available.</div>
        ) : (
          <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
            {/* Custom Brutalist Gauge */}
            <div className="w-full flex flex-col gap-2 relative mt-4">
              <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase font-bold tracking-widest mb-1">
                <span>Strong Sell</span>
                <span>Neutral</span>
                <span>Strong Buy</span>
              </div>
              <div className="flex h-8 w-full">
                <div className="bg-[#FF4F00]" style={{ flex: (data.strongSell || 0) + (data.sell || 0) || 1 }}></div>
                <div className="bg-[#737375]" style={{ flex: data.hold || 1 }}></div>
                <div className="bg-[#0FEDBE]" style={{ flex: (data.strongBuy || 0) + (data.buy || 0) || 1 }}></div>
              </div>
            </div>

            <div className="grid grid-cols-3 w-full text-center divide-x divide-gray-800 border border-gray-800">
              <div className="p-3 bg-gray-950 flex flex-col">
                <span className="text-xl font-bold font-mono text-[#FF4F00]">{(data.strongSell || 0) + (data.sell || 0)}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Sell</span>
              </div>
              <div className="p-3 bg-gray-950 flex flex-col">
                <span className="text-xl font-bold font-mono text-[#737375]">{data.hold || 0}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Neutral</span>
              </div>
              <div className="p-3 bg-gray-950 flex flex-col">
                <span className="text-xl font-bold font-mono text-[#0FEDBE]">{(data.strongBuy || 0) + (data.buy || 0)}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Buy</span>
              </div>
            </div>

            <div className="w-full text-center border-t border-gray-800 pt-6">
              <p className="text-xs text-gray-400 font-mono">ANALYST CONSENSUS</p>
              <h2 className={`text-3xl font-bold uppercase tracking-widest mt-2 ${
                ((data.strongBuy || 0) + (data.buy || 0)) > ((data.strongSell || 0) + (data.sell || 0)) ? "text-[#0FEDBE]" : 
                ((data.strongSell || 0) + (data.sell || 0)) > ((data.strongBuy || 0) + (data.buy || 0)) ? "text-[#FF4F00]" : "text-[#737375]"
              }`}>
                {((data.strongBuy || 0) + (data.buy || 0)) > ((data.strongSell || 0) + (data.sell || 0)) ? "BUY" : 
                 ((data.strongSell || 0) + (data.sell || 0)) > ((data.strongBuy || 0) + (data.buy || 0)) ? "SELL" : "NEUTRAL"}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
