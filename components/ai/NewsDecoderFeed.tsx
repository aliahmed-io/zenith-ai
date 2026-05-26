"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  Zap,
  ExternalLink,
} from "lucide-react";
import type { NewsArticle } from "@/lib/actions/news-decoder.actions";

interface DecodedAnalysis {
  whatHappened: string;
  whyItMatters: string;
  affectedTickers: string[];
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
  confidence: number;
  actionItem: string;
}

interface CardState {
  loading: boolean;
  analysis: DecodedAnalysis | null;
  error: string | null;
}

function formatTimestamp(unix: number): string {
  const date = new Date(unix * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffH < 1) {
    const diffM = Math.floor(diffMs / (1000 * 60));
    return `${diffM}M AGO`;
  }
  if (diffH < 24) {
    return `${diffH}H AGO`;
  }
  const diffD = Math.floor(diffH / 24);
  return `${diffD}D AGO`;
}

function DirectionIndicator({
  direction,
}: {
  direction: "BULLISH" | "BEARISH" | "NEUTRAL";
}) {
  switch (direction) {
    case "BULLISH":
      return (
        <span className="flex items-center gap-1.5 font-mono font-bold text-green-500 bg-green-500/10 px-3 py-1.5 border border-green-500/30">
          <TrendingUp className="h-4 w-4" />
          BULLISH
        </span>
      );
    case "BEARISH":
      return (
        <span className="flex items-center gap-1.5 font-mono font-bold text-red-500 bg-red-500/10 px-3 py-1.5 border border-red-500/30">
          <TrendingDown className="h-4 w-4" />
          BEARISH
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1.5 font-mono font-bold text-gray-400 bg-gray-400/10 px-3 py-1.5 border border-gray-400/30">
          <Minus className="h-4 w-4" />
          NEUTRAL
        </span>
      );
  }
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const percentage = (confidence / 10) * 100;
  const getColor = () => {
    if (confidence >= 8) return "bg-green-500";
    if (confidence >= 5) return "bg-primary";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="label-caps text-gray-500 text-xs">CONFIDENCE</span>
        <span className="font-mono text-xs text-white font-bold">
          {confidence}/10
        </span>
      </div>
      <div className="h-2 w-full bg-gray-800 border border-gray-700">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function DecodedSection({ analysis }: { analysis: DecodedAnalysis }) {
  return (
    <div className="flex flex-col gap-4 border-t border-gray-800 pt-4 mt-2 animate-in slide-in-from-top-2 fade-in duration-300">
      {/* Direction + Confidence Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <DirectionIndicator direction={analysis.direction} />
        <div className="flex-1 w-full">
          <ConfidenceBar confidence={analysis.confidence} />
        </div>
      </div>

      {/* What Happened */}
      <div className="flex flex-col gap-1">
        <span className="label-caps text-gray-500 text-xs flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-primary" />
          WHAT HAPPENED
        </span>
        <p className="font-mono text-sm text-white leading-relaxed">
          {analysis.whatHappened}
        </p>
      </div>

      {/* Why It Matters */}
      <div className="flex flex-col gap-1">
        <span className="label-caps text-gray-500 text-xs">
          WHY IT MATTERS
        </span>
        <p className="font-mono text-sm text-gray-300 leading-relaxed">
          {analysis.whyItMatters}
        </p>
      </div>

      {/* Affected Tickers */}
      {analysis.affectedTickers.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="label-caps text-gray-500 text-xs">
            AFFECTED TICKERS
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis.affectedTickers.map((ticker) => (
              <Link
                key={ticker}
                href={`/stocks/${ticker}`}
                className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/30 px-3 py-1.5 hover:bg-primary/20 hover:border-primary/50 transition-colors"
              >
                ${ticker}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Action Item */}
      <div className="border-l-2 border-primary bg-primary/5 p-4">
        <span className="label-caps text-primary text-xs font-bold">
          ACTION ITEM
        </span>
        <p className="font-mono text-sm text-white mt-1 leading-relaxed">
          {analysis.actionItem}
        </p>
      </div>
    </div>
  );
}

export default function NewsDecoderFeed({
  articles,
}: {
  articles: NewsArticle[];
}) {
  const [cardStates, setCardStates] = useState<Record<number, CardState>>({});

  const handleDecode = useCallback(async (article: NewsArticle) => {
    setCardStates((prev) => ({
      ...prev,
      [article.id]: { loading: true, analysis: null, error: null },
    }));

    try {
      const res = await fetch("/api/ai/decode-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: article.headline,
          summary: article.summary,
        }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          (errBody as { error?: string }).error ||
            `Request failed with status ${res.status}`
        );
      }

      const data = (await res.json()) as { analysis: DecodedAnalysis };

      setCardStates((prev) => ({
        ...prev,
        [article.id]: { loading: false, analysis: data.analysis, error: null },
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to decode article";
      setCardStates((prev) => ({
        ...prev,
        [article.id]: { loading: false, analysis: null, error: message },
      }));
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article) => {
        const state = cardStates[article.id];
        const isLoading = state?.loading ?? false;
        const analysis = state?.analysis ?? null;
        const error = state?.error ?? null;
        const isDecoded = analysis !== null;

        return (
          <article
            key={article.id}
            className="bg-gray-900 border border-gray-400 shadow-[4px_4px_0px_#000] p-6 flex flex-col gap-4 transition-all duration-200"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {/* Source + Time */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="label-caps text-gray-500 text-xs">
                    {article.source}
                  </span>
                  <span className="text-gray-600 text-xs font-mono">
                    {formatTimestamp(article.datetime)}
                  </span>
                </div>

                {/* Headline */}
                <h2 className="text-white font-bold text-base leading-snug">
                  {article.headline}
                </h2>

                {/* Summary */}
                <p className="text-gray-400 text-sm font-mono leading-relaxed line-clamp-2">
                  {article.summary}
                </p>
              </div>

              {/* External Link */}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-400 transition-colors shrink-0 mt-1"
                aria-label={`Open article: ${article.headline}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Decode Button / Loading / Error */}
            {!isDecoded && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleDecode(article)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-950 border border-gray-400 font-mono font-bold text-xs uppercase tracking-widest text-white hover:bg-primary hover:text-black hover:border-primary transition-all shadow-[2px_2px_0px_#000] hover:shadow-[1px_1px_0px_#000] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-950 disabled:hover:text-white disabled:hover:border-gray-400"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      DECODING...
                    </>
                  ) : (
                    <>
                      <Newspaper className="h-3.5 w-3.5" />
                      DECODE
                    </>
                  )}
                </button>

                {error && (
                  <span className="font-mono text-xs text-red-500">
                    {error}
                  </span>
                )}
              </div>
            )}

            {/* Decoded Analysis */}
            {isDecoded && analysis && <DecodedSection analysis={analysis} />}
          </article>
        );
      })}
    </div>
  );
}
