# Zenith Platform Evaluation

## System Architecture

### Frontend (Next.js 15 App Router)
- **Framework:** Next.js 15 App Router with Turbopack for extremely fast builds and routing.
- **Styling:** Tailwind CSS combined with Framer Motion for animations. Follows a strict dark-mode, Apple-like minimalist aesthetic.
- **Routing:** Uses route groups `(root)` for authenticated dashboard experiences and `(auth)` for clean sign-in/sign-up isolation.
- **UI Components:** Utilizes Shadcn UI components (Radix UI primitives) for accessible, consistent building blocks.

### Backend (Next.js API Routes & Inngest)
- **API Architecture:** Serverless API routes handling specific micro-services (e.g., `/api/market/quote`, `/api/stock-chat`).
- **Background Jobs:** Powered by **Inngest**. Handles asynchronous background tasks like AI-generated welcome emails upon signup, and scheduled cron jobs (daily AI news summaries).

### Database & Authentication
- **Database:** MongoDB via Mongoose. Schema is designed to track users, sessions, and simulated transactions/portfolio state.
- **Authentication:** **Better Auth** library. Manages sessions, OAuth (if configured), and credential-based login with highly secure cookie management. Completely replaces legacy NextAuth/Auth.js.

### Third-Party API Integrations
- **Finnhub / TradingView:** The core backbone for financial data. Finnhub provides REST/WebSocket data for news and raw data, while TradingView provides the high-performance widget iframes for charting, financials, and heatmaps.
- **Vercel AI SDK / Groq:** Powers the LangGraph multi-agent system (`/stockadvisor`) for insanely fast, structured AI inference.
- **Google Gemini (Flash Lite):** Hooked into the Inngest background workers for cheap, fast text generation tasks like email summaries.
- **Nodemailer:** Handles direct SMTP transactional email delivery.

## Feature Evaluation

### 1. Unified Dashboard & Widgets
- **Strengths:** The dashboard correctly aggregates TradingView widgets (heatmaps, timelines) which drastically reduces custom D3.js/Chart.js code maintenance while providing institutional-grade tools to the user.
- **Evaluation:** High performance, zero maintenance.

### 2. AI Advisor (LangGraph Multi-Agent)
- **Strengths:** Utilizes a supervisor model routing requests to specialized agents (Sentiment, Technical, Market Research). Streams responses dynamically.
- **Evaluation:** Very strong architecture. By moving it into the global `(root)` layout, it now correctly inherits the global UI state, fixing previous fragmentation.

### 3. Background AI Automation
- **Strengths:** Inngest successfully offloads long-running AI inferences (daily summaries) from the main web server, ensuring the UI remains snappy.
- **Evaluation:** Production-ready approach for handling LLM latency in a serverless environment.

### 4. Legacy Code Purge
- **Strengths:** Removal of Crypto and disjointed AI features prevents user confusion and tightens the brand identity to purely "Zenith" (equities/traditional markets).
- **Evaluation:** Codebase is much lighter, but dead code still exists in `components/trading/` which should eventually be pruned.
