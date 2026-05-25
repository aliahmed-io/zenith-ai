'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Activity } from 'lucide-react';

export default function AIExplainer({ symbol }: { symbol: string }) {
    const [explanation, setExplanation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleExplain = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/ai/explain-movement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol })
            });

            if (!response.ok) throw new Error("Failed to get explanation");
            
            const data = await response.json();
            setExplanation(data.explanation);
        } catch (err) {
            console.error(err);
            setError("NATIVE AI is currently analyzing market data and is temporarily unavailable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bento-card w-full flex flex-col gap-3">
            <div className="flex justify-between items-center bento-header !mb-0 !pb-3">
                <h3 className="label-caps text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    NATIVE AI: EXPLAIN MOVEMENT
                </h3>
                <Button onClick={handleExplain} disabled={loading} size="sm" className="primary-btn h-9 px-4 text-xs">
                    {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : null}
                    {loading ? "INITIALIZING..." : "EXECUTE ANALYSIS"}
                </Button>
            </div>

            {error && (
                <p className="text-red-500 font-mono text-xs mt-2 uppercase">{error}</p>
            )}

            {explanation && !error && (
                <div className="bg-gray-800 border border-primary text-gray-400 p-4 mt-2 text-sm animate-in fade-in slide-in-from-top-2 font-mono">
                    <p className="leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
    );
}
