import NativeCandleChart from "@/components/charts/NativeCandleChart";
import NativeSymbolInfo from "@/components/market/NativeSymbolInfo";
import NativeCompanyProfile from "@/components/market/NativeCompanyProfile";
import NativeFinancials from "@/components/market/NativeFinancials";
import NativeTechnicalAnalysis from "@/components/market/NativeTechnicalAnalysis";
import WatchlistButton from "@/components/WatchlistButton";
import AIExplainer from "@/components/trading/AIExplainer";
import OrderPanel from "@/components/trading/OrderPanel";
// No trading view constants needed here anymore

interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol.toUpperCase();
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full border border-gray-400 divide-y md:divide-y-0 md:divide-x divide-gray-400 bg-gray-900">
        {/* Left column */}
        <div className="flex flex-col gap-0 divide-y divide-gray-400">
          <div className="p-6">
            <AIExplainer symbol={symbol} />
          </div>
          <div className="p-0">
            <NativeSymbolInfo symbol={symbol} height={170} />
          </div>

          <div className="p-0 border-b border-gray-400 md:border-b-0">
            <NativeCandleChart symbol={symbol} height={600} />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-0 divide-y divide-gray-400">
          <div className="p-6 flex items-center justify-between">
            <WatchlistButton symbol={symbol} company={symbol} isInWatchlist={false} />
          </div>

          <div className="p-0">
            <OrderPanel symbol={symbol} />
          </div>

          <div className="p-0">
            <NativeTechnicalAnalysis symbol={symbol} height={400} />
          </div>

          <div className="p-0">
            <NativeCompanyProfile symbol={symbol} height={440} />
          </div>

          <div className="p-0">
            <NativeFinancials symbol={symbol} height={464} />
          </div>
        </div>
      </section>
    </div>
  );
}
