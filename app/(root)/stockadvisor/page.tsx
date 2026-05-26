"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Trash2, X, Plus, Terminal, Zap, CheckSquare, Server, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/better-auth/auth-client";
import { useToast } from "@/hooks/use-toast";

// Brutalist agent configuration (Dark Theme)
const AGENT_CONFIG = {
  supervisor: { name: "ROUTER", icon: Server, color: "bg-gray-900 text-gray-400 border-gray-400" },
  Supervisor: { name: "ROUTER", icon: Server, color: "bg-gray-900 text-gray-400 border-gray-400" },
  TechnicalAnalyst: { name: "QUANT", icon: Zap, color: "bg-primary text-black border-gray-400" },
  SentimentAnalyst: { name: "SOCIAL", icon: Command, color: "bg-gray-800 text-white border-gray-400" },
  MarketResearcher: { name: "DATA", icon: Server, color: "bg-gray-700 text-gray-400 border-gray-400" },
  finalResponse: { name: "OUTPUT", icon: CheckSquare, color: "bg-primary text-black border-gray-400" },
  FinalResponse: { name: "OUTPUT", icon: CheckSquare, color: "bg-primary text-black border-gray-400" },
};

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  agentSteps?: AgentStep[];
}

interface AgentStep {
  agent: string;
  status: string;
  message: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function StockAdvisor() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>(Date.now().toString());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<string | null>(null);
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [streamingResponse, setStreamingResponse] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const status = isPending ? 'loading' : session ? 'authenticated' : 'unauthenticated';

  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/signin';
    }
  }, [status]);

  useEffect(() => {
    const initialMessage: Message = {
      role: "assistant",
      content: `SYSTEM ONLINE. AWAITING INPUT.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    const sessionExists = chatSessions.some(s => s.id === currentChatId);
    if (!sessionExists) {
      const newSession: ChatSession = {
        id: currentChatId,
        title: "SESSION 01",
        messages: [initialMessage],
      };
      setChatSessions((prev) => {
        if (prev.some(s => s.id === currentChatId)) return prev;
        return [...prev, newSession];
      });
      setMessages([initialMessage]);
    }
  }, [currentChatId, chatSessions]);

  useEffect(() => {
    const currentSession = chatSessions.find((session) => session.id === currentChatId);
    setMessages(currentSession?.messages ?? []);
  }, [currentChatId, chatSessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingResponse, agentSteps]);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClearChat = () => {
    setMessages([]);
    setAgentSteps([]);
    setChatSessions((prev) => prev.map((session) => session.id === currentChatId ? { ...session, messages: [] } : session));
    toast({ title: "MEMORY CLEARED", description: "Buffer wiped.", className: "bg-primary text-black border-4 border-gray-400 rounded-none font-black uppercase shadow-[4px_4px_0_0_#e5e2e1]" });
  };

  const handleNewChat = () => {
    setChatSessions((prev) => prev.map((session) => session.id === currentChatId ? { ...session, messages } : session));
    const newChatId = Date.now().toString();
    const newSession: ChatSession = { id: newChatId, title: `SESSION ${String(chatSessions.length + 1).padStart(2, '0')}`, messages: [] };
    setChatSessions((prev) => [...prev, newSession]);
    setCurrentChatId(newChatId);
    setMessages([]);
    setAgentSteps([]);
  };

  const handleSwitchChat = (chatId: string) => {
    setChatSessions((prev) => prev.map((session) => session.id === currentChatId ? { ...session, messages } : session));
    setCurrentChatId(chatId);
    setAgentSteps([]);
  };

  const handleDeleteChat = (chatId: string) => {
    if (chatSessions.length === 1) handleNewChat();
    setChatSessions((prev) => {
      const updatedSessions = prev.filter((session) => session.id !== chatId);
      if (chatId === currentChatId && updatedSessions.length > 0) setCurrentChatId(updatedSessions[updatedSessions.length - 1].id);
      return updatedSessions;
    });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    };

    setMessages((prev) => {
      const updatedMessages = [...prev, userMessage];
      setChatSessions((prevSessions) => prevSessions.map((session) => session.id === currentChatId ? { ...session, messages: updatedMessages } : session));
      return updatedMessages;
    });

    if (messages.filter((msg) => msg.role === "user").length === 0) {
      let newTitle = `SESSION ${String(chatSessions.length).padStart(2, '0')}`;
      const symbolMatch = input.match(/\b[A-Z]{1,5}\b/)?.[0];
      if (symbolMatch) newTitle = `${symbolMatch}`;
      setChatSessions((prev) => prev.map((session) => session.id === currentChatId ? { ...session, title: newTitle } : session));
    }

    setInput("");
    setLoading(true);
    setAgentSteps([]);
    setCurrentAgent(null);
    setStreamingResponse("");

    abortControllerRef.current = new AbortController();
    const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 60000);

    let retries = 0;
    const maxRetries = 2;

    while (retries <= maxRetries) {
      try {
        const response = await fetch("/api/stock-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMessage].map((msg) => ({ role: msg.role, content: msg.content })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) throw new Error(`API ERROR: ${response.status}`);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let finalResponse = "";
        const steps: AgentStep[] = [];

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ")) {
                try {
                  const data = JSON.parse(line.slice(6));

                  if (data.type === "agent") {
                    if (data.agent === "unknown") continue;
                    setCurrentAgent(data.agent);
                    const step: AgentStep = { agent: data.agent, status: data.status, message: data.message, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) };
                    steps.push(step);
                    setAgentSteps([...steps]);
                  } else if (data.type === "final") {
                    finalResponse = data.message;
                    setStreamingResponse(finalResponse);
                    setCurrentAgent(null);
                  } else if (data.type === "stream") {
                    finalResponse += data.chunk;
                    setStreamingResponse(finalResponse);
                  } else if (data.type === "error") {
                    throw new Error(data.error);
                  }
                } catch (e) {
                  // ignore
                }
              }
            }
          }
        }

        clearTimeout(timeoutId);

        const assistantMessage: Message = {
          role: "assistant",
          content: finalResponse || "EXECUTION COMPLETE. NO DATA RETURNED.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          agentSteps: steps,
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, assistantMessage];
          setChatSessions((prevSessions) => prevSessions.map((session) => session.id === currentChatId ? { ...session, messages: updatedMessages } : session));
          return updatedMessages;
        });

        setAgentSteps([]);
        setStreamingResponse("");
        break;

      } catch (error: unknown) {
        clearTimeout(timeoutId);

        if (error instanceof Error && error.name === 'AbortError') {
          const errorMessage: Message = { role: "assistant", content: `TIMEOUT. SYSTEM HALTED.`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) };
          setMessages((prev) => [...prev, errorMessage]);
          break;
        }

        retries++;
        if (retries <= maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          continue;
        }

        const errorMessage: Message = { role: "assistant", content: `ERROR: ${error instanceof Error ? error.message : "UNKNOWN"}`, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) };
        setMessages((prev) => [...prev, errorMessage]);
        toast({ title: "FAILURE", description: "Terminal error.", className: "bg-gray-900 text-red-500 border-4 border-gray-400 rounded-none font-black uppercase shadow-[4px_4px_0_0_#e5e2e1]" });
      }
    }

    setLoading(false);
    setStreamingResponse("");
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setLoading(false);
      setStreamingResponse("");
      setCurrentAgent(null);
      setAgentSteps([]);
    }
  };

  // The outer div now uses EXACT height (h-[calc(100vh-70px)]) assuming header is 70px.
  // We remove outer margins to prevent the body from overflowing and causing double scrollbars.
  return (
    <div className="h-[calc(100vh-70px)] bg-gray-900 text-gray-400 flex flex-col font-mono relative overflow-hidden border-t-4 border-gray-400">
      
      {/* Heavy Brutalist Grid Background (Dark Mode) */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#e5e2e1 2px, transparent 2px), linear-gradient(90deg, #e5e2e1 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-64 border-r-4 border-gray-400 bg-gray-900 p-6 flex flex-col lg:w-80 overflow-hidden shrink-0"
            >
              <div className="flex justify-between items-end mb-8 border-b-4 border-gray-400 pb-4 shrink-0">
                <h2 className="text-3xl font-black tracking-tighter uppercase leading-none text-white">ARCHIVE</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:bg-gray-400 hover:text-black rounded-none border-2 border-gray-400">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <Button
                onClick={handleNewChat}
                className="mb-8 w-full shrink-0 bg-primary border-4 border-gray-400 text-black hover:bg-gray-400 hover:text-black transition-colors rounded-none font-black text-lg h-14 uppercase tracking-wider shadow-[4px_4px_0_0_#e5e2e1] active:translate-y-1 active:shadow-none"
              >
                <Plus className="h-5 w-5 mr-2 stroke-[3]" /> NEW QUERY
              </Button>

              <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 min-h-0">
                {chatSessions.map((session) => (
                  <div
                    key={session.id}
                    className={`group flex justify-between items-center px-4 py-3 border-4 cursor-pointer transition-colors ${
                      session.id === currentChatId 
                        ? "border-gray-400 bg-gray-800 text-white shadow-[4px_4px_0_0_#ff4f00]" 
                        : "border-gray-400 bg-gray-900 text-gray-400 hover:bg-gray-800 shadow-[4px_4px_0_0_#e5e2e1]"
                    }`}
                  >
                    <div className="flex-1 overflow-hidden" onClick={() => handleSwitchChat(session.id)}>
                      <span className="text-sm font-bold uppercase truncate block">{session.title}</span>
                    </div>
                    <Button variant="ghost" size="icon" className={`h-8 w-8 transition-colors rounded-none border-2 border-transparent shrink-0 ${session.id === currentChatId ? 'hover:bg-red-500 hover:text-white' : 'hover:bg-gray-400 hover:text-black'}`} onClick={(e) => { e.stopPropagation(); handleDeleteChat(session.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-transparent relative">
          
          {/* Header */}
          <div className="h-16 border-b-4 border-gray-400 bg-primary flex items-center px-6 justify-between shrink-0">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && (
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="text-black hover:bg-black hover:text-primary rounded-none border-2 border-black h-10 w-10">
                  <Terminal className="h-5 w-5" />
                </Button>
              )}
              <h1 className="text-2xl font-black uppercase tracking-tighter text-black">ZENITH AI TERMINAL</h1>
            </div>
            <div className="bg-gray-900 text-primary px-3 py-1 font-bold text-sm border-2 border-gray-400 uppercase">
              STATUS: ONLINE
            </div>
          </div>

          {/* Messages Area - Independently scrollable */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar min-h-0">
            <div className="max-w-4xl mx-auto flex flex-col space-y-8 pb-10">
              
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex flex-col max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                    
                    {/* Meta Label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gray-400 text-black px-2 py-0.5 text-xs font-bold uppercase border-2 border-gray-400">
                        {message.role === "assistant" ? "SYSTEM" : "USER"}
                      </span>
                      <span className="text-xs font-bold text-gray-500">{message.timestamp}</span>
                    </div>

                    {/* Chat Box */}
                    <div
                      className={`text-base leading-relaxed border-4 border-gray-400 p-5 shadow-[6px_6px_0_0_#e5e2e1] font-medium ${
                        message.role === "user"
                          ? "bg-gray-800 text-white"
                          : "bg-gray-900 text-gray-400"
                      }`}
                    >
                      <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black prose-pre:text-white prose-pre:border-4 prose-pre:border-gray-400 prose-pre:rounded-none">
                        {message.content.split('\n').map((line, i) => {
                          if (!line.trim()) return <div key={i} className="h-4" />;
                          if (line.startsWith('#### ')) return <h4 key={i} className="text-sm font-black uppercase mt-4 mb-2 text-white">{line.slice(5)}</h4>;
                          if (line.startsWith('### ')) return <h3 key={i} className="text-base font-black uppercase mt-5 mb-2 text-white">{line.slice(4)}</h3>;
                          if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black uppercase mt-6 mb-3 border-b-4 border-gray-400 pb-2 text-white">{line.slice(3)}</h2>;
                          if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black uppercase mt-6 mb-4 text-primary">{line.slice(2)}</h1>;
                          if (line.startsWith('- ')) return <li key={i} className="ml-6 mb-2 list-square marker:text-primary">{line.slice(2)}</li>;
                          if (line.match(/^\d+\./)) return <li key={i} className="ml-6 mb-2 font-bold">{line.slice(line.indexOf('.') + 2)}</li>;
                          
                          const parts = line.split(/(\*\*.*?\*\*)/g);
                          return (
                            <p key={i} className="mb-3">
                              {parts.map((part, j) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return <strong key={j} className="font-black bg-primary text-black px-1">{part.slice(2, -2)}</strong>;
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      {/* Execution Trace (Agent Steps) */}
                      {message.role === "assistant" && message.agentSteps && message.agentSteps.length > 0 && (
                        <div className="mt-6 pt-4 border-t-4 border-gray-400">
                          <details className="group cursor-pointer">
                            <summary className="text-sm font-black text-gray-400 hover:text-black hover:bg-gray-400 uppercase tracking-widest outline-none list-none inline-flex items-center px-2 py-1 transition-colors border-2 border-transparent hover:border-gray-400">
                              <span className="mr-2 font-black group-open:rotate-90 transition-transform">►</span>
                              [ EXECUTION TRACE ]
                            </summary>
                            <div className="mt-4 p-4 border-4 border-gray-400 bg-gray-800 space-y-4">
                              {message.agentSteps.map((step, idx) => {
                                const config = AGENT_CONFIG[step.agent as keyof typeof AGENT_CONFIG];
                                const Icon = config?.icon || Server;
                                return (
                                  <div key={idx} className="flex flex-col gap-1 border-b-2 border-gray-600 pb-3 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-1.5 border-2 ${config?.color || 'bg-gray-900 text-white border-gray-400'}`}>
                                        <Icon className="h-4 w-4" />
                                      </div>
                                      <span className="text-sm font-black uppercase text-white">{config?.name || step.agent}</span>
                                      <span className="text-xs font-bold text-gray-500 ml-auto">{step.timestamp}</span>
                                    </div>
                                    <span className="text-sm font-bold pl-12 text-gray-400">{step.message}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading State / Streaming Box */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex flex-col max-w-[85%] items-start">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-primary text-black px-2 py-0.5 text-xs font-black uppercase border-2 border-gray-400 animate-pulse">
                        PROCESSING
                      </span>
                    </div>

                    <div className="bg-gray-900 border-4 border-gray-400 p-5 shadow-[6px_6px_0_0_#ff4f00] min-w-[320px]">
                      
                      <div className="flex items-center justify-between mb-4 pb-4 border-b-4 border-gray-400">
                        <div className="flex items-center gap-3">
                          {currentAgent && AGENT_CONFIG[currentAgent as keyof typeof AGENT_CONFIG] ? (
                            <>
                              <div className={`p-1.5 border-2 ${AGENT_CONFIG[currentAgent as keyof typeof AGENT_CONFIG].color}`}>
                                {(() => {
                                  const Icon = AGENT_CONFIG[currentAgent as keyof typeof AGENT_CONFIG].icon;
                                  return <Icon className="h-4 w-4" />
                                })()}
                              </div>
                              <span className="text-sm font-black uppercase text-white">
                                {AGENT_CONFIG[currentAgent as keyof typeof AGENT_CONFIG].name}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="p-1.5 border-2 bg-gray-900 text-gray-400 border-gray-400">
                                <Terminal className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-black uppercase text-gray-400">INITIALIZING...</span>
                            </>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleCancelRequest} className="h-8 px-3 bg-red-500 text-white hover:bg-gray-400 hover:text-red-500 font-black border-2 border-gray-400 uppercase rounded-none transition-colors">
                          HALT
                        </Button>
                      </div>

                      {/* Progress Log */}
                      {agentSteps.length > 0 && (
                        <div className="space-y-2 mb-4 bg-gray-800 p-3 border-2 border-gray-400">
                          {agentSteps.map((step, idx) => {
                            const config = AGENT_CONFIG[step.agent as keyof typeof AGENT_CONFIG];
                            return (
                              <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-400">
                                <CheckSquare className="h-4 w-4 text-primary" />
                                <span className="uppercase text-white">{config?.name || step.agent} OK</span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Stream content */}
                      {streamingResponse && (
                        <div className="text-base font-medium text-gray-400">
                          {streamingResponse}<span className="inline-block w-3 h-5 ml-1 align-middle bg-primary animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-8" />
            </div>
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="p-6 bg-gray-900 border-t-4 border-gray-400 relative z-20 shrink-0">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              <div className="flex items-start gap-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ENTER COMMAND..."
                  className="flex-1 min-h-[64px] max-h-40 resize-none bg-gray-800 border-4 border-gray-400 focus:border-primary focus:ring-0 text-white placeholder:text-gray-500 placeholder:font-black rounded-none p-4 font-bold text-base uppercase tracking-wider shadow-[4px_4px_0_0_#e5e2e1] focus:shadow-[4px_4px_0_0_#ff4f00] transition-shadow custom-scrollbar"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="h-16 w-16 shrink-0 bg-primary hover:bg-gray-400 text-black hover:text-black disabled:bg-gray-800 disabled:text-gray-600 disabled:border-gray-600 border-4 border-gray-400 rounded-none transition-colors shadow-[4px_4px_0_0_#e5e2e1] disabled:shadow-none active:translate-y-1 active:shadow-none"
                >
                  <Send className="h-6 w-6 stroke-[3]" />
                </Button>
              </div>
              <div className="flex justify-between items-center text-xs font-black text-gray-500 uppercase">
                <span>[SHIFT+ENTER] FOR NEW LINE</span>
                <span>AI OUTPUT MAY BE INACCURATE. VERIFY DATA.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brutalist scrollbar overrides */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: var(--color-gray-900); border-left: 4px solid var(--color-gray-400); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--color-gray-400); border: 2px solid var(--color-gray-900); }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }
        .prose-invert a { color: var(--color-primary); font-weight: 900; text-decoration: underline; text-decoration-thickness: 2px; }
        .prose-invert a:hover { background: var(--color-primary); color: #000; }
        li.list-square { list-style-type: square; }
      `}} />
    </div>
  );
}
