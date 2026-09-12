import { useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChat } from "../hooks/useChat";
import { FaRobot } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { FiMessageSquare } from "react-icons/fi";
const Chatbot = () => {
  const { messages, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  return (
    <div className="flex h-screen items-center justify-center bg-[#CCDAD1] p-4 transition-colors duration-500">
      {" "}
      <div className="flex h-[80vh] min-h-[600px] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[rgba(120,133,133,0.3)] bg-white shadow-2xl transition-all duration-300">
        {" "}
        {/* Header */}{" "}
        <header className="flex items-center gap-4 border-b border-[rgba(120,133,133,0.2)] bg-[#F8FAF9] px-6 py-4">
          {" "}
          <div className="flex h-10 w-12 items-center justify-center rounded-2xl bg-[#38302E] shadow-sm">
            {" "}
            <FaRobot className="h-6 w-6 text-[#38302E]" />{" "}
          </div>{" "}
          <div>
            {" "}
            <h1 className="text-xl font-bold tracking-tight text-[#38302E]">
              {" "}
              Hackathon Assistant{" "}
            </h1>{" "}
            <p className="flex items-center gap-1.5 text-sm font-medium text-[#788585]">
              {" "}
              <BsStars className="h-3.5 w-3.5 text-[#9CAEA9]" /> AI-powered
              support{" "}
            </p>{" "}
          </div>{" "}
        </header>{" "}
        {/* Messages */}{" "}
        <main className="scroll-smooth flex-1 space-y-6 overflow-y-auto p-6 bg-white">
          {" "}
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center space-y-6 animate-in fade-in duration-700">
              {" "}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F8FAF9] border border-[rgba(120,133,133,0.2)] shadow-sm">
                {" "}
                <FiMessageSquare className="h-10 w-10 text-[#9CAEA9]" />{" "}
              </div>{" "}
              <div className="space-y-2 text-center">
                {" "}
                <h2 className="text-2xl font-bold tracking-tight text-[#38302E]">
                  {" "}
                  How can I help you today?{" "}
                </h2>{" "}
                <p className="mx-auto max-w-sm text-[#6F6866]">
                  {" "}
                  Ask me about hackathons, team formations, projects, and
                  more.{" "}
                </p>{" "}
              </div>{" "}
              <div className="mt-4 grid w-full max-w-md grid-cols-1 gap-3">
                {" "}
                {[
                  "Show available hackathons",
                  "Show my hackathons",
                  "How to form a team?",
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="group relative flex items-center gap-3 rounded-2xl border border-[rgba(120,133,133,0.25)] bg-white p-4 text-left text-sm font-semibold text-[#38302E] transition-all hover:border-[#9CAEA9] hover:bg-[#F8FAF9] hover:shadow-sm"
                  >
                    {" "}
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CCDAD1] text-[#38302E] transition-transform group-hover:scale-110">
                      {" "}
                      <BsStars className="h-4 w-4" />{" "}
                    </div>{" "}
                    {suggestion}{" "}
                  </button>
                ))}{" "}
              </div>{" "}
            </div>
          )}{" "}
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}{" "}
          {isLoading && (
            <div className="flex justify-start">
              {" "}
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-[rgba(120,133,133,0.2)] bg-[#F8FAF9] px-5 py-4 text-sm text-[#6F6866] shadow-sm">
                {" "}
                <div className="flex gap-1">
                  {" "}
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#9CAEA9] [animation-delay:-0.3s]"></span>{" "}
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#9CAEA9] [animation-delay:-0.15s]"></span>{" "}
                  <span className="h-2 w-2 animate-bounce rounded-full bg-[#9CAEA9]"></span>{" "}
                </div>{" "}
                <span className="ml-2 font-semibold">Thinking...</span>{" "}
              </div>{" "}
            </div>
          )}{" "}
          <div ref={messagesEndRef} />{" "}
        </main>{" "}
        {/* Input */}{" "}
        <div className="border-t border-[rgba(120,133,133,0.2)] bg-[#F8FAF9] p-4">
          {" "}
          <ChatInput onSend={sendMessage} disabled={isLoading} />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};
export default Chatbot;
