import { StateGraph, END, START, MessagesAnnotation } from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

const llm = new ChatGroq({
  model: "llama3-8b-8192",
  apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY || "dummy-key-for-build",
});


export const stockAdvisorGraph = new StateGraph(MessagesAnnotation)
  .addNode("supervisor", async (state) => {
    const response = await llm.invoke([
      new HumanMessage("You are a supervisor routing the user's stock query."),
      ...state.messages
    ]);
    return { messages: [response] };
  })
  .addEdge(START, "supervisor")
  .addEdge("supervisor", END)
  .compile();
