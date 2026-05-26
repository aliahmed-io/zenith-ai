"use client";

import React, { useEffect, useState } from "react";
import { getNews } from "@/lib/actions/finnhub.actions";
import { Loader2 } from "lucide-react";

export default function NativeNewsFeed({ height = 600 }: { height?: number }) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await getNews();
        setNews(data);
      } catch (err) {
        console.error("Failed to load news", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <div className="w-full bg-[#141414] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="p-4 border-b border-gray-800 bg-[#0F0F0F] shrink-0">
        <h3 className="text-[#DBDBDB] font-bold text-sm">TOP STORIES</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {loading ? (
          <div className="flex-1 flex items-center justify-center font-mono text-xs text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            FETCHING...
          </div>
        ) : news.length === 0 ? (
          <div className="text-[#DBDBDB] text-xs font-mono">No news available.</div>
        ) : (
          news.map((item, idx) => (
            <a 
              key={idx} 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 border-b border-gray-800 pb-4 hover:bg-gray-900/30 p-2 -mx-2 rounded transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-[#0FEDBE] font-bold text-xs uppercase tracking-wider">{item.source || "MARKET"}</span>
                <span className="text-gray-500 text-[10px] font-mono">{item.date}</span>
              </div>
              <h4 className="text-[#DBDBDB] text-sm font-semibold group-hover:text-white transition-colors">{item.headline}</h4>
              <p className="text-gray-400 text-xs line-clamp-2">{item.summary}</p>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
