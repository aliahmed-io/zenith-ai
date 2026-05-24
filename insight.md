# Zenith Project Insights

## Current Project Strengths
1. **Modern Foundation:** The switch to Next.js 15, Turbopack, and Tailwind creates an incredibly fast developer experience and a highly performant user interface.
2. **Robust Authentication:** Migrating to **Better Auth** solved many of the edge cases and complexities found in older NextAuth setups, providing a much cleaner database integration for session management.
3. **Event-Driven AI Automation:** Using Inngest for the background tasks (welcome emails, daily news) is a massive strength. It prevents the Vercel/Next.js serverless functions from timing out when waiting for Gemini LLM responses.
4. **Agentic UI:** The AI Stock Advisor utilizing LangGraph is state-of-the-art. Exposing the internal "agent steps" in the UI builds immense user trust.

## Current Weaknesses
1. **Dead Code Accumulation:** The merger of `Signalist`, `AI-Finance`, and other side projects resulted in a massive amount of dead code. Specifically, the entire `components/trading/` directory is full of unused components, old headers, and legacy crypto logic.
2. **Missing E2E Tests:** Currently, there is no Playwright or Cypress testing to ensure the critical flows (Login -> View Dashboard -> Ask AI Advisor) remain unbroken during refactors.
3. **Database Mocking in Build:** The project build currently mocks the MongoDB connection if the URI isn't provided, which can lead to false confidence if the live DB schema changes.

## Future Direction & How to Improve

### 1. Finalize the Purge
- **Action:** Systematically audit the `components/` directory. Delete anything related to Chatwoot, n8n, and old dashboard variations that are no longer actively imported by `app/(root)`.
- **Why:** This will reduce the repository size, speed up linting, and prevent future developers from accidentally importing legacy UI components that break the minimalist Zenith theme.

### 2. Enhance the AI Advisor's Tooling
- **Action:** Give the LangGraph agents inside `/stockadvisor` actual tools (using Vercel AI SDK's `tool` calling) to query the database. For example, allow the AI to look up the user's current virtual portfolio balance or watchlist.
- **Why:** This turns the AI from a generic financial bot into a deeply personalized wealth manager.

### 3. Implement Virtual Trading Engine
- **Action:** You currently have database models for `Transaction` and `Portfolio`. Hook these up to the UI so users can execute paper trades directly from the `/stocks/[symbol]` page using real-time Finnhub prices.
- **Why:** Paper trading is the stickiest feature a stock platform can have. Users will return daily to check their portfolio performance.

### 4. Robust Notification System
- **Action:** Expand the Inngest background workers to track stock prices. If a stock in a user's watchlist drops or rises by >5%, send a personalized NodeMailer alert.
- **Why:** Increases Daily Active Users (DAU) by actively pulling them back into the platform.
