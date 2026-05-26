"use client";

import React, { useState } from "react";
import { evaluateSandboxDecision } from "@/lib/actions/sandbox.actions";
import { createChart, CandlestickSeries, ColorType, Time } from "lightweight-charts";
import { Loader2, TrendingUp, TrendingDown, Clock, Newspaper, ArrowRight, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SandboxPlayArea({ scenario, userId }: { scenario: any, userId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const chartContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let chart: any;
    
    if (chartContainerRef.current && scenario.candles) {
      chartContainerRef.current.innerHTML = "";
      chart = createChart(chartContainerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: "#141414" },
          textColor: "#DBDBDB",
          fontFamily: "monospace",
        },
        grid: {
          vertLines: { color: "#262626", style: 3 },
          horzLines: { color: "#262626", style: 3 },
        },
        crosshair: {
          mode: 1,
          vertLine: { color: "#737375", width: 1, style: 1 },
          horzLine: { color: "#737375", width: 1, style: 1 },
        },
        timeScale: {
          borderColor: "#404040",
          timeVisible: true,
        },
        rightPriceScale: {
          borderColor: "#404040",
        },
        height: 500,
        autoSize: true,
      });

      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#0FEDBE",
        downColor: "#FF4F00",
        borderVisible: false,
        wickUpColor: "#0FEDBE",
        wickDownColor: "#FF4F00",
      });

      const uniqueData = Array.from(new Map(scenario.candles.map((item: any) => [item.time, item])).values())
        .sort((a: any, b: any) => a.time - b.time);

      const formattedData = uniqueData.map((d: any) => ({
        time: d.time as Time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));

      candlestickSeries.setData(formattedData);

      // If we have the result, render the future candles too!
      if (result && result.actualFutureData && result.actualFutureData.length > 0) {
         // Create a second series for the "revealed" future to highlight it
         const futureSeries = chart.addSeries(CandlestickSeries, {
            upColor: "#1e3a8a", // Blue for future
            downColor: "#7f1d1d", // Dark red for future
            borderVisible: false,
            wickUpColor: "#1e3a8a",
            wickDownColor: "#7f1d1d",
          });
          
          const futureFormatted = result.actualFutureData.map((d: any) => ({
            time: d.time as Time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));
          
          futureSeries.setData(futureFormatted);
      }

      chart.timeScale().fitContent();
    }

    return () => {
      if (chart) chart.remove();
    };
  }, [scenario, result]);

  const handleDecision = async (decision: "BUY" | "SELL") => {
    setLoading(true);
    try {
      const evaluation = await evaluateSandboxDecision(userId, scenario.symbol, scenario.scenarioDate, decision);
      setResult(evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in">
      
      {/* Header Info */}
      <div className="flex justify-between items-center border border-gray-400 bg-gray-900 shadow-[4px_4px_0px_#000] p-6">
        <div>
          <h2 className="text-3xl font-bold font-serif text-white tracking-tighter">
            {scenario.symbol}
          </h2>
          <p className="text-sm text-gray-500 font-mono uppercase mt-1">
            Historical Scenario <span className="text-primary">(Hidden Date)</span>
          </p>
        </div>
        
        {!result && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-mono uppercase animate-pulse">
              ANALYZING DATA...
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Chart & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bento-card p-0 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="label-caps text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                PRICE ACTION LEADING UP TO DECISION
              </h3>
            </div>
            <div className="w-full bg-gray-950 relative" style={{ height: 500 }}>
              <div ref={chartContainerRef} className="w-full h-full" />
            </div>
          </div>

          {/* Action Panel */}
          {!result ? (
            <div className="grid grid-cols-2 gap-4">
              <Button 
                onClick={() => handleDecision("BUY")}
                disabled={loading}
                className="h-16 text-xl bg-green-500 text-black hover:bg-green-600 font-mono font-bold tracking-widest shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "BUY ASSET"}
              </Button>
              <Button 
                onClick={() => handleDecision("SELL")}
                disabled={loading}
                className="h-16 text-xl bg-red-500 text-black hover:bg-red-600 font-mono font-bold tracking-widest shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "SELL ASSET"}
              </Button>
            </div>
          ) : (
            <div className="border border-gray-400 bg-gray-900 shadow-[4px_4px_0px_#000] p-8 flex flex-col gap-6 animate-in zoom-in-95 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold font-serif text-white tracking-tighter">
                  SIMULATION COMPLETE
                </h3>
                <span className={`px-4 py-2 font-mono font-bold text-lg uppercase shadow-[2px_2px_0px_#000] border ${
                  result.outcome === "CORRECT" ? "bg-green-500 text-black border-green-500" : "bg-red-500 text-black border-red-500"
                }`}>
                  {result.outcome}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-y border-gray-800 py-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-mono uppercase">Price at Decision</span>
                  <span className="text-2xl text-white font-mono">${result.priceAtDecision.toFixed(2)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-mono uppercase">Price 30 Days Later</span>
                  <span className="text-2xl text-white font-mono">${result.priceAfter30Days.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-xs text-primary font-mono uppercase flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4" />
                  AI MENTOR ANALYSIS
                </span>
                <p className="text-sm font-mono text-gray-300 leading-relaxed border border-gray-800 bg-gray-950 p-4">
                  {result.aiAnalysis}
                </p>
              </div>

              <Button 
                onClick={() => window.location.href = '/sandbox'}
                className="w-full h-12 bg-primary text-black font-mono font-bold uppercase hover:bg-orange-500"
              >
                RETURN TO HISTORY
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: News */}
        <div className="lg:col-span-1 bento-card p-0 flex flex-col max-h-[800px]">
          <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
            <h3 className="label-caps text-white flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-primary" />
              AVAILABLE NEWS CONTEXT
            </h3>
          </div>
          <div className="overflow-y-auto p-4 flex flex-col gap-4">
            {scenario.news && scenario.news.length > 0 ? (
              scenario.news.map((item: any, idx: number) => (
                <div key={idx} className="border border-gray-800 bg-gray-950 p-4 flex flex-col gap-2 hover:border-gray-600 transition-colors">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">
                     {Math.floor((new Date(scenario.scenarioDate).getTime() - item.datetime * 1000) / (1000 * 60 * 60 * 24))} DAYS BEFORE DECISION
                  </span>
                  <h4 className="text-sm font-bold text-white leading-snug">{item.headline}</h4>
                  <p className="text-xs text-gray-400 font-mono line-clamp-3 leading-relaxed">{item.summary}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 font-mono text-xs uppercase p-4">
                No major news events found prior to this date.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
