import { StateGraph, END, START, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { search } from "duck-duck-scrape";

const searchTool = tool(
  async ({ query }) => {
    try {
      const results = await search(query);
      return results.results
        .slice(0, 5)
        .map(r => `[${r.title}]: ${r.description} (${r.url})`)
        .join("\n\n");
    } catch (_e) {
      return "Search failed or is temporarily unavailable.";
    }
  },
  {
    name: "web_search",
    description: "Search the web for real-time news, financial data, and current events. Always use this to verify recent information.",
    schema: z.object({
      query: z.string().describe("The search query"),
    }),
  }
);

const tools = [searchTool];

const llmPrimary = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY || "dummy-key-for-build",
}).bindTools(tools);

const llmFallback = new ChatGoogleGenerativeAI({
  model: "gemini-3.5-flash",
  apiKey: process.env.GEMINI_API_KEY || "dummy-key-for-build",
}).bindTools(tools);

const llm = llmPrimary.withFallbacks({
  fallbacks: [llmFallback]
});

export const stockAdvisorGraph = new StateGraph(MessagesAnnotation)
  .addNode("agent", async (state) => {
    const systemMessage = new HumanMessage(`INITIALIZATION COMPLETE. NATIVE AI ONLINE. AWAITING MARKET QUERY.
You are the Zenith AI System Terminal, an elite analytical engine. 
CRITICAL DIRECTIVES:
1. You MUST use the web_search tool to find the most recent, up-to-date information before answering ANY questions about current stock prices, news, or market events.
2. ONLY trust and explicitly cite credible financial sources (e.g., Bloomberg, Reuters, WSJ, CNBC, Financial Times).
3. DO NOT use emojis. DO NOT use conversational filler (e.g., "Hey there", "Sure!"). 
4. Maintain a strictly tactical, brutalist, and objective tone. Use structured data formats when applicable.`);
    const response = await llm.invoke([systemMessage, ...state.messages]);
    return { messages: [response] };
  })
  .addNode("tools", async (state) => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    
    if (!lastMessage || !lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
      return { messages: [] };
    }
    
    const toolMessages: unknown[] = [];
    for (const toolCall of lastMessage.tool_calls) {
      if (toolCall.name === "web_search" && toolCall.id) {
        const result = await searchTool.invoke(toolCall);
        toolMessages.push(new ToolMessage({
          content: typeof result === 'string' ? result : JSON.stringify(result),
          tool_call_id: toolCall.id,
          name: toolCall.name,
        }));
      }
    }
    
    return { messages: toolMessages };
  })
  .addEdge(START, "agent")
  .addConditionalEdges("agent", (state) => {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (lastMessage.tool_calls && lastMessage.tool_calls.length > 0) {
      return "tools";
    }
    return END;
  })
  .addEdge("tools", "agent")
  .compile();
