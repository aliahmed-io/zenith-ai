"use client";

import { Card } from "@/components/ui/card";
import { memo, useEffect, useState, useMemo } from "react";

interface HeatmapCell {
  symbol: string;
  name: string;
  change: number;
  sector: string;
}

export const MarketHeatmap = memo(function MarketHeatmap() {
  const [marketData, setMarketData] = useState<HeatmapCell[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/market/heatmap');
        const json = await res.json();
        if (json.data) {
          setMarketData(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch heatmap data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const getColor = (change: number) => {
    if (change > 3) return "bg-green-600";
    if (change > 1.5) return "bg-green-500";
    if (change > 0) return "bg-green-400";
    if (change > -1.5) return "bg-red-400";
    if (change > -3) return "bg-red-500";
    return "bg-red-600";
  };

  const getTextColor = (change: number) => {
    return Math.abs(change) > 1 ? "text-white" : "text-gray-900";
  };

  const sectors = useMemo(
    () => Array.from(new Set(marketData.map((d) => d.sector))),
    [marketData]
  );

  if (loading && marketData.length === 0) {
    return (
      <Card className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Market Heatmap</h3>
        <p className="text-sm text-muted-foreground">
          Color intensity shows % change (Green = Up, Red = Down)
        </p>
      </div>

      <div className="space-y-6">
        {sectors.map((sector) => {
          const sectorStocks = marketData.filter(d => d.sector === sector);
          
          return (
            <div key={sector}>
              <h4 className="text-sm font-semibold mb-2 text-muted-foreground">
                {sector}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {sectorStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className={`
                      ${getColor(stock.change)}
                      ${getTextColor(stock.change)}
                      p-3 rounded-lg transition-all hover:scale-105 cursor-pointer
                      flex flex-col justify-between min-h-[80px]
                    `}
                    title={`${stock.name}: ${stock.change > 0 ? '+' : ''}${stock.change}%`}
                  >
                    <div className="font-bold text-sm">{stock.symbol}</div>
                    <div className="text-xs opacity-90 truncate">{stock.name}</div>
                    <div className="font-semibold text-sm mt-1">
                      {stock.change > 0 ? '+' : ''}{stock.change}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span>Strong Gain (&gt;3%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-400 rounded"></div>
          <span>Gain (0-3%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-400 rounded"></div>
          <span>Loss (0-3%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span>Strong Loss (&gt;3%)</span>
        </div>
      </div>
    </Card>
  );
});
