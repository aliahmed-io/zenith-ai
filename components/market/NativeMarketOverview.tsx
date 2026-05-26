"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, AreaSeries, ColorType, Time } from "lightweight-charts";
import { Loader2 } from "lucide-react";
import { getStockCandles } from "@/lib/actions/finnhub.actions";

const TABS = [
  { id: "tech", label: "Technology", symbols: ["AAPL", "MSFT", "GOOGL", "NVDA"] },
  { id: "fin", label: "Financial", symbols: ["JPM", "BAC", "WFC", "C"] },
  { id: "serv", label: "Services", symbols: ["AMZN", "WMT", "V", "T"] }
];

export default function NativeMarketOverview({ height = 600 }: { height?: number }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const [activeSymbol, setActiveSymbol] = useState(TABS[0].symbols[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let chart: any;

    const loadDataAndRender = async () => {
      try {
        setLoading(true);
        const data = await getStockCandles(activeSymbol, "D", 180); // 6 months

        if (!data || data.length === 0) {
          setError(`NO CHART DATA FOR ${activeSymbol}`);
          setLoading(false);
          return;
        }

        if (chartContainerRef.current) {
          chartContainerRef.current.innerHTML = ""; // Clear old chart
          chart = createChart(chartContainerRef.current, {
            layout: {
              background: { type: ColorType.Solid, color: "#141414" },
              textColor: "#DBDBDB",
              fontFamily: "monospace",
            },
            grid: {
              vertLines: { visible: false },
              horzLines: { color: "#262626", style: 3 },
            },
            timeScale: {
              borderColor: "#404040",
              timeVisible: false,
            },
            rightPriceScale: {
              borderColor: "#404040",
            },
            crosshair: {
              vertLine: { color: "#737375", width: 1, style: 1 },
              horzLine: { color: "#737375", width: 1, style: 1 },
            },
            height: height - 120, // Leave room for tabs and symbol list
            autoSize: true,
          });

          const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: "#0FEDBE", // Growth color
            topColor: "rgba(15, 237, 190, 0.4)",
            bottomColor: "rgba(15, 237, 190, 0.0)",
            lineWidth: 2,
          });

          // Sort strictly ascending
          const uniqueData = Array.from(new Map(data.map((item: any) => [item.time, item])).values())
            .sort((a: any, b: any) => a.time - b.time);

          const formattedData = uniqueData.map((d: any) => ({
            time: (d.time) as Time,
            value: d.close,
          }));

          // If price dropped overall, change color to orange
          if (formattedData.length > 1 && formattedData[formattedData.length - 1].value < formattedData[0].value) {
            areaSeries.applyOptions({
              lineColor: "#FF4F00",
              topColor: "rgba(255, 79, 0, 0.4)",
              bottomColor: "rgba(255, 79, 0, 0.0)",
            });
          }

          areaSeries.setData(formattedData);
          chart.timeScale().fitContent();
        }
      } catch (err) {
        console.error("Failed to render native market overview chart:", err);
        setError("ERROR RENDERING CHART");
      } finally {
        setLoading(false);
      }
    };

    loadDataAndRender();

    const handleResize = () => {
      if (chart && chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chart) {
        chart.remove();
      }
    };
  }, [activeSymbol, height]);

  return (
    <div className="w-full bg-[#141414] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="flex border-b border-gray-800 bg-[#0F0F0F]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab);
              setActiveSymbol(tab.symbols[0]);
            }}
            className={`flex-1 p-3 text-xs font-bold uppercase transition-colors ${
              activeTab.id === tab.id ? "text-[#0FEDBE] border-b-2 border-[#0FEDBE] bg-gray-900/50" : "text-gray-500 hover:text-[#DBDBDB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="flex overflow-x-auto bg-[#141414] border-b border-[#262626]">
        {activeTab.symbols.map((sym) => (
          <button
            key={sym}
            onClick={() => setActiveSymbol(sym)}
            className={`px-6 py-3 text-sm font-mono font-bold transition-colors whitespace-nowrap ${
              activeSymbol === sym ? "text-white bg-[#262626]" : "text-[#737375] hover:text-[#DBDBDB] hover:bg-gray-900/50"
            }`}
          >
            {sym}
          </button>
        ))}
      </div>

      <div className="relative flex-1 w-full bg-[#141414]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#141414]/80 z-10 font-mono text-xs text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin text-[#0FEDBE] mr-2" />
            LOADING {activeSymbol}...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#141414] z-10 font-mono text-xs text-red-500">
            {error}
          </div>
        )}
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
}
