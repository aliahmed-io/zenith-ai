'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function WatchlistCritic({ symbols }: { symbols: string[] }) {
    const [critique, setCritique] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!symbols || symbols.length === 0) {
            setError("WATCHLIST EMPTY. ADD ASSETS TO INITIALIZE ANALYSIS.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/ai/watchlist-critic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ watchlist: symbols.map(s => ({ symbol: s })) })
            });

            if (!response.ok) throw new Error("Failed to analyze watchlist");
            
            const data = await response.json();
            setCritique(data.critique);
        } catch (err) {
            console.error(err);
            setError("SYSTEM ERROR: NATIVE AI UNAVAILABLE.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bento-card mb-8 flex flex-col gap-4">
            <div className="flex justify-between items-center bento-header !mb-0 !pb-4">
                <div>
                    <h3 className="text-xl font-bold font-serif text-white flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                        NATIVE AI: PORTFOLIO AUDIT
                    </h3>
                    <p className="text-gray-400 text-sm mt-1 font-mono">EXECUTE INSTANT HEALTH-CHECK ON CURRENT EXPOSURE.</p>
                </div>
                <Button onClick={handleAnalyze} disabled={loading || symbols.length === 0} className="primary-btn px-6">
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {loading ? "PROCESSING..." : "INITIALIZE AUDIT"}
                </Button>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 font-mono text-sm uppercase flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}

            {critique && !error && (
                <div className="bg-gray-800 border border-primary text-gray-400 p-5 mt-2 animate-in fade-in slide-in-from-bottom-2 font-mono text-sm">
                    <p className="leading-relaxed whitespace-pre-wrap">{critique}</p>
                </div>
            )}
        </div>
    );
}
