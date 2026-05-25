import Link from "next/link";
import { ArrowLeft, Shield, Info, Lock } from "lucide-react";

export default function PrivacyPage() {
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
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tighter">PRIVACY POLICY</h1>
              <p className="text-[10px] text-gray-500 uppercase mt-0.5">ZENITH SIMULATION LEDGER COMPLIANCE BRIEF</p>
            </div>
          </div>
          <p className="text-xs leading-relaxed uppercase">
            LAST REVISED: MAY 25, 2026. EFFECTIVE FOR ALL ACTIVE TERMINAL INSTANCES.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="flex flex-col gap-0 border border-gray-400 bg-gray-900 shadow-[6px_6px_0px_#000] divide-y divide-gray-400">
          
          <div className="p-6 md:p-8 flex flex-col gap-3">
            <h3 className="label-caps text-white font-bold flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              1. FINANCIAL DATA SECURITY & DISCLOSURE
            </h3>
            <p className="text-xs leading-relaxed uppercase text-gray-400">
              ZENITH IS AN EDUCATIONAL SIMULATION ECOSYSTEM. ALL TRANSACTION LEDGERS, ACCOUNT VALUATIONS, OR CURRENT POSITIONS PROCESSED WITHIN THIS APP ARE 100% FICTIONAL AND HOLD NO REAL-WORLD CORRELATION. WE DO NOT DEPOSIT, PROCESS, OR TRANSMIT ANY ACTUAL FIAT BALANCES OR SECURITIES. NO REAL FINANCIAL KEYS OR BROKER CREDENTIALS ARE EVER COLLECTED.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-3">
            <h3 className="label-caps text-white font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              2. DATA WE ENCRYPT AND STORAGE
            </h3>
            <p className="text-xs leading-relaxed uppercase text-gray-400">
              WE ONLY RECORD VOLUNTARY CREDENTIALS REQUIRED FOR TERMINAL INITIALIZATION:
              <br />
              • AUTHENTICATION DATA: USERNAME, EMAIL ADDRESS, AND SALT-HASHED ENCRYPTED PASSWORD CREDENTIALS (POWERED SECURELY BY BETTER AUTH).
              <br />
              • SIMULATION DETAILS: USER WATCHLIST TICKER SYMBOLS, PAPER PORTFOLIO HOLDINGS, AND LEDGER TRANSACTION LOGS.
              <br />
              ALL USER SESSIONS ARE SECURED BY ENCRYPTED WEB COOKIES AND ENFORCED BY Strict database policies. WE DO NOT SELL, RENT, OR DISCLOSE DATA TO THIRD-PARTY BROKERS.
            </p>
          </div>

          <div className="p-6 md:p-8 flex flex-col gap-3 bg-gray-950/25">
            <h3 className="label-caps text-white font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              3. AI PROCESSING & PRIVACY DICTATES
            </h3>
            <p className="text-xs leading-relaxed uppercase text-gray-400">
              OUR INTEGRATED AI ENGINES (POWERED BY GOOGLE GEMINI) ANALYZE PORTFOLIOS AND TICKER SYMBOLS DYNAMICALLY TO EXPLAIN PRICE VOLATILITY. SYSTEM INFERENCES DO NOT CORRELATE WITH INDIVIDUAL IDENTIFIABLE PERSONAL INFORMATION. ALL QUERIES SENT TO THE LLM ARE RESTRICTED ENTIRELY TO STOCK SYMBOLS AND MACRO NEWS TRENDS, CONFORMING TO STRICT DATA ANONYMIZATION RULES.
            </p>
          </div>

        </div>

        {/* Footer Warning */}
        <p className="text-[10px] text-gray-600 font-mono text-center uppercase tracking-wider flex items-center justify-center gap-1.5 mt-4">
          <Lock className="w-3.5 h-3.5" /> SECURED TERMINAL PROTOCOL. NO REAL WORLD ASSETS OR BANK CHANNELS CONNECTED.
        </p>

      </div>
    </div>
  );
}
