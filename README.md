# Generative Financial Literacy & Sandbox Platform 🚀

Welcome to the ultimate Apple-level minimalist financial learning platform. This project merges the beautiful UI of `zenith` with a sophisticated AI Mentor and a robust Paper Trading Sandbox. 

## 🏗 System Architecture

This platform is built on three core pillars:

### 1. Main UI Shell
- **Framework:** Next.js 15 (App Router, Server Components)
- **Database:** MongoDB & Mongoose
- **Authentication:** `better-auth`
- **Styling:** Tailwind CSS + `shadcn/ui`

### 2. AI Mentor Pillar
- **Logic:** Powered by Vercel AI SDK and Groq.
- **Features:** A Generative UI chat interface where the AI agent has direct "tools" to query live financial data and render interactive React components (like charts and sentiment meters) inside the chat stream.

### 3. Sandbox Pillar (Paper Trading)
- **Virtual Balance:** Every user is initialized with a `$100,000` virtual balance via `better-auth` session injection.
- **Engine:** Real-time Buy/Sell execution logic that tracks portfolios and transactions, calculating average cost basis and P&L natively.
- **Visualization:** Integration of a React Flow DAG (Directed Acyclic Graph) canvas to visualize the "Thought Process" and technical reasoning behind AI trade recommendations.

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB instance (Atlas or local)

### Installation

1. **Clone & Install**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env.local` and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
   *Note: You will need a `MONGODB_URI`, `BETTER_AUTH_SECRET`, and API keys for Groq and Finnhub.*

3. **Database Migration**
   If you have existing users, run the migration to inject the `$100,000` virtual balance:
   ```bash
   npx tsx --env-file=.env.local scripts/migrate-virtual-balance.ts
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000` to start exploring!

## 🧪 Testing & Validation
The core logic for trade execution is abstracted into server actions (`lib/actions/trading.actions.ts`). To test the Sandbox API directly:
- **Execute Trade:** `POST /api/trading/execute`
- **Fetch Portfolio:** `GET /api/trading/portfolio`
- **Trading History:** `GET /api/trading/history?symbol=AAPL`
