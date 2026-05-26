"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Treemap, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { POPULAR_STOCK_SYMBOLS } from "@/lib/constants";

const SECTOR_MAP: Record<string, string> = {
  AAPL: "Technology", MSFT: "Technology", GOOGL: "Technology", META: "Technology", NVDA: "Technology", ORCL: "Technology", CRM: "Technology", INTC: "Technology", AMD: "Technology",
  AMZN: "Consumer", TSLA: "Consumer", NFLX: "Consumer", UBER: "Consumer", DASH: "Consumer", ABNB: "Consumer",
  PYPL: "Finance", SQ: "Finance", COIN: "Finance",
};

export default function NativeHeatmap({ height = 600 }: { height?: number }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const topSymbols = POPULAR_STOCK_SYMBOLS.slice(0, 20);
        const promises = topSymbols.map(async (symbol) => {
          const res = await fetch(`/api/market/quote?symbol=${symbol}`);
          if (!res.ok) return null;
          const quote = await res.json();
          const mockPercent = (Math.random() * 6) - 3;
          const size = Math.floor(Math.random() * 1000) + 100;
          
          return {
            name: symbol,
            sector: SECTOR_MAP[symbol] || "Other",
            size: size,
            price: quote.price,
            changePercent: mockPercent // Renamed from percent
          };
        });
        
        const results = await Promise.all(promises);
        const validResults = results.filter(Boolean);
        
        const grouped: Record<string, any> = {};
        validResults.forEach((item: any) => {
          if (!grouped[item.sector]) {
            grouped[item.sector] = { name: item.sector, children: [] };
          }
          grouped[item.sector].children.push(item);
        });
        
        // Pass array of sectors as root data
        setData(Object.values(grouped));
      } catch (err) {
        console.error("Failed to load heatmap data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const CustomContent = (props: any) => {
    const { depth, x, y, width, height, name, changePercent, children } = props;
    
    // Draw Sector Container (Depth 1)
    if (depth === 1) {
      return (
        <g>
          <rect x={x} y={y} width={width} height={height} fill="none" stroke="#141414" strokeWidth={6} />
          {width > 100 && height > 40 && (
            <text x={x + 12} y={y + 24} fill="#DBDBDB" fontSize={12} fontWeight="bold" opacity={0.6} className="uppercase font-sans tracking-widest pointer-events-none">
              {name}
            </text>
          )}
        </g>
      );
    }

    if (depth === 2 && !children) {
      let bgColor = "#141414";
      if (changePercent > 1.5) bgColor = "#0FEDBE";
      else if (changePercent > 0) bgColor = "#0A6B56";
      else if (changePercent < -1.5) bgColor = "#FF4F00";
      else bgColor = "#8B2B00";

      return (
        <g>
          <rect
            x={x + 1}
            y={y + 1}
            width={Math.max(0, width - 2)}
            height={Math.max(0, height - 2)}
            style={{
              fill: bgColor,
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
            onClick={() => window.location.href = `/stocks/${name}`}
          />
          {width > 50 && height > 30 && (
            <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#141414" fontSize={14} fontWeight="bold" fontFamily="monospace" className="pointer-events-none">
              {name}
            </text>
          )}
          {width > 50 && height > 50 && (
            <text x={x + width / 2} y={y + height / 2 + 15} textAnchor="middle" fill="#141414" fontSize={12} fontFamily="monospace" className="pointer-events-none">
              {changePercent > 0 ? "+" : ""}{changePercent?.toFixed(2)}%
            </text>
          )}
        </g>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-950 border border-gray-400 p-3 font-mono text-xs shadow-xl z-50">
          <p className="text-white font-bold text-lg">{data.name}</p>
          <p className="text-gray-400">Sector: {data.sector}</p>
          <p className="text-white mt-2">Price: ${data.price?.toFixed(2)}</p>
          <p className={`font-bold mt-1 ${data.changePercent >= 0 ? "text-[#0FEDBE]" : "text-[#FF4F00]"}`}>
            Change: {data.changePercent >= 0 ? "+" : ""}{data.changePercent?.toFixed(2)}%
          </p>
          <p className="text-gray-500 mt-2 text-[10px]">Click to Trade</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#141414] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="p-4 border-b border-[#262626] bg-[#0F0F0F] shrink-0">
        <h3 className="text-[#DBDBDB] font-bold text-sm uppercase">STOCK HEATMAP (TOP 20)</h3>
      </div>
      
      <div className="flex-1 w-full bg-[#141414] relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-gray-500 z-10 bg-[#141414]/80">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            GENERATING HEATMAP...
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={<CustomContent />}
            isAnimationActive={false}
          >
            <RechartsTooltip content={<CustomTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
