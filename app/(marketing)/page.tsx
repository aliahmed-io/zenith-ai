import Link from "next/link";
import { ArrowRight, Activity, Globe, Shield, Terminal } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-400 font-mono relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#e5e2e1 1px, transparent 1px), linear-gradient(90deg, #e5e2e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 w-full border-b border-gray-400 bg-gray-900/80 backdrop-blur-sm">
        <div className="w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold font-serif text-white tracking-tighter">ZENITH.</div>
          <div className="flex gap-4">
            <Link href="/sign-in" className="h-10 px-6 flex items-center justify-center border border-gray-400 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors font-bold text-sm shadow-[2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:translate-y-[2px]">
              LOGIN
            </Link>
            <Link href="/sign-up" className="h-10 px-6 flex items-center justify-center bg-primary text-black border border-primary font-bold text-sm shadow-[2px_2px_0px_#000] active:shadow-[0px_0px_0px_#000] active:translate-y-[2px] hover:bg-primary/90 transition-all">
              INITIALIZE TERMINAL
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border border-gray-400 bg-gray-900">
          
          {/* Massive Typography Box */}
          <div className="lg:col-span-12 p-8 md:p-12 border-b border-gray-400 overflow-hidden relative">
            <h1 className="text-[12vw] leading-[0.8] font-bold font-serif text-white tracking-tighter mix-blend-difference">
              VOLATILITY
            </h1>
            <h1 className="text-[12vw] leading-[0.8] font-bold font-serif text-primary tracking-tighter">
              HARNESSED.
            </h1>
            <div className="absolute top-12 right-12 hidden md:flex flex-col items-end">
              <span className="label-caps text-gray-500 mb-1">SYSTEM STATUS</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-none animate-pulse"></div>
                <span className="text-white font-bold text-sm">ONLINE</span>
              </div>
            </div>
          </div>

          {/* Subhero Info Box 1 */}
          <div className="lg:col-span-5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-gray-400 flex flex-col justify-between">
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-md">
              A high-performance market terminal built for serious capital allocators. Raw data, unsmoothed charts, and unyielding execution speed.
            </p>
            <Link href="/sign-up" className="w-fit h-14 px-8 flex items-center gap-3 bg-primary text-black font-bold text-lg border border-primary shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:translate-y-[2px] transition-all">
              OPEN TERMINAL <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Subhero Info Box 2 (Mini Ticker) */}
          <div className="lg:col-span-7 grid grid-cols-2">
            <div className="p-8 border-r border-b border-gray-400 flex flex-col justify-between h-48">
              <span className="label-caps text-gray-500">LIQUIDITY INDEX</span>
              <div>
                <div className="text-3xl text-white font-bold data-text">14,291.02</div>
                <div className="text-primary font-bold mt-1 text-sm">+1.24% (24H)</div>
              </div>
            </div>
            <div className="p-8 border-b border-gray-400 flex flex-col justify-between h-48">
              <span className="label-caps text-gray-500">NATIVE AI AGENT</span>
              <div>
                <div className="text-xl text-white font-bold mb-2">CRITIC ONLINE</div>
                <p className="text-xs text-gray-500 max-w-[200px]">Real-time portfolio analysis and news grounding active.</p>
              </div>
            </div>
            <div className="col-span-2 p-8 flex items-center justify-between">
              <div className="flex items-center gap-4 text-gray-500">
                <Terminal className="w-6 h-6" />
                <span className="text-sm font-bold">V 2.0.4 - TACTICAL UPDATE</span>
              </div>
              <span className="label-caps text-gray-600">ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-0 border border-gray-400 bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-400">
          <div className="p-10 flex flex-col gap-6">
            <Activity className="w-10 h-10 text-primary" />
            <h3 className="text-2xl font-serif text-white font-bold">RAW DATA</h3>
            <p className="text-sm text-gray-400">Unfiltered market feeds. We don&apos;t smooth the noise, we give you the tools to exploit it.</p>
          </div>
          <div className="p-10 flex flex-col gap-6">
            <Globe className="w-10 h-10 text-primary" />
            <h3 className="text-2xl font-serif text-white font-bold">LIVE AI GROUNDING</h3>
            <p className="text-sm text-gray-400">Our native AI doesn&apos;t guess. It queries global financial news instantly to explain market movements.</p>
          </div>
          <div className="p-10 flex flex-col gap-6">
            <Shield className="w-10 h-10 text-primary" />
            <h3 className="text-2xl font-serif text-white font-bold">TACTICAL UX</h3>
            <p className="text-sm text-gray-400">Built on a strict Bento Grid. No wasted space, no rounded corners. Pure structural efficiency.</p>
          </div>
        </div>
      </main>

    </div>
  );
}
