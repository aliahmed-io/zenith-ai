import { BaseMessage } from "@langchain/core/messages";

export function trimToTokenBudget(messages: any[], maxTokens = 4000) {
  // Simple heuristic: 1 token ~= 4 characters
  let currentTokens = 0;
  const trimmed = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const estimatedTokens = (msg.content?.length || 0) / 4;
    if (currentTokens + estimatedTokens > maxTokens) {
      break;
    }
    currentTokens += estimatedTokens;
    trimmed.unshift(msg);
  }
  // Always include at least the last message
  if (trimmed.length === 0 && messages.length > 0) {
    trimmed.push(messages[messages.length - 1]);
  }
  return trimmed;
}
