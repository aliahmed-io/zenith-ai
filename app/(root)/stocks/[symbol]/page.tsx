import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import AIExplainer from "@/components/trading/AIExplainer";
import OrderPanel from "@/components/trading/OrderPanel";
import {
  SYMBOL_INFO_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  BASELINE_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
} from "@/lib/constants";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full border border-gray-400 divide-y md:divide-y-0 md:divide-x divide-gray-400 bg-gray-900">
        {/* Left column */}
        <div className="flex flex-col gap-0 divide-y divide-gray-400">
          <div className="p-6">
            <AIExplainer symbol={symbol.toUpperCase()} />
          </div>
          <div className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
          </div>

          <div className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              className="custom-chart"
              height={600}
            />
          </div>

          <div className="p-0 border-b border-gray-400 md:border-b-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={BASELINE_WIDGET_CONFIG(symbol)}
              className="custom-chart"
              height={600}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-0 divide-y divide-gray-400">
          <div className="p-6 flex items-center justify-between">
            <WatchlistButton symbol={symbol.toUpperCase()} company={symbol.toUpperCase()} isInWatchlist={false} />
          </div>

          <div className="p-0">
            <OrderPanel symbol={symbol} />
          </div>

          <div className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />
          </div>

          <div className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}company-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />
          </div>

          <div className="p-0">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
