// ./src/features/agent/components/ChatInput.jsx import { useState, useRef, useEffect } from "react";
import { FiSend } from "react-icons/fi";
const ChatInput = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);
  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;
    setMessage("");
    await onSend(trimmedMessage);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      {" "}
      <div className="relative flex w-full items-center">
        {" "}
        <textarea
          ref={inputRef}
          rows="1"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... (Press Enter to send)"
          disabled={disabled}
          className="w-full resize-none rounded-2xl border bg-white px-5 py-4 pr-16 text-sm text-[#38302E] shadow-sm outline-none transition-all placeholder:text-[#6F6866]"
          style={{
            minHeight: "56px",
            maxHeight: "120px",
            borderColor: "rgba(120, 133, 133, 0.4)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#9CAEA9";
            e.target.style.boxShadow = "0 0 0 4px rgba(156, 174, 169, 0.15)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(120, 133, 133, 0.4)";
            e.target.style.boxShadow = "none";
          }}
        />{" "}
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="absolute right-2 flex h-10 w-10 items-center justify-center rounded-xl transition-all disabled:cursor-not-allowed"
          style={{
            background:
              disabled || !message.trim()
                ? "rgba(120, 133, 133, 0.1)"
                : "#9CAEA9",
            color: disabled || !message.trim() ? "#788585" : "#38302E",
          }}
          onMouseEnter={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.background = "#788585";
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.transform = "translateY(-2px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!disabled && message.trim()) {
              e.currentTarget.style.background = "#9CAEA9";
              e.currentTarget.style.color = "#38302E";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {" "}
          {disabled && !message.trim() ? (
            <FiSend className="ml-0.5 h-4 w-4" />
          ) : disabled ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[rgba(120,133,133,0.3)] border-t-[#38302E]" />
          ) : (
            <FiSend className="ml-0.5 h-4 w-4" />
          )}{" "}
        </button>{" "}
      </div>{" "}
    </form>
  );
};
export default ChatInput;
