"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Swords,
  Search,
  Loader2,
  Trophy,
  RotateCcw,
} from "lucide-react";

interface DebateMessage {
  side: "BULL" | "BEAR";
  round: number;
  argument: string;
}

export default function DebatePage() {
  const [symbol, setSymbol] = useState("");
  const [activeSymbol, setActiveSymbol] = useState("");
  const [debate, setDebate] = useState<DebateMessage[]>([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vote, setVote] = useState<"BULL" | "BEAR" | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const debateEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleCount > 0 && debateEndRef.current) {
      debateEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [visibleCount]);

  const runDebate = useCallback(async () => {
    const trimmed = symbol.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setDebate([]);
    setVisibleCount(0);
    setError("");
    setVote(null);
    setToastVisible(false);
    setActiveSymbol(trimmed);

    try {
      const res = await fetch("/api/ai/debate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Failed to generate debate.");
      }

      const data = await res.json();
      const messages: DebateMessage[] = data.debate;
      setDebate(messages);

      // Stagger-reveal each message
      messages.forEach((_, i) => {
        setTimeout(() => {
          setVisibleCount((prev) => Math.max(prev, i + 1));
        }, (i + 1) * 600);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runDebate();
  };

  const handleVote = (side: "BULL" | "BEAR") => {
    setVote(side);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const handleReset = () => {
    setSymbol("");
    setActiveSymbol("");
    setDebate([]);
    setVisibleCount(0);
    setError("");
    setVote(null);
    setToastVisible(false);
  };

  const allVisible = debate.length > 0 && visibleCount >= debate.length;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="bento-card border-primary/50 shadow-[4px_4px_0px_rgba(255,79,0,0.5)] p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Swords className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold font-serif text-white tracking-tighter">
            AI STOCK DEBATE
          </h1>
        </div>
        <p className="text-sm font-mono text-gray-400 uppercase leading-relaxed max-w-2xl">
          TWO AI ANALYSTS GO HEAD-TO-HEAD. ONE BULL. ONE BEAR. THREE ROUNDS.
          ENTER A TICKER AND WATCH THE ARGUMENTS UNFOLD.
        </p>

        {/* SEARCH INPUT */}
        <form onSubmit={handleSubmit} className="flex gap-0 mt-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="ENTER TICKER (E.G. AAPL)"
              maxLength={10}
              disabled={loading}
              className="w-full h-12 pl-11 pr-4 bg-gray-950 border border-gray-400 border-r-0 text-white font-mono text-sm uppercase tracking-wider placeholder:text-gray-600 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              aria-label="Stock ticker symbol"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !symbol.trim()}
            className="h-12 px-6 bg-primary text-black font-mono font-bold tracking-widest uppercase border border-primary shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "DEBATE"
            )}
          </button>
        </form>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="border border-red-500/50 bg-red-500/10 p-4 font-mono text-sm text-red-400 uppercase shadow-[4px_4px_0px_#000]">
          {error}
        </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="bento-card p-12 flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <Swords className="w-12 h-12 text-primary animate-pulse" />
          </div>
          <p className="text-white font-mono font-bold text-lg tracking-widest uppercase animate-pulse">
            ASSEMBLING ANALYSTS...
          </p>
          <p className="text-gray-500 font-mono text-xs uppercase">
            GENERATING {activeSymbol} DEBATE — 3 ROUNDS
          </p>
        </div>
      )}

      {/* DEBATE MESSAGES */}
      {debate.length > 0 && !loading && (
        <div className="flex flex-col gap-6">
          {/* Active symbol label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="label-caps text-gray-500 text-xs">DEBATING</span>
              <span className="text-white font-mono font-bold text-xl">
                {activeSymbol}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-gray-500 hover:text-primary font-mono text-xs uppercase tracking-widest transition-colors"
              aria-label="Start a new debate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              NEW DEBATE
            </button>
          </div>

          {debate.map((msg, i) => {
            const isBull = msg.side === "BULL";
            const visible = i < visibleCount;

            return (
              <div
                key={`${msg.side}-${msg.round}`}
                className={`flex ${isBull ? "justify-start" : "justify-end"} transition-all duration-500 ${
                  visible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none"
                }`}
                aria-hidden={!visible}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] border shadow-[4px_4px_0px_#000] ${
                    isBull
                      ? "bg-green-500/5 border-green-500/30"
                      : "bg-red-500/5 border-red-500/30"
                  }`}
                >
                  {/* Message header */}
                  <div
                    className={`flex items-center gap-2 px-4 py-2 border-b ${
                      isBull
                        ? "border-green-500/20 bg-green-500/10"
                        : "border-red-500/20 bg-red-500/10"
                    }`}
                  >
                    {isBull ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`font-mono font-bold text-xs tracking-widest uppercase ${
                        isBull ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {msg.side}
                    </span>
                    <span className="text-gray-600 font-mono text-xs ml-auto">
                      ROUND {msg.round}
                    </span>
                  </div>

                  {/* Message body */}
                  <div className="p-4">
                    <p className="text-gray-300 font-mono text-sm leading-relaxed">
                      {msg.argument}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={debateEndRef} />

          {/* VOTING SECTION */}
          {allVisible && (
            <div
              className="bento-card p-8 flex flex-col items-center gap-6 animate-in fade-in duration-500"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold font-serif text-white tracking-tighter">
                  WHO WON?
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={() => handleVote("BULL")}
                  disabled={vote !== null}
                  className={`flex-1 h-14 flex items-center justify-center gap-2 border font-mono font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000] ${
                    vote === "BULL"
                      ? "bg-green-500 text-black border-green-500"
                      : vote === "BEAR"
                        ? "bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed"
                        : "bg-green-500/10 text-green-500 border-green-500/50 hover:bg-green-500/20"
                  }`}
                  aria-label="Vote Bull Wins"
                >
                  <TrendingUp className="w-5 h-5" />
                  BULL WINS
                </button>

                <button
                  onClick={() => handleVote("BEAR")}
                  disabled={vote !== null}
                  className={`flex-1 h-14 flex items-center justify-center gap-2 border font-mono font-bold tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_#000] ${
                    vote === "BEAR"
                      ? "bg-red-500 text-black border-red-500"
                      : vote === "BULL"
                        ? "bg-gray-900 text-gray-600 border-gray-800 cursor-not-allowed"
                        : "bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20"
                  }`}
                  aria-label="Vote Bear Wins"
                >
                  <TrendingDown className="w-5 h-5" />
                  BEAR WINS
                </button>
              </div>

              {vote && (
                <p className="text-gray-500 font-mono text-xs uppercase tracking-wider animate-in fade-in duration-300">
                  YOUR VERDICT: {vote} WINS — OPINION RECORDED
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          toastVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="bg-gray-950 border border-primary/50 px-6 py-3 font-mono text-sm text-white uppercase tracking-wider shadow-[4px_4px_0px_#000] flex items-center gap-3">
          <Trophy className="w-4 h-4 text-primary" />
          VOTE RECORDED — {vote} WINS
        </div>
      </div>
    </div>
  );
}
