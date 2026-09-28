// src/components/ui/ChatbotFAB.jsx
// Floating Action Button — shown on every page, routes to /chatbot on click.

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { TbMessageChatbot } from "react-icons/tb";

export default function ChatbotFAB() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isChatbotPage = location.pathname === "/chatbot";

  useEffect(() => {
    let t;
    if (isChatbotPage) {
      t = setTimeout(() => setVisible(false), 0);
    } else {
      t = setTimeout(() => setVisible(true), 300);
    }
    return () => clearTimeout(t);
  }, [isChatbotPage]);

  if (isChatbotPage) return null;

  return (
    <>
      <div
        className={`
                    fixed bottom-[88px] right-6 z-[9999]
                    pointer-events-none select-none
                    transition-all duration-300
                    ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"}
                `}
      >
        <span
          className="
                    whitespace-nowrap rounded-xl
                    border border-mutedSlate/30
                    bg-white backdrop-blur-md
                    px-3.5 py-1.5
                    text-xs font-semibold text-deepEspresso
                    shadow-lg shadow-black/10
                "
        >
          Ask HackSync AI
        </span>
        <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-4 border-transparent border-l-white" />
      </div>

      <button
        id="chatbot-fab"
        aria-label="Open AI Chatbot"
        onClick={() => navigate("/chatbot")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
                    fixed bottom-6 right-6 z-[9999]
                    flex h-14 w-14 items-center justify-center
                    rounded-full
                    bg-white
                    text-deepEspresso shadow-xl shadow-black/15
                    cursor-pointer
                    transition-all duration-500 ease-out
                    hover:scale-110 hover:shadow-2xl hover:shadow-black/25
                    active:scale-95
                    ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                `}
        style={{ willChange: "transform, opacity" }}
      >
        {/* Animated ping ring */}
        <span className="absolute inset-0 rounded-full bg-white animate-ping" />
        {/* Icon */}
        <TbMessageChatbot size={26} className="relative z-10 drop-shadow-sm" />
      </button>
    </>
  );
}
