import React from "react";
import Link from "next/link";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSimulations } from "@/lib/actions/sandbox.actions";
import { Play, History, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function SandboxLandingPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  const history = await getUserSimulations(session.user.id);
  
  const totalGames = history.length;
  const wins = history.filter((h: any) => h.outcome === "CORRECT").length;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(0) : 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-300">
      
      {/* HEADER & START BUTTON */}
      <div className="bento-card p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/50 shadow-[4px_4px_0px_rgba(255,79,0,0.5)]">
        <div className="flex flex-col gap-2 max-w-xl">
          <h1 className="text-3xl font-bold font-serif text-white tracking-tighter flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-primary" />
            ZENITH.SANDBOX
          </h1>
          <p className="text-sm font-mono text-gray-400 uppercase leading-relaxed">
            TEST YOUR MARKET INSTINCTS AGAINST HISTORICAL SCENARIOS. YOU WILL BE PRESENTED WITH REAL CHART DATA AND NEWS FROM A HIDDEN POINT IN THE PAST. DECIDE WHETHER TO BUY OR SELL, AND RECEIVE INSTANT AI EVALUATION OF YOUR TRADE.
          </p>
        </div>
        
        <Link href="/sandbox/play" className="w-full md:w-auto">
          <Button className="w-full md:w-auto h-14 px-8 text-black bg-primary hover:bg-orange-500 font-mono font-bold tracking-widest uppercase shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all">
            <Play className="w-5 h-5 mr-2 fill-current" />
            INITIATE SCENARIO
          </Button>
        </Link>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-400 divide-y md:divide-y-0 md:divide-x divide-gray-400 bg-gray-900 shadow-[4px_4px_0px_#000]">
        <div className="p-6 flex flex-col gap-2">
          <span className="label-caps text-gray-500 text-xs">SIMULATIONS RUN</span>
          <span className="text-4xl text-white font-bold font-mono">{totalGames}</span>
        </div>
        <div className="p-6 flex flex-col gap-2">
          <span className="label-caps text-gray-500 text-xs">CORRECT PREDICTIONS</span>
          <span className="text-4xl text-green-500 font-bold font-mono">{wins}</span>
        </div>
        <div className="p-6 flex flex-col gap-2 bg-gray-950">
          <span className="label-caps text-gray-500 text-xs">PREDICTION ACCURACY</span>
          <span className="text-4xl text-white font-bold font-mono">{winRate}%</span>
        </div>
      </div>

      {/* HISTORY TABLE */}
      <div className="bento-card p-0 overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h3 className="label-caps text-white flex items-center gap-2">
            <History className="w-4 h-4 text-primary" />
            SIMULATION HISTORY
          </h3>
        </div>
        
        {history.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500 font-mono uppercase text-sm">
            NO SIMULATIONS RECORDED YET. CLICK "INITIATE SCENARIO" TO START.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs text-left">
              <thead className="bg-gray-950 text-gray-500 uppercase border-b border-gray-800">
                <tr>
                  <th className="p-4">DATE PLAYED</th>
                  <th className="p-4">ASSET</th>
                  <th className="p-4">SCENARIO DATE</th>
                  <th className="p-4">DECISION</th>
                  <th className="p-4">OUTCOME</th>
                  <th className="p-4">AI ANALYSIS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-gray-900/40">
                {history.map((game: any) => (
                  <tr key={game._id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-4 text-gray-400 whitespace-nowrap">
                      {new Date(game.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-white text-base">{game.symbol}</td>
                    <td className="p-4 text-gray-400 whitespace-nowrap">
                      {new Date(game.scenarioDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold">
                      <span className={game.decision === "BUY" ? "text-green-500" : "text-red-500"}>
                        {game.decision}
                      </span>
                    </td>
                    <td className="p-4">
                      {game.outcome === "CORRECT" ? (
                        <span className="flex items-center gap-1.5 text-green-500 font-bold bg-green-500/10 px-2 py-1 w-fit rounded-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CORRECT
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-500 font-bold bg-red-500/10 px-2 py-1 w-fit rounded-sm">
                          <XCircle className="w-3.5 h-3.5" /> INCORRECT
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-gray-400 min-w-[300px] leading-relaxed">
                      {game.aiAnalysis}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
