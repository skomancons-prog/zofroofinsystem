/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function ChatBot() {
  const { language, t } = useLanguage();
  
  const initialGreeting = language === "tw"
    ? "Akwaaba! ZOF AI wo w'akyi. Bisa me biribiara fa Selflock® dadi, Aluminium sheets, nsɛm mfididano (woodwork carpentry), anaa abrokyire adan siesie ho!"
    : "Hello! Welcome to Zof Group. I am ZOF AI, your virtual structural and roofing expert. Whether you need information on our interlocking Selflock® anti-leak sheets, raw Plain Aluminium for coastal corrosion defense, structural steel trusses, woodwork/carpentry services, or how we supervise projects remotely for clients living abroad, I am here to help. Ask me anything!";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      role: "model",
      text: initialGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Update greeting on language toggle if user hasn't started chatting
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "initial") {
      setMessages([
        {
          id: "initial",
          role: "model",
          text: initialGreeting,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [language]);

  const quickQuestions = language === "tw"
    ? [
        "Dɛn ne Selflock® nsuo nse-ase kwan no?",
        "Bere bɛn na me paw Aluminium sheets?",
        "Mmoa bɛn na mo de ma abrokyirefoɔ?",
        "Mfeɛ mmeɛnsa nsuo nse-ase bɔhyɛ no te sɛn?",
      ]
    : [
        "What is the Selflock® anti-leak design?",
        "When should I select raw Aluminium sheets?",
        "How do you coordinate woodwork & carpentry?",
        "Do you offer site supervision for overseas clients?",
      ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const chatPayload = [...messages, userMessage].map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatPayload }),
      });

      if (!res.ok) {
        throw new Error("Chat link disrupted. Please verify connection and retry.");
      }

      const data = await res.json();

      const modelMessage: ChatMessage = {
        id: "msg-" + (Date.now() + 1),
        role: "model",
        text: data.text || "I apologize, my analysis engine was interrupted. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, modelMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: "msg-err-" + Date.now(),
        role: "model",
        text: "System response: " + (err.message || "I am currently undergoing scheduled system updates. Please try using our instant estimators above or schedule an inspection below!"),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "initial",
        role: "model",
        text: "Chat refreshed. ZOF AI online. How can we support your structural woodwork or premium profiling projects today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <section id="consultant" className="py-20 bg-[#F3E5C8] border-b border-stone-200/80 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Module Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-3.5 py-1 text-xs text-blue-700 mb-4 select-none">
            <Bot className="h-4 w-4 text-blue-600" />
            <span className="font-mono uppercase tracking-wider font-semibold">
              {language === "tw" ? "AI Mfididano Afotufoɔ" : "Virtual Expert Consultant"}
            </span>
          </div>
          <h2 className="font-sans font-black text-3xl text-stone-900 tracking-tight mb-3">
            {t.chatbot.title}
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            {t.chatbot.subtitle}
          </p>
        </div>

        {/* Console Box Layout */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg overflow-hidden flex flex-col h-[580px]">
          
          {/* Console Header */}
          <div className="bg-stone-50 p-4 border-b border-stone-200 flex justify-between items-center px-6">
            <div className="flex items-center space-x-3.5 text-left">
              <div className="relative">
                <div className="h-10 w-10 bg-gradient-to-tr from-blue-600 to-blue-700 rounded-full flex items-center justify-center border border-stone-200">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-stone-50 animate-ping" />
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-stone-50" />
              </div>
              <div className="text-left">
                <p className="font-sans font-bold text-sm text-stone-900 leading-none">ZOF AI Assistant</p>
                <p className="text-[10px] text-blue-700 font-mono font-bold mt-1">ZOF Structural & Roofing Consultant</p>
              </div>
            </div>
            
            <button
              onClick={clearChat}
              className="p-2 text-stone-500 hover:text-red-600 rounded-lg bg-white border border-stone-200 hover:border-red-200 transition-all select-none cursor-pointer"
              title="Clear transcript history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Transcript Scroll Area */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FCFBF9] scroll-smooth"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex max-w-[85%] items-start space-x-3 ${
                  m.role === "user" ? "ml-auto flex-row-reverse space-x-reverse" : "mr-auto"
                }`}
              >
                {/* Chat Avatar */}
                <div
                  className={`h-8.5 w-8.5 shrink-0 rounded-full flex items-center justify-center shadow-md select-none ${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gradient-to-tr from-stone-100 to-stone-50 text-blue-700 border border-stone-200"
                  }`}
                >
                  {m.role === "user" ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                </div>

                {/* Content Bubble */}
                <div className="space-y-1 text-left">
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-stone-850 border border-stone-200 rounded-tl-none shadow-sm"
                    }`}
                  >
                    {/* Render newlines beautifully */}
                    {m.text.split("\n").map((line, idx) => (
                      <p key={idx} className={idx > 0 ? "mt-2" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                  <p className={`text-[10px] text-stone-400 font-bold font-mono ${m.role === "user" ? "text-right" : "text-left"}`}>
                    {m.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex items-center space-x-3 mr-auto max-w-[85%]">
                <div className="h-8.5 w-8.5 bg-white border border-stone-200 rounded-full flex items-center justify-center text-blue-600">
                  <Bot className="h-4.5 w-4.5" />
                </div>
                <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-none flex items-center space-x-1.5 font-bold shadow-xs">
                  <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts Chips Selection */}
          <div className="px-6 py-2 bg-stone-50 border-t border-stone-200 flex flex-nowrap overflow-x-auto gap-2 scrollbar-none self-stretch items-center">
            <span className="text-[10px] text-stone-500 font-mono uppercase font-bold tracking-wider shrink-0 select-none mr-1.5">
              Quick Topics:
            </span>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={loading}
                className="text-[11px] font-sans font-semibold text-stone-600 hover:text-blue-700 bg-white border border-stone-200 hover:border-blue-300 px-3 py-1.5 rounded-full shrink-0 select-none cursor-pointer transition-all active:scale-95 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Prompt Entry Form bar */}
          <div className="p-4 bg-stone-50 border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center space-x-2.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about Selflock, carpentry woodwork, plain aluminium, cost..."
                disabled={loading}
                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3.5 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-blue-600 disabled:opacity-75 shadow-xs"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || loading}
                className="p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-xl cursor-pointer select-none transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
}
