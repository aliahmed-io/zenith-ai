# Zenith Project Insights & Future Roadmap

This document outlines the architectural strengths, weaknesses, and future roadmaps for the Zenith Platform, serving as our continuous strategic plan.

---

## 1. Current Project Strengths

1. **Modern App Router Foundation**: Switch to Next.js 15, Turbopack, and Tailwind CSS v4 provides an incredibly fast developer experience, optimal chunk sizes, and lightning-fast client loading times.
2. **Robust Simulated Trading Engine**: We bridged the paper-trading ledger backend with the UI! The new bento-grid dashboard visualizer, Recharts net worth performance curves, and the dual-layout `<OrderPanel />` (Bento vs. Sidebar overlay) provide a highly responsive, institutional-grade simulated trading experience.
3. **Atomic State Synchronization**: Our client-side event bus (`window.dispatchEvent`) enables zero-latency updates between transaction completions and portfolio widgets without relying on heavy polling or page reloads.
4. **Clean-Compiled Type Safety**: Complete refactoring of all `any` casts to strict custom TypeScript interfaces, ensuring the linter compiles with **0 errors** and zero runtime risk.
5. **Event-Driven Background AI Automation**: Using Inngest for background welcome digests andScheduled daily portfolio critics prevents serverless API functions from timing out during heavy Gemini inferences.

---

## 2. Current Weaknesses

1. **Dead Code Accumulation**: Legacy crypto assets, Chatwoot integrations, and older dashboard components remain in the folders. system cleanup remains a priority.
2. **Missing E2E Tests**: There are no active Playwright tests configured to verify the simulated buy/sell transaction loops automatically during CI cycles.
3. **Static Database Mocking**: The build phase successfully bypasses Mongo connection blocks through safe mock databases, but E2E database verification is required in pre-production.

---

## 3. Future Direction & Technical Roadmap

Based on competitive research (Koyfin, Toggle AI, Composer), we have outlined the strategic plans for Zenith's next evolution:

### Pillar A: Koyfin-Style Dynamic Bento Customizer
* **Goal**: Enable users to drag, drop, resize, and hide widgets (interactive chart, financials, AI explainer, order slip) on `/stocks/[symbol]` using React Grid Layout libraries, rather than forcing a static two-column bento box.
* **Why**: Let serious allocators customize their trading workspace structure to their liking.

### Pillar B: Composer-Style Algorithmic Backtester
* **Goal**: Equip the LangGraph Stock Advisor agents with backtesting tools. Users can type: *"Backtest buying NVDA every time RSI is under 35 and holding for 5 days,"* and the AI Advisor will compile this into rules, simulate the returns against historical data, and draw the resulting curve on the chart.
* **Why**: Moves the AI advisor from a general conversational agent to an active strategy generator.

### Pillar C: High-Impact Landing Page Interactive Overhaul
* **Goal**: Elevate the marketing landing page (`app/(marketing)/page.tsx`) to an award-winning visual standard using progressive enhancement assets.
* **Implementation Strategies**:
  1. **High-Performance Canvas-Scroll Image Sequence (Apple-Style)**:
     * *The Approach*: Preload a sequence of 500+ high-quality images. Draw them frame-by-frame on an HTML5 `<canvas>` inside a sticky scroll container by mapping `window.pageYOffset` to the current frame index.
     * *Performance Optimization*: Use `requestAnimationFrame` debouncing and pre-cache images in memory to ensure buttery-smooth 60fps animations on standard scroll inputs without layout shifts.
  2. **Optimized 3D Model Viewport (React Three Fiber / GLTF)**:
     * *The Approach*: Embed a highly desaturated, brutalist 3D abstract object (like a steel monolith, representing "Zenith precision") using `@react-three/fiber` and `@react-three/drei`.
     * *Performance Optimization*: Apply DRACO compression to the `.glb` model, use progressive fallback screens (a static image/cinematic video for lower-tier GPUs or mobile connections), and limit per-frame calculations to minimize GPU bottlenecks.

### Pillar D: AI Trader DNA Profile
* **Goal**: After a user has made enough trades in the simulator, the AI analyzes their entire transaction history and builds a psychological trading profile. It identifies behavioral patterns: panic-selling, momentum chasing, contrarian bets, overconfidence bias, loss aversion.
* **Implementation**: Generate a visual "DNA strand" or radar chart showing the user's strengths and blind spots across 6 dimensions (Risk Tolerance, Timing Discipline, Diversification Instinct, Conviction Strength, Loss Management, Trend Recognition). Include personalized coaching tips from Gemini.
* **Why**: Transforms Zenith from a trading tool into a self-improvement platform. No competitor offers AI-powered behavioral finance coaching based on actual simulated trade history.

### Pillar E: AI Price Target Challenge
* **Goal**: Instead of binary BUY/SELL decisions (like the Sandbox), the user is shown a stock and asked to predict the **exact price** 7 days from now. The AI scores prediction accuracy, tracks calibration over time, and teaches behavioral finance lessons (overconfidence bias, anchoring effects) through gamified gameplay.
* **Implementation**: Extend the Sandbox infrastructure with a new "Price Prediction" mode. Track historical predictions in MongoDB, compute a rolling accuracy score and calibration curve, and have Gemini generate personalized debiasing advice after each round.
* **Why**: Teaches quantitative prediction skills and self-awareness about cognitive biases — skills that are universally valuable beyond trading.
