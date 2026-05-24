# Project Evaluation: Zenith (Formerly Signalist/Vibe-Trade)

## Overview
Zenith is a modern, Apple-tier minimalist FinTech web application. It serves as a Generative Financial Literacy & Sandbox Platform, merging a robust trading interface with an AI-powered mentoring system.

## 1. Frontend Architecture
- **Framework:** Next.js 15 (App Router) with Turbopack, providing state-of-the-art server-side rendering, static generation, and optimized client-side routing.
- **Styling:** Tailwind CSS combined with `framer-motion` for micro-animations and smooth transitions. The UI follows a strict dark-mode-first, high-whitespace, high-typography aesthetic (using `Geist` and `Inter` standard fonts).
- **Component Library:** Shadcn UI (Radix UI primitives under the hood), offering accessible, unstyled components that have been heavily customized to match the brand's premium look and feel.
- **Data Visualization:** `Recharts` is used extensively for financial charting (Portfolio Analytics, Price Charts), ensuring responsive and highly customizable SVG-based charts.
- **AI Integration:** The frontend utilizes `@ai-sdk/react` to stream AI responses seamlessly into the UI (specifically in `/cryptoadvisor` and `/stockadvisor`), providing a ChatGPT-like experience.

## 2. Backend Architecture
- **Runtime:** Node.js (V8) via Next.js serverless functions / Edge runtime.
- **API Routes:** RESTful endpoints built using Next.js Route Handlers (`app/api/*`). These routes handle market data fetching, trade execution, portfolio management, and AI streaming.
- **AI Engine (LangGraph):** The core intelligence is driven by `@langchain/langgraph` and `@langchain/groq`. It uses a directed acyclic graph (DAG) to manage complex agentic workflows, such as fetching real-time stock quotes, analyzing user portfolios, and synthesizing educational advice before returning a streamed response to the client.
- **External APIs:** Integrates with Finnhub (and potentially CoinGecko/Alpha Vantage) for real-time market data.

## 3. Database Architecture
- **Database:** MongoDB, chosen for its flexible document schema which perfectly suits the varying shapes of transaction data, user profiles, and portfolio snapshots.
- **ODM:** Mongoose is used for strict schema validation at the application layer. Models include `User`, `Portfolio`, and `Transaction`.
- **Connection Management:** The application implements a singleton connection cache (`database/mongoose.ts`) to prevent connection pool exhaustion in serverless environments, with intelligent build-time mocking to ensure CI/CD pipelines don't fail during static analysis.

## 4. Authentication Architecture
- **Provider:** `better-auth` is utilized as the primary authentication layer, replacing the legacy `next-auth` implementation.
- **Adapter:** The `mongodbAdapter` connects `better-auth` directly to the MongoDB cluster.
- **Features:** Supports email/password, session management via cookies (`nextCookies`), and custom user fields (e.g., `virtualBalance` initialized to $100,000 for the trading sandbox).
- **Security:** Session validation is performed at the route level using `auth.api.getSession`, ensuring protected API endpoints reject unauthorized requests.

## Summary
The architecture is highly cohesive, modular, and built on cutting-edge technologies. The strict separation of concerns (Agentic AI vs. UI vs. DB) allows for massive scalability, while the Next.js 15 App Router ensures optimal Core Web Vitals.
