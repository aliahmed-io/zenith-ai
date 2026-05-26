import { Newspaper } from "lucide-react";
import { getLatestNews } from "@/lib/actions/news-decoder.actions";
import NewsDecoderFeed from "@/components/ai/NewsDecoderFeed";

export default async function NewsDecoderPage() {
  const articles = await getLatestNews();

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 animate-in fade-in duration-300">
      {/* HEADER */}
      <div className="bento-card p-8 flex flex-col gap-4 border border-primary/50 shadow-[4px_4px_0px_rgba(255,79,0,0.5)]">
        <div className="flex items-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-serif text-white tracking-tighter">
            NEWS DECODER
          </h1>
        </div>
        <p className="text-sm font-mono text-gray-400 uppercase leading-relaxed max-w-2xl">
          EVERY HEADLINE CONTAINS A SIGNAL. HIT DECODE TO LET ZENITH AI
          EXTRACT THE TRADING INTELLIGENCE HIDDEN IN THE NOISE.
        </p>
      </div>

      {/* FEED */}
      {articles.length > 0 ? (
        <NewsDecoderFeed articles={articles} />
      ) : (
        <div className="bento-card p-12 text-center">
          <p className="font-mono text-gray-500 uppercase text-sm">
            NO NEWS AVAILABLE. CHECK BACK LATER.
          </p>
        </div>
      )}
    </div>
  );
}
