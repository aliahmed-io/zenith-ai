"use client";

import React, { useState, useCallback } from "react";
import {
  Flame,
  Shield,
  Clock,
  Target,
  Award,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface RoastGrades {
  diversification: string;
  riskManagement: string;
  timing: string;
  conviction: string;
}

interface RoastResult {
  archetype: string;
  grades: RoastGrades;
  roast: string;
  advice: string;
}

function getGradeColor(grade: string): string {
  const g = grade.toUpperCase().charAt(0);
  if (g === "A" || g === "B") return "text-green-500";
  if (g === "C") return "text-yellow-500";
  return "text-red-500";
}

function getGradeBorderColor(grade: string): string {
  const g = grade.toUpperCase().charAt(0);
  if (g === "A" || g === "B") return "border-green-500/30";
  if (g === "C") return "border-yellow-500/30";
  return "border-red-500/30";
}

function getGradeBgColor(grade: string): string {
  const g = grade.toUpperCase().charAt(0);
  if (g === "A" || g === "B") return "bg-green-500/5";
  if (g === "C") return "bg-yellow-500/5";
  return "bg-red-500/5";
}

interface GradeCardProps {
  label: string;
  grade: string;
  icon: React.ReactNode;
}

function GradeCard({ label, grade, icon }: GradeCardProps) {
  return (
    <div
      className={`border ${getGradeBorderColor(grade)} ${getGradeBgColor(grade)} bg-gray-950 p-4 flex flex-col items-center justify-center gap-2 transition-all`}
    >
      <div className="text-gray-500">{icon}</div>
      <span className="label-caps text-gray-500 text-[10px] text-center">
        {label}
      </span>
      <span
        className={`text-4xl font-mono font-bold ${getGradeColor(grade)} tracking-tighter`}
      >
        {grade.toUpperCase()}
      </span>
    </div>
  );
}

export default function PortfolioRoast() {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoast = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await fetch("/api/ai/portfolio-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error || "Failed to roast portfolio. Try again."
        );
      }

      const data: RoastResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="bento-card flex flex-col gap-6">
      {/* Header & Trigger */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-primary" />
          <h3 className="label-caps text-white">AI PORTFOLIO ROAST</h3>
        </div>
        <button
          onClick={handleRoast}
          disabled={loading}
          className="primary-btn px-6 font-mono text-xs tracking-widest uppercase flex items-center gap-2 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              ANALYZING...
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              ROAST MY PORTFOLIO
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm font-mono text-red-500 uppercase">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && !result && (
        <div className="h-48 border border-dashed border-gray-800 bg-gray-950/50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider">
            GEMINI IS REVIEWING YOUR POSITIONS...
          </p>
          <p className="text-[10px] text-gray-600 font-mono uppercase">
            PREPARING DEVASTATION
          </p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Archetype Label */}
          <div className="border border-gray-400 bg-gray-950 p-6 flex flex-col items-center justify-center gap-3 shadow-[4px_4px_0px_#000]">
            <Award className="w-8 h-8 text-primary" />
            <span className="label-caps text-gray-500 text-[10px]">
              YOUR TRADER ARCHETYPE
            </span>
            <h2 className="text-2xl md:text-4xl font-serif text-white font-bold tracking-tighter text-center uppercase">
              {result.archetype}
            </h2>
          </div>

          {/* Grades Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-gray-400 divide-x divide-y md:divide-y-0 divide-gray-800">
            <GradeCard
              label="Diversification"
              grade={result.grades.diversification}
              icon={<Shield className="w-5 h-5" />}
            />
            <GradeCard
              label="Risk Mgmt"
              grade={result.grades.riskManagement}
              icon={<Target className="w-5 h-5" />}
            />
            <GradeCard
              label="Timing"
              grade={result.grades.timing}
              icon={<Clock className="w-5 h-5" />}
            />
            <GradeCard
              label="Conviction"
              grade={result.grades.conviction}
              icon={<Flame className="w-5 h-5" />}
            />
          </div>

          {/* Roast Text */}
          <div className="border border-gray-400 bg-gray-950 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-primary" />
              <span className="label-caps text-gray-500 text-[10px]">
                THE ROAST
              </span>
            </div>
            <p className="text-sm md:text-base text-gray-400 font-mono leading-relaxed">
              {result.roast}
            </p>
          </div>

          {/* Actionable Advice */}
          <div className="border border-primary/40 bg-primary/5 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <span className="label-caps text-primary text-[10px]">
                ACTIONABLE ADVICE
              </span>
            </div>
            <p className="text-sm md:text-base text-white font-mono leading-relaxed font-bold">
              {result.advice}
            </p>
          </div>
        </div>
      )}

      {/* Empty State - before first roast */}
      {!result && !loading && !error && (
        <div className="h-32 border border-dashed border-gray-800 bg-gray-950/50 flex flex-col items-center justify-center text-center p-6">
          <Flame className="w-6 h-6 text-gray-700 mb-2" />
          <p className="text-xs text-gray-600 font-mono uppercase tracking-wider">
            CLICK THE BUTTON ABOVE TO GET A BRUTAL AI CRITIQUE OF YOUR PORTFOLIO
          </p>
        </div>
      )}
    </div>
  );
}
