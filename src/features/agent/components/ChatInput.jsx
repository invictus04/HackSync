import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

const MAX_HEIGHT = 160;

const ChatInput = ({ onSend, disabled = false }) => {
  const [message, setMessage] = useState("");
  const inputRef = useRef(null);

  const canSend = message.trim().length > 0 && !disabled;

  // Focus again whenever the input becomes available
  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  // Grow with content, up to MAX_HEIGHT
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [message]);

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    setMessage("");
    try {
      await onSend(trimmed);
    } catch {
      setMessage(trimmed); // give the text back if sending failed
    }
  };

  const handleKeyDown = (e) => {
    // Ignore Enter while an IME (e.g. Japanese, Chinese) is composing
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className={`flex items-end gap-2 rounded-3xl border border-neutral-200 bg-white p-2 pl-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-200 focus-within:border-neutral-300 focus-within:shadow-[0_4px_20px_rgba(0,0,0,0.06)] ${disabled ? "opacity-70" : ""
          }`}
      >
        <textarea
          ref={inputRef}
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything"
          aria-label="Message"
          disabled={disabled}
          className="min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-5 text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed"
          style={{ maxHeight: MAX_HEIGHT }}
        />

        <button
          type="submit"
          disabled={!canSend}
          aria-label={disabled ? "Waiting for response" : "Send message"}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 ${canSend
              ? "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-95"
              : "cursor-not-allowed bg-neutral-100 text-neutral-400"
            }`}
        >
          {disabled ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600" />
          ) : (
            <FiArrowUp className="h-[18px] w-[18px]" strokeWidth={2.5} />
          )}
        </button>
      </div>

      <p className="mt-2 text-center text-xs text-neutral-400">
        Enter to send · Shift + Enter for a new line
      </p>
    </form>
  );
};

export default ChatInput;