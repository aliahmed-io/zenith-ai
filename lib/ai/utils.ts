export interface ChatMessage {
  role: string;
  content: string;
}

export function trimToTokenBudget(messages: ChatMessage[], maxTokens = 4000) {
  // Simple heuristic: 1 token ~= 4 characters
  let currentTokens = 0;
  const trimmed: ChatMessage[] = [];
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (!msg) continue;
    const estimatedTokens = (msg.content?.length || 0) / 4;
    if (currentTokens + estimatedTokens > maxTokens) {
      break;
    }
    currentTokens += estimatedTokens;
    trimmed.unshift(msg);
  }
  // Always include at least the last message
  if (trimmed.length === 0 && messages.length > 0) {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg) {
      trimmed.push(lastMsg);
    }
  }
  return trimmed;
}
