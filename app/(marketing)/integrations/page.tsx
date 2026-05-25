import Link from "next/link";
import { ArrowLeft, Cpu, Globe, Sliders, Server, Link2 } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-400 font-mono relative overflow-hidden flex flex-col justify-between p-4 md:p-8 lg:p-12">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#e5e2e1 1px, transparent 1px), linear-gradient(90deg, #e5e2e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col gap-8">
        
        {/* Navigation & Header */}
        <div className="flex flex-col gap-4 border border-gray-400 bg-gray-900 p-6 md:p-8 shadow-[4px_4px_0px_#000]">
          <Link href="/" className="w-fit flex items-center gap-2 text-xs text-primary font-bold hover:text-white transition-colors uppercase">
            <ArrowLeft className="w-4 h-4" /> [ BACK TO PORTAL ]
          </Link>
          <div className="flex items-center gap-3 mt-4 border-b border-gray-800 pb-4">
            <Link2 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tighter">API INTEGRATIONS</h1>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">ZENITH DATA FEEDS & PIPELINE SYSTEM DIRECTORY</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed uppercase">
            ACTIVE PIPELINES MONITORED BY THE CENTRAL ADVISOR ORCHESTRATOR.
          </p>
        </div>

        {/* Integration Items Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-400 bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-400 shadow-[6px_6px_0px_#000]">
          
          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="label-caps text-white text-xs font-bold">1. TRADINGVIEW COMPONENT</span>
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
              EMBEDS HIGH-PERFORMANCE INTERACTIVE HTML5 COMPONENT CHARTING, VOLATILITY WIDGETS, TECHNICAL GAUGES, MARKET OVERVIEWS, AND STOCK INDEX HEATMAPS DIRECTLY INTO CURRENT ROUTE DOMS.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="label-caps text-white text-xs font-bold">2. FINNHUB REST PIPELINE</span>
              <Sliders className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
              QUERIES RAW HISTORICAL COMPANY NEWS AND LIQUID REAL-TIME STOCK QUOTE VALUES TO DRIVE THE SIMULATED SANDBOX ACCOUNT LEDGER.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4 bg-gray-950/15">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="label-caps text-white text-xs font-bold">3. GOOGLE GEMINI LLM CORE</span>
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
              DRIVES NATIVE INTELLIGENCE INITIATIONS (PRIMARY: GEMINI-3.1-FLASH-LITE, SECURE FALLBACK: GEMINI-3.5-FLASH). INTEGRATES GOOGLE LIVE WEB NEWS SEARCH AND WATCHLIST PORTFOLIO ANALYTICS.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-4 bg-gray-950/15">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="label-caps text-white text-xs font-bold">4. INNGEST EVENT SYSTEM</span>
              <Server className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
              Background event scheduler managing scheduled welcome alerts and cron-driven daily portfolio critic logs linked to SMTP Nodemailer delivery layers.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
