'use client';

import { useEffect, useRef } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function WalkthroughTour() {
    const initialized = useRef(false);

    useEffect(() => {
        // Only run once and only on the client
        if (typeof window === 'undefined' || initialized.current) return;
        
        const hasSeenTour = localStorage.getItem('zenith_tour_v2_completed');
        if (hasSeenTour) return;

        initialized.current = true;

        // Small delay to ensure all DOM elements are mounted, especially TradingView iframes
        const timer = setTimeout(() => {
            const driverObj = driver({
                showProgress: true,
                animate: true,
                steps: [
                    {
                        popover: {
                            title: 'SYSTEM INITIALIZED',
                            description: 'ZENITH TERMINAL ACTIVATED. INITIATING BRIEFING SEQUENCE. PROCEED.',
                            side: 'over',
                            align: 'center'
                        }
                    },
                    {
                        element: '#nav-home',
                        popover: {
                            title: 'GLOBAL OVERVIEW',
                            description: 'REAL-TIME MACRO DATA. HEATMAPS AND SECTOR PERFORMANCE. MONITOR BROAD MOVEMENTS HERE.',
                            side: 'bottom',
                            align: 'start'
                        }
                    },
                    {
                        element: '#nav-watchlist',
                        popover: {
                            title: 'PORTFOLIO AUDIT',
                            description: 'MANAGE ALLOCATED ASSETS. EXECUTE [NATIVE AI: PORTFOLIO AUDIT] FOR REAL-TIME EXPOSURE HEALTH-CHECKS AND SECTOR RISK ANALYSIS.',
                            side: 'bottom',
                            align: 'start'
                        }
                    },
                    {
                        element: '#nav-stockadvisor',
                        popover: {
                            title: 'NATIVE AI TERMINAL',
                            description: 'MULTI-AGENT INTELLIGENCE. DIRECT ACCESS TO LIVE WEB SEARCH AND SENTIMENT DATA. EXECUTE QUERIES FOR IMMEDIATE ANALYSIS.',
                            side: 'bottom',
                            align: 'start'
                        }
                    },
                    {
                        popover: {
                            title: 'BRIEFING COMPLETE',
                            description: 'YOU ARE NOW AUTHORIZED. NAVIGATE TO ANY TICKER PAGE TO ENGAGE THE [NATIVE AI: EXPLAIN MOVEMENT] PROTOCOL.',
                            side: 'over',
                            align: 'center'
                        }
                    }
                ],
                onDestroyStarted: () => {
                    if (!driverObj.hasNextStep() || confirm("ABORT BRIEFING SEQUENCE?")) {
                        localStorage.setItem('zenith_tour_v2_completed', 'true');
                        driverObj.destroy();
                    }
                },
            });

            driverObj.drive();
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return null; // This is a logic-only component
}
