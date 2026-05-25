import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWatchlistSymbolsByEmail } from '@/lib/actions/watchlist.actions';
import WatchlistCritic from '@/components/trading/WatchlistCritic';
import TradingViewWidget from '@/components/TradingViewWidget';

export default async function WatchlistPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect('/sign-in');

    const symbols = await getWatchlistSymbolsByEmail(session.user.email);

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col gap-2 bento-header pb-6">
                <h1 className="text-4xl font-bold text-white font-serif tracking-tighter">WATCHLIST</h1>
                <p className="text-gray-400 font-mono text-sm uppercase">MONITOR ASSETS & AI-POWERED PORTFOLIO INSIGHTS.</p>
            </div>

            <WatchlistCritic symbols={symbols} />

            {symbols.length === 0 ? (
                <div className="bento-card p-12 text-center flex flex-col items-center justify-center">
                    <p className="text-xl text-primary font-bold font-mono uppercase mb-4">WATCHLIST IS EMPTY</p>
                    <p className="text-gray-500 max-w-md font-mono text-sm uppercase">USE SEARCH TO FIND AND ALLOCATE ASSETS TO WATCHLIST.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border border-gray-400 bg-gray-900 divide-y md:divide-y-0 md:divide-x divide-gray-400">
                    {symbols.map(symbol => (
                        <div key={symbol} className="h-[400px] bg-gray-900 p-4">
                            <TradingViewWidget
                                title={symbol}
                                scriptUrl="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
                                config={{
                                    symbol: symbol,
                                    width: "100%",
                                    height: "100%",
                                    locale: "en",
                                    dateRange: "1M",
                                    colorTheme: "dark",
                                    trendLineColor: "#ff4f00",
                                    underLineColor: "rgba(255, 79, 0, 0.1)",
                                    isTransparent: true,
                                    autosize: true,
                                    largeChartUrl: ""
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
