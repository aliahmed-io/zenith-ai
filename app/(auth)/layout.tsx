import Link from "next/link";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {redirect} from "next/navigation";
import VolatilityGrid from "@/components/trading/VolatilityGrid";

const Layout = async ({ children }: { children : React.ReactNode }) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if(session?.user) redirect('/dashboard')

    return (
        <main className="min-h-screen bg-gray-900 text-gray-400 font-mono relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Dynamic Volatility Grid (Wow Factor Background) */}
            <VolatilityGrid />

            {/* Central stark brutalist card container */}
            <div className="relative z-10 w-full max-w-[460px] border border-gray-400 bg-gray-900 p-8 shadow-[8px_8px_0px_#000] flex flex-col gap-6">
                
                {/* Brand Header */}
                <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                    <Link href="/" className="inline-block">
                        <span className="text-2xl font-bold font-serif text-white tracking-tighter hover:text-primary transition-colors">ZENITH.</span>
                    </Link>
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-primary animate-pulse"></span>
                        SECURE LOGON
                    </span>
                </div>

                <div className="flex-grow">{children}</div>
            </div>
        </main>
    )
}
export default Layout
