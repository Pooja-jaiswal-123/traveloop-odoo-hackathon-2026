"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from "lucide-react";

export default function ChatAgentPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your Traveloop AI. Tell me, where is your dream destination? 🌍" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // ✅ Auto-scroll to bottom jab naya message aaye
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Assistant ka empty message placeholder for streaming
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("http://127.0.0.1:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input, 
          history: messages.slice(-6) // Context maintain karne ke liye
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        lines.forEach((line) => {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", ""));
              if (data.content) {
                setMessages((prev) => {
                  const lastMsg = prev[prev.length - 1];
                  const newContent = lastMsg.content + data.content;
                  return [...prev.slice(0, -1), { ...lastMsg, content: newContent }];
                });
              }
            } catch (e) {
              console.error("Parsing error", e);
            }
          }
        });
      }
    } catch (err) {
      console.error("Chat Error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: "Chat cleared! Where shall we go next? ✈️" }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white border border-slate-100 shadow-2xl rounded-[2.5rem] overflow-hidden">
      
      {/* Header */}
      <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Bot className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Traveloop AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Streaming Live</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              
              {/* Avatar */}
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-blue-50 text-blue-600 border border-blue-100"}`}>
                {msg.role === "user" ? <User size={18} /> : <Sparkles size={18} />}
              </div>

              {/* Bubble */}
              <div className={`relative px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-sm
                ${msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-tr-none font-medium" 
                  : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none"}`}>
                {msg.content || (isTyping && i === messages.length - 1 && (
                  <div className="flex gap-1 py-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-8 bg-white border-t border-slate-50">
        <form onSubmit={handleSend} className="relative group max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Plan a 3-day trip to Tokyo on a budget..."
            className="w-full bg-slate-50 border-2 border-transparent rounded-2xl pl-6 pr-16 py-4 outline-none focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5 transition-all text-slate-800 placeholder:text-slate-400 shadow-inner"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-2.5 h-10 w-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-md disabled:bg-slate-200 disabled:shadow-none"
          >
            {isTyping ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={18} />}
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-4 font-medium uppercase tracking-widest">
          Traveloop AI can make mistakes. Verify important travel info.
        </p>
      </div>
    </div>
  );
}