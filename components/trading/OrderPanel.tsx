"use client";

import React, { useState, useEffect, useCallback } from "react";
import { executeTrade } from "@/lib/actions/trading.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  Plus, 
  Minus, 
  Info, 
  LayoutDashboard, 
  PanelRightClose, 
  PanelRightOpen,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  X
} from "lucide-react";

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

interface PortfolioData {
  virtualBalance: number;
  positions: Position[];
}

interface OrderPanelProps {
  symbol: string;
}

export default function OrderPanel({ symbol }: OrderPanelProps) {
  const upperSymbol = symbol.toUpperCase();
  
  // Layout states: 'BENTO' or 'SIDEBAR'
  const [layout, setLayout] = useState<"BENTO" | "SIDEBAR">("BENTO");
  const [isOpen, setIsOpen] = useState(false); // Used only in sidebar mode
  
  // Trading states
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  
  // Portfolio states
  const [portfolio, setPortfolio] = useState<PortfolioData>({ virtualBalance: 100000, positions: [] });
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  
  // Transaction alerts
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Persistence of layout choices
  useEffect(() => {
    const savedLayout = localStorage.getItem("zenith_order_panel_layout");
    if (savedLayout === "SIDEBAR" || savedLayout === "BENTO") {
      setLayout(savedLayout);
    }
  }, []);

  const toggleLayout = () => {
    const nextLayout = layout === "BENTO" ? "SIDEBAR" : "BENTO";
    setLayout(nextLayout);
    localStorage.setItem("zenith_order_panel_layout", nextLayout);
    setError(null);
    setSuccess(null);
  };

  // Fetch real-time (or mock) quote & portfolio info
  const fetchMarketAndPortfolio = useCallback(async () => {
    setFetchingPrice(true);
    try {
      // 1. Fetch current price
      const priceRes = await fetch(`/api/market/quote?symbol=${upperSymbol}`);
      if (priceRes.ok) {
        const priceData = await priceRes.json();
        setPrice(priceData.price || 0);
      }

      // 2. Fetch user portfolio
      const portfolioRes = await fetch("/api/trading/portfolio");
      if (portfolioRes.ok) {
        const portfolioData: PortfolioData = await portfolioRes.json();
        setPortfolio(portfolioData);
        
        // Find position for current symbol
        const pos = portfolioData.positions.find(
          (p) => p.symbol.toUpperCase() === upperSymbol
        );
        setCurrentPosition(pos || null);
      }
    } catch (err) {
      console.error("Failed to fetch market data:", err);
    } finally {
      setFetchingPrice(false);
    }
  }, [upperSymbol]);

  useEffect(() => {
    fetchMarketAndPortfolio();
    
    // Refresh quotes every 15 seconds
    const interval = setInterval(fetchMarketAndPortfolio, 15000);
    
    // Set listener for updates from other transactions
    const handlePortfolioUpdate = () => fetchMarketAndPortfolio();
    window.addEventListener("zenith-portfolio-update", handlePortfolioUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("zenith-portfolio-update", handlePortfolioUpdate);
    };
  }, [fetchMarketAndPortfolio]);

  const handleQtyChange = (val: number) => {
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else {
      setQuantity(Math.floor(val));
    }
  };

  const handleSetMax = () => {
    if (type === "BUY") {
      if (price > 0) {
        const maxBuy = Math.floor(portfolio.virtualBalance / price);
        setQuantity(maxBuy > 0 ? maxBuy : 1);
      }
    } else {
      if (currentPosition) {
        setQuantity(currentPosition.quantity);
      }
    }
  };

  const handleExecute = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (quantity <= 0) {
      setError("QUANTITY MUST BE 1 OR MORE.");
      setLoading(false);
      return;
    }

    try {
      const res = await executeTrade(upperSymbol, type, quantity, price);
      
      if (res.success) {
        setSuccess(`ORDER COMPLETED. TRANS_ID: ${res.transactionId}`);
        // Dispatch global event so holdings/balances tables update instantly
        window.dispatchEvent(new Event("zenith-portfolio-update"));
      } else {
        setError(res.error || "TRANSACTION REJECTED BY SIMULATOR.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "SYSTEM ERROR IN SIMULATION LEDGER.");
    } finally {
      setLoading(false);
    }
  };

  const estimatedTotal = quantity * price;

  // The actual panel content component
  const PanelContent = () => (
    <div className="flex flex-col gap-4">
      {/* BUY/SELL Stark Tabs */}
      <div className="grid grid-cols-2 gap-0 border border-gray-400">
        <button
          onClick={() => { setType("BUY"); setError(null); setSuccess(null); }}
          className={`h-11 font-mono font-bold text-sm tracking-widest border-r border-gray-400 transition-colors uppercase ${
            type === "BUY" 
              ? "bg-green-500 text-black" 
              : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          BUY Simulated
        </button>
        <button
          onClick={() => { setType("SELL"); setError(null); setSuccess(null); }}
          className={`h-11 font-mono font-bold text-sm tracking-widest transition-colors uppercase ${
            type === "SELL" 
              ? "bg-red-500 text-black" 
              : "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800"
          }`}
        >
          SELL Simulated
        </button>
      </div>

      {/* Symbol & Account State Info */}
      <div className="border border-gray-400 bg-gray-950 p-4 font-mono text-xs uppercase flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-gray-500">Asset ticker</span>
          <span className="text-white font-bold">{upperSymbol}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Execution price</span>
          <span className="text-primary font-bold flex items-center gap-1.5">
            {fetchingPrice ? <Loader2 className="w-3 h-3 animate-spin text-gray-500" /> : null}
            ${price.toFixed(2)}
          </span>
        </div>
        <div className="border-t border-gray-800 my-1"></div>
        <div className="flex justify-between">
          <span className="text-gray-500">Available simulated cash</span>
          <span className="text-white font-bold">${portfolio.virtualBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Position holdings</span>
          <span className={`${currentPosition ? "text-green-500 font-bold" : "text-gray-500"}`}>
            {currentPosition 
              ? `${currentPosition.quantity} shares @ $${currentPosition.averagePrice.toFixed(2)}` 
              : "NONE"}
          </span>
        </div>
      </div>

      {/* Input Controls */}
      <div className="flex flex-col gap-1.5">
        <label className="label-caps text-gray-500 text-xs">Simulated Order Quantity</label>
        <div className="flex gap-0 border border-gray-400 bg-gray-950">
          <button 
            onClick={() => handleQtyChange(quantity - 1)}
            disabled={quantity <= 1}
            className="w-12 h-11 flex items-center justify-center border-r border-gray-400 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-50"
          >
            <Minus className="w-4 h-4" />
          </button>
          <Input 
            type="number" 
            value={quantity}
            onChange={(e) => handleQtyChange(parseInt(e.target.value))}
            className="flex-1 h-11 border-none bg-transparent text-center font-mono font-bold text-white text-base focus-visible:ring-0 focus-visible:ring-offset-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            min="1"
          />
          <button 
            onClick={() => handleQtyChange(quantity + 1)}
            className="w-12 h-11 flex items-center justify-center border-l border-gray-400 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Cost Estimator & Order Settings */}
      <div className="flex justify-between items-center border border-gray-400 bg-gray-950 p-4 font-mono">
        <div>
          <span className="label-caps text-gray-500 text-xs block mb-1">Estimated simulated total</span>
          <span className="text-xl text-white font-bold">${estimatedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
        </div>
        <button
          onClick={handleSetMax}
          className="h-9 px-4 border border-primary text-primary hover:bg-primary hover:text-black font-bold text-xs uppercase transition-colors"
        >
          SET MAX
        </button>
      </div>

      {/* Errors & Alerts */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 font-mono text-xs uppercase flex gap-3.5 items-start animate-in fade-in">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-500 p-4 font-mono text-xs uppercase flex gap-3.5 items-start animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p className="break-all">{success}</p>
        </div>
      )}

      {/* Main Execute Button */}
      <Button
        onClick={handleExecute}
        disabled={loading || price === 0}
        className={`w-full h-12 font-mono font-bold tracking-widest text-sm uppercase shadow-[4px_4px_0px_#000] active:shadow-[0px_0px_0px_#000] active:translate-y-[4px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all border ${
          type === "BUY"
            ? "bg-green-500 text-black border-green-500"
            : "bg-red-500 text-black border-red-500"
        } disabled:opacity-50 disabled:pointer-events-none`}
      >
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {loading ? "TRANSACTING..." : `EXECUTE SIMULATED ${type}`}
      </Button>

      {/* Educational notice */}
      <p className="text-[10px] text-gray-600 font-mono text-center uppercase tracking-wider flex items-center justify-center gap-1 my-1">
        <Info className="w-3.5 h-3.5" /> EDUCATIONAL PAPER SIMULATION ONLY. NO REAL FUNDS INVOLVED.
      </p>
    </div>
  );

  // Render layouts
  if (layout === "SIDEBAR") {
    return (
      <>
        {/* Floating Sidebar Toggle Widget inside Grid */}
        <div className="bento-card p-6 flex flex-col justify-between h-[180px]">
          <div>
            <div className="flex justify-between items-start">
              <h3 className="label-caps text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                SIMULATED LEDGER PANEL
              </h3>
              <button 
                onClick={toggleLayout}
                className="text-xs text-gray-500 hover:text-white font-mono uppercase"
              >
                [ USE BENTO ]
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-mono uppercase leading-relaxed">
              OPEN TERMINAL TO INITIATE PAPER POSITION BUY OR SELL EXECUTIONS.
            </p>
          </div>
          <Button 
            onClick={() => setIsOpen(true)}
            className="primary-btn w-full h-10 flex items-center justify-center gap-2 text-xs uppercase"
          >
            <PanelRightOpen className="w-4 h-4" />
            OPEN EXECUTION PANEL
          </Button>
        </div>

        {/* Sidebar Overlay Drawer */}
        <div 
          className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsOpen(false)}
        >
          <div 
            className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gray-900 border-l border-gray-400 p-6 flex flex-col gap-6 shadow-[2xl] transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header controls inside sidebar */}
            <div className="flex justify-between items-center border-b border-gray-800 pb-4">
              <div>
                <h2 className="text-xl font-bold font-serif text-white tracking-tighter">ZENITH.SIMULATOR</h2>
                <p className="text-[10px] text-gray-500 font-mono uppercase mt-0.5">PORTFOLIO DEPLOYMENT TERMINAL</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLayout}
                  title="Switch to bento grid layout"
                  className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:border-white text-gray-400 hover:text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close sidebar"
                  className="w-8 h-8 flex items-center justify-center border border-gray-700 hover:border-white text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main content in Sidebar */}
            <PanelContent />
          </div>
        </div>
      </>
    );
  }

  // Bento Card Layout (Default)
  return (
    <div className="bento-card p-6 flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3">
        <h3 className="label-caps text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          SIMULATED TERMINAL WIDGET
        </h3>
        <button 
          onClick={toggleLayout}
          className="text-[10px] text-gray-500 hover:text-white font-mono uppercase tracking-wider flex items-center gap-1.5"
        >
          <PanelRightClose className="w-3.5 h-3.5" />
          [ USE SIDEBAR ]
        </button>
      </div>

      <PanelContent />
    </div>
  );
}
