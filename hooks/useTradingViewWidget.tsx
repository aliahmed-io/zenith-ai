'use client';
import { useEffect, useRef }     from "react";

const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        if (container.dataset.loaded) return;
        container.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.innerHTML = JSON.stringify(config);

        // Prevent TradingView from opening new tabs or redirecting by sandboxing its iframes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'IFRAME') {
                        (node as HTMLIFrameElement).setAttribute('sandbox', 'allow-scripts allow-same-origin');
                    } else if (node.childNodes && node.childNodes.length > 0) {
                        // Sometimes the iframe is nested inside a newly added div
                        const iframes = (node as HTMLElement).querySelectorAll?.('iframe');
                        iframes?.forEach(iframe => {
                            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
                        });
                    }
                });
            });
        });
        observer.observe(container, { childList: true, subtree: true });

        container.appendChild(script);
        container.dataset.loaded = 'true';

        return () => {
            observer.disconnect();
            if(container) {
                container.innerHTML = '';
                delete container.dataset.loaded;
            }
        }
    }, [scriptUrl, config, height])

    return containerRef;
}
export default useTradingViewWidget
