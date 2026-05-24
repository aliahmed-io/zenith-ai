"use client";
// Next built in components
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getNews } from '@/lib/actions/finnhub.actions';

export function MultimediaSection() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const liveNews = await getNews();
        setNews(liveNews.slice(0, 4));
      } catch (err) {
        console.error("Failed to load news", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold flex items-center text-black dark:text-white">
          <span className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-2 rounded-lg mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </span>
          Live Market Coverage
        </h2>
        <Link
          href="/dashboard"
          className="text-green-500 hover:text-green-700 flex items-center group"
        >
          Open Terminal
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="bg-gray-200 dark:bg-gray-800 animate-pulse h-64 rounded-lg"></div>
          ))
        ) : (
          news.map((item, i) => (
            <div key={item.id || i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="h-40 relative">
                {item.image ? (
                  <Image 
                    src={item.image} 
                    alt={item.headline} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">
                      News
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-2 py-1 m-2 rounded-tl">
                  {new Date(item.datetime * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-sm mb-2 text-black dark:text-white line-clamp-3">
                  {item.headline}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 mt-auto">
                  {item.source}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mt-auto"
                >
                  Read Full Article →
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}