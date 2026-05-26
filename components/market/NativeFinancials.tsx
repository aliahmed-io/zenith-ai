"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getCompanyMetrics } from "@/lib/actions/finnhub.actions";

export default function NativeFinancials({ symbol, height = 464 }: { symbol: string, height?: number }) {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCompanyMetrics(symbol);
        setMetrics(data);
      } catch (err) {
        console.error("Failed to load metrics", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  return (
    <div className="w-full bg-[#141414] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="p-4 border-b border-gray-800 bg-[#0F0F0F] shrink-0">
        <h3 className="text-[#DBDBDB] font-bold text-sm uppercase">KEY FINANCIAL METRICS: {symbol}</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center font-mono text-xs text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            LOADING FINANCIALS...
          </div>
        ) : !metrics ? (
          <div className="h-full flex items-center justify-center text-[#DBDBDB] text-xs font-mono">No financial data available.</div>
        ) : (
          <table className="w-full text-left font-mono text-sm">
            <tbody className="divide-y divide-[#262626]">
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">52 Week High</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">${metrics["52WeekHigh"]?.toFixed(2) || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">52 Week Low</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">${metrics["52WeekLow"]?.toFixed(2) || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">Market Cap</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">${metrics["marketCapitalization"]?.toFixed(2) || "N/A"} M</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">P/E Ratio (TTM)</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">{metrics["peTTM"]?.toFixed(2) || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">EPS (TTM)</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">${metrics["epsTTM"]?.toFixed(2) || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">Dividend Yield</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">{metrics["dividendYieldIndicatedAnnual"]?.toFixed(2) || "0"}%</td>
              </tr>
              <tr className="hover:bg-gray-900/50 transition-colors">
                <td className="p-4 text-gray-500">Beta</td>
                <td className="p-4 text-[#DBDBDB] text-right font-bold">{metrics["beta"]?.toFixed(2) || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
