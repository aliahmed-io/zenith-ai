import Link from "next/link";
import { 
  ArrowRight, 
  Activity, 
  Globe, 
  Shield, 
  Terminal, 
  Cpu, 
  Workflow, 
  Mail, 
  Check,
  ArrowUpRight,
  TrendingUp,
  Sliders,
  Sparkles
} from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-400 font-mono relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#e5e2e1 1px, transparent 1px), linear-gradient(90deg, #e5e2e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full border-b border-gray-400 bg-gray-900/80 backdrop-blur-sm">
        <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold font-serif text-white tracking-tighter flex items-center gap-2">
            ZENITH<span className="text-primary font-bold">.</span>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-in" className="h-10 px-6 flex items-center justify-center border border-gray-400 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-bold text-xs shadow-[2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:translate-y-[2px]">
              LOGIN
            </Link>
            <Link href="/sign-up" className="h-10 px-6 flex items-center justify-center bg-primary text-black border border-primary font-bold text-xs shadow-[2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:translate-y-[2px] hover:bg-primary/90 transition-all">
              INITIALIZE TERMINAL
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-20 flex-grow">
        
        {/* Section 1: Hero Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-400 bg-gray-900 shadow-[8px_8px_0px_#000]">
          
          {/* Massive Typography Box */}
          <div className="lg:col-span-12 p-8 md:p-12 border-b border-gray-400 overflow-hidden relative">
            <h1 className="text-[10vw] leading-[0.8] font-bold font-serif text-white tracking-tighter mix-blend-difference">
              VOLATILITY
            </h1>
            <h1 className="text-[10vw] leading-[0.8] font-bold font-serif text-primary tracking-tighter">
              HARNESSED.
            </h1>
            <div className="absolute top-12 right-12 hidden md:flex flex-col items-end">
              <span className="label-caps text-gray-500 mb-1">SYSTEM STATUS</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-none animate-pulse"></div>
                <span className="text-white font-bold text-xs">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Subhero Info Box 1 */}
          <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-400 flex flex-col justify-between">
            <p className="text-sm md:text-base text-gray-400 mb-10 leading-relaxed uppercase">
              A high-performance simulated market terminal built for serious capital allocators. Raw data, dynamic multi-agent intelligence, and unyielding execution speed.
            </p>
            <Link href="/sign-up" className="w-fit h-14 px-8 flex items-center gap-3 bg-primary text-black font-bold text-sm border border-primary shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-y-[2px] transition-all">
              OPEN TERMINAL <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Subhero Info Box 2 (Mini Ticker) */}
          <div className="lg:col-span-7 grid grid-cols-2">
            <div className="p-8 border-r border-b border-gray-400 flex flex-col justify-between h-48 bg-gray-950/40">
              <span className="label-caps text-gray-500 text-xs">LIQUIDITY INDEX</span>
              <div>
                <div className="text-2xl text-white font-bold font-mono">14,291.02</div>
                <div className="text-primary font-bold mt-1 text-xs">+1.24% (24H)</div>
              </div>
            </div>
            <div className="p-8 border-b border-gray-400 flex flex-col justify-between h-48 bg-gray-950/40">
              <span className="label-caps text-gray-500 text-xs">NATIVE AI AGENT</span>
              <div>
                <div className="text-lg text-white font-bold mb-2">CRITIC ONLINE</div>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px] uppercase">Real-time portfolio analysis and news grounding active.</p>
              </div>
            </div>
            <div className="col-span-2 p-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-500">
                <Terminal className="w-5 h-5" />
                <span className="text-xs font-bold font-mono">V 3.0.0 - TACTICAL UPDATE</span>
              </div>
              <span className="label-caps text-gray-600 text-xs">ENCRYPTED LEDGER</span>
            </div>
          </div>
        </div>

        {/* Feature Stark Bento Row */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-400 bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-400 shadow-[4px_4px_0px_#000]">
          <div className="p-8 flex flex-col gap-4">
            <Activity className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-serif text-white font-bold">RAW DATA</h3>
            <p className="text-xs text-gray-400 leading-relaxed uppercase">Unfiltered market feeds. We don&apos;t smooth the noise, we give you the tools to exploit it.</p>
          </div>
          <div className="p-8 flex flex-col gap-4">
            <Globe className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-serif text-white font-bold">LIVE AI GROUNDING</h3>
            <p className="text-xs text-gray-400 leading-relaxed uppercase">Our native AI doesn&apos;t guess. It queries global financial news instantly to explain market movements.</p>
          </div>
          <div className="p-8 flex flex-col gap-4">
            <Shield className="w-8 h-8 text-primary" />
            <h3 className="text-xl font-serif text-white font-bold">TACTICAL UX</h3>
            <p className="text-xs text-gray-400 leading-relaxed uppercase">Built on a strict Bento Grid. No wasted space, no rounded corners. Pure structural efficiency.</p>
          </div>
        </div>

        {/* SECTION 2: Dynamic Terminal bento Preview (NEW) */}
        <div className="mt-24 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="label-caps text-primary text-xs tracking-widest font-bold">{"// INTERACTIVE WORKSPACE"}</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-tighter">THE MODULAR BENTO WORKSPACE</h2>
            <p className="text-xs md:text-sm text-gray-500 uppercase max-w-xl">Customize your trading setup with precision. Place widgets side-by-side or trigger floating sidebar drawers dynamically.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-400 bg-gray-900 shadow-[6px_6px_0px_#000] divide-y lg:divide-y-0 lg:divide-x divide-gray-400">
            {/* Chart Widget Visualizer */}
            <div className="lg:col-span-8 p-6 flex flex-col gap-4 bg-gray-950/20">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="label-caps text-white text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-none animate-pulse"></span>
                  CANDLESTICK CHART: AAPL
                </span>
                <span className="text-[10px] text-gray-500 font-mono">1D INTERVAL</span>
              </div>
              {/* Simulated Chart Bars */}
              <div className="h-64 flex items-end justify-between gap-1.5 p-4 border border-gray-800 bg-gray-950 font-mono text-[9px] relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" 
                     style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>
                {/* 10 mock chart bars */}
                {[55, 35, 60, 48, 72, 85, 68, 92, 105, 120].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center z-10" style={{ height: `${h}%` }}>
                    <div className={`w-0.5 h-4 ${i % 2 === 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                    <div className={`w-full flex-grow ${i % 2 === 0 ? "bg-green-500/80 border border-green-500" : "bg-red-500/80 border border-red-500"}`}></div>
                    <div className={`w-0.5 h-3 ${i % 2 === 0 ? "bg-green-500" : "bg-red-500"}`}></div>
                  </div>
                ))}
                {/* Price tag */}
                <div className="absolute right-4 top-1/4 bg-primary text-black font-bold px-2 py-0.5 z-20 text-[10px] shadow-[2px_2px_0px_#000]">
                  $182.42
                </div>
              </div>
            </div>

            {/* Trading Slip Widget Visualizer */}
            <div className="lg:col-span-4 p-6 flex flex-col gap-4 bg-gray-950/40">
              <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                <span className="label-caps text-white text-xs flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  SIMULATION TERMINAL
                </span>
                <span className="text-[9px] bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 font-bold uppercase">BENTO WIDGET</span>
              </div>
              <div className="flex flex-col gap-3 font-mono text-[11px]">
                {/* BUY/SELL Toggle */}
                <div className="grid grid-cols-2 gap-0 border border-gray-800">
                  <div className="h-8 flex items-center justify-center bg-green-500 text-black font-bold uppercase">BUY</div>
                  <div className="h-8 flex items-center justify-center text-gray-500 uppercase border-l border-gray-800">SELL</div>
                </div>
                {/* Amount input */}
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-[10px] uppercase">SHARES QUANTITY</span>
                  <div className="h-9 flex items-center justify-between border border-gray-800 bg-gray-950 px-3 text-white font-bold">
                    <span>15</span>
                    <span className="text-gray-600">[ + ]</span>
                  </div>
                </div>
                {/* Cost summary */}
                <div className="border border-gray-800 bg-gray-950 p-3 flex flex-col gap-1.5 uppercase">
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>SIMULATED LIQUID CASH</span>
                    <span className="text-white font-bold">$100,000.00</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-[9px]">
                    <span>ESTIMATED ORDER COST</span>
                    <span className="text-primary font-bold">$2,736.30</span>
                  </div>
                </div>
                {/* Order execution button */}
                <div className="h-10 flex items-center justify-center bg-primary text-black font-bold uppercase cursor-pointer shadow-[2px_2px_0px_#000]">
                  EXECUTE SIMULATED ORDER
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: The LangGraph Multi-Agent Core (NEW) */}
        <div className="mt-28 flex flex-col gap-10">
          <div className="flex flex-col gap-2 items-end text-right">
            <span className="label-caps text-primary text-xs tracking-widest font-bold">{"// MULTI-AGENT INTELLIGENCE"}</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-tighter">THE LANGGRAPH ORCHESTRATOR</h2>
            <p className="text-xs md:text-sm text-gray-500 uppercase max-w-xl">Every market query is evaluated by an elite supervisor agent, which dynamically delegates to specialized sub-analysts.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border border-gray-400 bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-400 shadow-[6px_6px_0px_#000]">
            <div className="p-8 flex flex-col gap-4 bg-gray-950/20">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="label-caps text-white text-xs font-bold">1. SYSTEM SUPERVISOR</span>
                <Cpu className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
                The central coordinator node. Analyzes user queries, handles token limits, orchestrates states, and routes to analysts.
              </p>
            </div>
            <div className="p-8 flex flex-col gap-4 bg-gray-950/10">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="label-caps text-white text-xs font-bold">2. TECHNICAL ANALYST</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
                Queries price indexes, indicators (RSI, MACD), and identifies chart patterns to provide technical summaries.
              </p>
            </div>
            <div className="p-8 flex flex-col gap-4 bg-gray-950/20">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="label-caps text-white text-xs font-bold">3. SENTIMENT ANALYST</span>
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
                Scans public financial media, social channels, and news reports to map aggregate fear-and-greed sentiment indexes.
              </p>
            </div>
            <div className="p-8 flex flex-col gap-4 bg-gray-950/10">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <span className="label-caps text-white text-xs font-bold">4. PORTFOLIO AUDITOR</span>
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <p className="text-[11px] text-gray-400 uppercase leading-relaxed">
                Queries user databases and watchlists to contextually verify exposure limits and issue structural critiques.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: The simulated Paper Ledger & Risk-Free Sandbox (NEW) */}
        <div className="mt-28 grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-400 bg-gray-900 shadow-[8px_8px_0px_#000]">
          {/* Detailed features info */}
          <div className="lg:col-span-6 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-400 flex flex-col justify-between bg-gray-950/20">
            <div>
              <span className="label-caps text-primary text-xs tracking-widest font-bold block mb-2">{"// SANDBOX SIMULATION"}</span>
              <h2 className="text-3xl font-serif font-bold text-white tracking-tighter mb-4">THE IMMUTABLE LEDGER</h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed uppercase mb-8">
                Practice capital allocation without risk. Zenith initializes every terminal account with a virtual $100,000 balance. Track transactions, analyze cost-basis averages, and watch simulated net worth perform in real-time.
              </p>
              
              <div className="flex flex-col gap-3 font-mono text-xs uppercase text-white">
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Double-entry paper trade logging</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Real-time average cost basis tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Interactive positions P&L analytics</span>
                </div>
              </div>
            </div>
            
            <Link href="/sign-up" className="w-fit h-12 px-6 flex items-center gap-2 bg-transparent text-white border border-gray-400 hover:bg-gray-800 hover:text-white font-bold text-xs uppercase tracking-widest mt-10 transition-colors shadow-[2px_2px_0px_#000]">
              INITIALIZE VIRTUAL LEDGER <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Ledger Visualizer Mockup */}
          <div className="lg:col-span-6 p-8 md:p-12 flex flex-col justify-center gap-4 bg-gray-950/40">
            <span className="label-caps text-gray-500 text-xs">{"// REAL-TIME POSITIONS MONITOR"}</span>
            <div className="border border-gray-400 bg-gray-950 font-mono text-[11px] uppercase divide-y divide-gray-800">
              <div className="p-3 bg-gray-900 flex justify-between font-bold text-white">
                <span>SIMULATED ASSETS</span>
                <span className="text-primary">NET CAP: $124,204.10</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-bold text-white">AAPL (15 SHARES)</span>
                <span className="text-gray-400">COST: $182.42</span>
                <span className="text-green-500 font-bold">+$324.20 (+11.8%)</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-bold text-white">NVDA (40 SHARES)</span>
                <span className="text-gray-400">COST: $915.10</span>
                <span className="text-green-500 font-bold">+$2,410.50 (+6.5%)</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="font-bold text-white">TSLA (10 SHARES)</span>
                <span className="text-gray-400">COST: $178.90</span>
                <span className="text-red-500 font-bold">-$120.40 (-6.7%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: Asynchronous Inngest Intelligence (NEW) */}
        <div className="mt-28 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="label-caps text-primary text-xs tracking-widest font-bold">{"// BACKGROUND INTELLIGENCE"}</span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white tracking-tighter">EVENT-DRIVEN AI AUTOMATION</h2>
            <p className="text-xs md:text-sm text-gray-500 uppercase max-w-xl">Powered by Inngest. High-latency LLM tasks run reliably in the background, delivering hyper-personalized briefings directly to your inbox.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-400 bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-400 shadow-[4px_4px_0px_#000]">
            <div className="p-8 flex flex-col gap-4 bg-gray-950/20">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                <Mail className="w-5 h-5 text-primary" />
                <span className="label-caps text-white text-xs font-bold">1. WELCOME BRIEFINGS</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed uppercase">
                Upon terminal initialization, Inngest triggers an automated onboarding worker, utilizing Google Gemini to compose a custom welcome guide tailored specifically to your risk tolerance.
              </p>
            </div>
            <div className="p-8 flex flex-col gap-4 bg-gray-950/10">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                <Workflow className="w-5 h-5 text-primary" />
                <span className="label-caps text-white text-xs font-bold">2. DAILY CRITICS</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed uppercase">
                A daily cron-job gathers your watchlist assets, fetches global market developments, executes risk audits, and streams a personalized analytical digest to your email before markets open.
              </p>
            </div>
            <div className="p-8 flex flex-col gap-4 bg-gray-950/20">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="label-caps text-white text-xs font-bold">3. PRICE VOLATILITY ALERTS</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed uppercase">
                Background workers track volatility. If any asset in your simulated portfolio moves by more than 5% in a single trading session, you receive an automated, live-grounded alert report.
              </p>
            </div>
          </div>
        </div>

      </main>

      {/* SECTION 6: Stark Institutional Footer & Disclaimers (NEW) */}
      <footer className="relative z-10 w-full border-t border-gray-400 bg-gray-950 text-xs py-12 mt-20 font-mono">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
          
          {/* Logo & Info column */}
          <div className="md:col-span-4 flex flex-col gap-4 pr-0 md:pr-12 border-b md:border-b-0 md:border-r border-gray-800 pb-8 md:pb-0">
            <div className="text-xl font-bold font-serif text-white tracking-tighter">
              ZENITH<span className="text-primary font-bold">.</span>
            </div>
            <p className="text-gray-500 uppercase leading-relaxed text-[10px]">
              AN Apple-level minimalist simulated investment terminal. Built for educational strategies, multi-agent AI research, and risk-free financial testing.
            </p>
            <span className="text-gray-600 text-[10px] uppercase font-mono mt-4">
              © {new Date().getFullYear()} ZENITH PLATFORM INC. ALL RIGHTS RESERVED.
            </span>
          </div>

          {/* Directory Links column */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 px-0 md:px-12 border-b md:border-b-0 md:border-r border-gray-800 pb-8 md:pb-0 font-mono uppercase text-[10px] text-gray-400">
            <div className="flex flex-col gap-2">
              <span className="text-white font-bold mb-1 tracking-wider">{"// PLATFORM"}</span>
              <Link href="/sign-in" className="hover:text-primary transition-colors">TERMINAL</Link>
              <Link href="/sign-up" className="hover:text-primary transition-colors">INITIALIZE</Link>
              <Link href="/stockadvisor" className="hover:text-primary transition-colors">AI ADVISOR</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white font-bold mb-1 tracking-wider">{"// LEGAL"}</span>
              <Link href="#" className="hover:text-primary transition-colors">PRIVACY POLICY</Link>
              <Link href="#" className="hover:text-primary transition-colors">TERMS OF SERVICE</Link>
              <Link href="#" className="hover:text-primary transition-colors">API INTEGRATIONS</Link>
            </div>
          </div>

          {/* Legal Compliance Box */}
          <div className="md:col-span-4 px-0 md:pl-12 flex flex-col gap-3 font-mono text-[9px] uppercase leading-relaxed text-gray-600">
            <span className="text-white font-bold text-[10px] tracking-wider">{"// FINANCIAL SIMULATION DISCLOSURE"}</span>
            <div className="border border-gray-800 bg-gray-900/20 p-4 leading-relaxed">
              ZENITH IS AN EDUCATIONAL SIMULATION AND SANDBOX PLATFORM ONLY. NO REAL MONEY SECURITIES TRADING IS CONDUCTED. ALL VIRTUAL BALANCE ALLOCATIONS, TRANSACTIONS, LEDGER RECORDS, AND AI PORTFOLIO INSIGHTS ARE SIMULATED FOR RESEARCH, GAMIFICATION, AND TESTING PURPOSES. PAST MOCK PERFORMANCE CARRIES ZERO CORRELATION WITH LIVE CAPITAL MARKET INVESTMENTS.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
