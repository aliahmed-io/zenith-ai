"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getCompanyProfile } from "@/lib/actions/finnhub.actions";

export default function NativeCompanyProfile({ symbol, height = 440 }: { symbol: string, height?: number }) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCompanyProfile(symbol);
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [symbol]);

  return (
    <div className="w-full bg-[#141414] border border-gray-400 overflow-hidden flex flex-col font-sans" style={{ height }}>
      <div className="p-4 border-b border-gray-800 bg-[#0F0F0F] shrink-0">
        <h3 className="text-[#DBDBDB] font-bold text-sm uppercase">COMPANY PROFILE: {symbol}</h3>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center font-mono text-xs text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            LOADING PROFILE...
          </div>
        ) : !profile ? (
          <div className="text-[#DBDBDB] text-xs font-mono">No profile data available.</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
              {profile.logo && (
                <img src={profile.logo} alt="Logo" className="w-12 h-12 rounded bg-white p-1" />
              )}
              <div>
                <h4 className="text-xl font-bold text-white">{profile.name}</h4>
                <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="text-primary text-xs font-mono hover:underline">
                  {profile.weburl}
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm font-mono border-b border-gray-800 pb-4">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Industry</span>
                <span className="text-white">{profile.finnhubIndustry || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Country</span>
                <span className="text-white">{profile.country || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">Exchange</span>
                <span className="text-white">{profile.exchange || "N/A"}</span>
              </div>
              <div>
                <span className="text-gray-500 block text-[10px] uppercase">IPO Date</span>
                <span className="text-white">{profile.ipo || "N/A"}</span>
              </div>
            </div>
            
            <div>
              <span className="text-gray-500 block text-[10px] uppercase mb-2 font-mono">Description</span>
              <p className="text-[#DBDBDB] text-sm leading-relaxed">
                {profile.name} is a publicly traded company on the {profile.exchange}. 
                It operates in the {profile.finnhubIndustry} sector. 
                With a market capitalization of {(profile.marketCapitalization || 0).toLocaleString()} million, 
                it is a major constituent in the financial markets.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
