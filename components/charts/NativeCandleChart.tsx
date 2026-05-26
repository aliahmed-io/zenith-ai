"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, ColorType, Time } from "lightweight-charts";
import { Loader2 } from "lucide-react";
import { getStockCandles } from "@/lib/actions/finnhub.actions";

interface NativeCandleChartProps {
  symbol: string;
  height?: number;
  className?: string;
}

export default function NativeCandleChart({ symbol, height = 600, className }: NativeCandleChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let chart: any;

    const loadDataAndRender = async () => {
      try {
        setLoading(true);
        const data = await getStockCandles(symbol, "D", 365); // Get 1 year of daily data

        if (!data || data.length === 0) {
          setError("No historical data available for " + symbol);
          setLoading(false);
          return;
        }

        if (chartContainerRef.current) {
          // Initialize chart with strict Zenith Dark Brutalist styling
          chart = createChart(chartContainerRef.current, {
            layout: {
              background: { type: ColorType.Solid, color: "#141414" },
              textColor: "#DBDBDB",
              fontFamily: "monospace",
            },
            grid: {
              vertLines: { color: "#262626", style: 3 }, // style 3 is dotted/dashed
              horzLines: { color: "#262626", style: 3 },
            },
            crosshair: {
              mode: 1, // Normal mode
              vertLine: { color: "#737375", width: 1, style: 1 },
              horzLine: { color: "#737375", width: 1, style: 1 },
            },
            timeScale: {
              borderColor: "#404040",
              timeVisible: true,
              secondsVisible: false,
            },
            rightPriceScale: {
              borderColor: "#404040",
            },
            height: height,
            autoSize: true,
          });

          const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#0FEDBE", // Zenith standard growing green
            downColor: "#FF4F00", // Zenith primary orange
            borderVisible: false,
            wickUpColor: "#0FEDBE",
            wickDownColor: "#FF4F00",
          });

          // Sort and deduplicate timestamps to ensure strictly ascending order for lightweight-charts
          const uniqueData = Array.from(new Map(data.map((item: any) => [item.time, item])).values())
            .sort((a: any, b: any) => a.time - b.time);

          const formattedData = uniqueData.map((d: any) => ({
            time: (d.time) as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));

          candlestickSeries.setData(formattedData);
          chart.timeScale().fitContent();
        }
      } catch (err) {
        console.error("Failed to render native candle chart:", err);
        setError("Chart rendering failed.");
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
  }, [symbol, height]);

  if (error) {
    return (
      <div className={`w-full flex items-center justify-center font-mono text-xs text-red-500 bg-gray-950 border border-gray-800 ${className}`} style={{ height }}>
        {error}
      </div>
    );
  }

  return (
    <div className={`relative w-full border border-gray-400 bg-gray-950 ${className}`} style={{ height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950/80 z-10 font-mono text-xs text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin text-primary mr-2" />
          LOADING RAW MARKET DATA...
        </div>
      )}
      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
}
