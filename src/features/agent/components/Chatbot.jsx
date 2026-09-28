import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChat } from "../hooks/useChat";
import { BsStars } from "react-icons/bs";
import { FiArrowUpRight } from "react-icons/fi";

const SUGGESTIONS = [
  "Show available hackathons",
  "Show my hackathons",
  "How to form a team?",
];

const Chatbot = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="flex h-[85vh] min-h-[560px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-neutral-100 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900">
            <BsStars className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <h1 className="text-[15px] font-semibold text-neutral-900">
              Hackathon Assistant
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-neutral-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Online
            </p>
          </div>
        </header>

        {/* Messages */}
        <main className="flex-1 space-y-6 overflow-y-auto scroll-smooth px-6 py-6">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center">
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                How can I help you today?
              </h2>
              <p className="mt-2 max-w-sm text-center text-sm leading-6 text-neutral-500">
                Ask about hackathons, team formation, projects, and more.
              </p>

              <div className="mt-8 w-full max-w-sm divide-y divide-neutral-100 overflow-hidden rounded-2xl">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendMessage(suggestion)}
                    className="group flex w-full items-center justify-between px-4 py-3.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:bg-neutral-50 focus-visible:outline-none"
                  >
                    {suggestion}
                    <FiArrowUpRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-neutral-900" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div
              className="flex items-center gap-1.5 px-1 py-2"
              role="status"
              aria-label="Assistant is typing"
            >
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-400" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </main>

        {/* Input */}
        <div className="bg-white px-5 pb-4 pt-2">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;