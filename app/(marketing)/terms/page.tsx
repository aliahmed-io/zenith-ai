import Link from "next/link";
import { ArrowLeft, Scale, Info, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
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
            <Scale className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tighter">TERMS OF SERVICE</h1>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">ZENITH TERMINAL COMPLIANCE AGREEMENT</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed uppercase">
            LAST REVISED: MAY 25, 2026. BINDING FOR ALL VIRTUAL INITIALIZATIONS.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="flex flex-col gap-0 border border-gray-400 bg-gray-900 shadow-[6px_6px_0px_#000] divide-y divide-gray-400">
          
          <div className="p-6 md:p-8 flex flex-col gap-3">
            <h3 className="label-caps text-white font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              1. FINANCIAL SERVICES REGULATORY COMPLIANCE
            </h3>
            <p className="text-xs leading-relaxed uppercase text-gray-400">
              ZENITH IS NOT A REGISTERED BROKER-DEALER, REGISTERED INVESTMENT ADVISOR, OR EXCHANGE PLATFORM. WE DO NOT INTERPRET CAPITAL DATA FOR ACTUAL ADVISORY SERVICES. NOTWITHSTANDING ANY STATEMENTS MADE BY THE INTEGRATED NATIVE AI GRAPH, NO RESPONSES CONSTITUTE FINANCIAL, TAX, LEGAL, OR STRATEGIC CAPITAL ADVICE. TRADING REAL CASH IS FORBIDDEN ON THIS PLATFORM.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-3">
            <h3 className="label-caps text-white font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              2. SIMULATED ACCOUNT & CASH BOUNDS
            </h3>
            <p className="text-xs leading-relaxed uppercase text-gray-400">
              BY ACQUIRING A TERMINAL ACCOUNT, YOU ARE ALLOCATED A STATIC VIRTUAL BALANCE ($100,000.00 SIMULATED USD). THIS LIQUID ASSET IS MOCK TOKENS INJECTED INTO YOUR COOKIE SESSION DB. THESE ASSETS HAVE **ZERO REAL-WORLD MONETARY VALUATION**. THEY CANNOT BE EXCHANGED, TRANSFERRED, WITHDRAWN, OR ASSIGNED TO REAL FINANCIAL CHANNELS.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-3 bg-gray-950/25">
            <h3 className="label-caps text-white font-bold flex items-center gap-2">
              <Scale className="w-4 h-4 text-primary" />
              3. NO WARRANTY & SEVERABILITY OF MOCK VALUES
            </h3>
            <p className="text-xs leading-relaxed uppercase text-gray-400">
              ZENITH MAKES ZERO REPRESENTATIONS ON THE INTEGRITY OF EXTERNAL EMBEDDED REAL-TIME DATA (POWERED BY TRADINGVIEW WIDGETS AND FINNHUB APIs). PRICES SHOWN ARE FOR EDUCATION ONLY and MOCK DELAYS MAY OCCUR. REALIZED SIMULATED P&L CONTAINS NO FINANCIAL MERIT OR CORRELATION WITH LIVE ASSET STRATEGIES.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
