import { FaRobot } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const ChatMessage = ({ message }) => {
  const isUser = message.role === "user"; 
  // Custom renderers for markdown elements to make them look beautiful and fit the theme
  const markdownComponents = {
    p: ({ ...props }) => <p className="mb-3 last:mb-0" {...props} />,
    a: ({ ...props }) => (
      <a
        className="font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity text-softCeladon"
        
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    ul: ({ ...props }) => (
      <ul
        className="mb-4 list-outside list-disc pl-5 last:mb-0 space-y-1.5"
        {...props}
      />
    ),
    ol: ({ ...props }) => (
      <ol
        className="mb-4 list-outside list-decimal pl-5 last:mb-0 space-y-1.5"
        {...props}
      />
    ),
    li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
    strong: ({ ...props }) => (
      <strong className="font-bold text-deepEspresso" {...props} />
    ),
    table: ({ ...props }) => (
      <div className="my-4 overflow-x-auto rounded-xl border border-mutedSlate/20 shadow-sm">
        {" "}
        <table
          className="w-full border-collapse text-left text-sm"
          {...props}
        />{" "}
      </div>
    ),
    thead: ({ ...props }) => <thead className="bg-slate-50" {...props} />,
    th: ({ ...props }) => (
      <th
        className="border-b border-mutedSlate/20 px-4 py-3 font-semibold text-deepEspresso"
        {...props}
      />
    ),
    td: ({ ...props }) => (
      <td
        className="border-b border-mutedSlate/10 px-4 py-3 last:border-0"
        {...props}
      />
    ),
    h1: ({ ...props }) => (
      <h1
        className="mb-4 mt-6 text-2xl font-bold tracking-tight first:mt-0 text-deepEspresso"
        {...props}
      />
    ),
    h2: ({ ...props }) => (
      <h2
        className="mb-3 mt-5 text-xl font-bold tracking-tight first:mt-0 text-deepEspresso"
        {...props}
      />
    ),
    h3: ({ ...props }) => (
      <h3
        className="mb-3 mt-4 text-lg font-bold tracking-tight first:mt-0 text-deepEspresso"
        {...props}
      />
    ),
    blockquote: ({ ...props }) => (
      <blockquote
        className="my-4 border-l-4 pl-4 text-warmStone italic"
        
        {...props}
      />
    ),
    code(props) {
      const { children, className, ...rest } = props;
      const { node, ...cleanRest } = rest;
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match && !String(children).includes("\n");
      return isInline ? (
        <code
          className="rounded-md px-1.5 py-0.5 font-mono text-[13px] bg-slate-50 text-deepEspresso border border-mutedSlate/15"
          {...cleanRest}
        >
          {children}
        </code>
      ) : (
        <div className="my-4 overflow-hidden rounded-xl shadow-md border border-mutedSlate/20">
          <div className="flex items-center border-b border-mutedSlate/15 px-4 py-2 font-mono text-xs font-semibold bg-slate-50 text-mutedSlate">
            {match ? match[1] : "text"}
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed bg-white text-deepEspresso">
            <code className={className} {...cleanRest}>
              {children}
            </code>
          </pre>
        </div>
      );
    },
  };
  return (
    <div
      className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex max-w-[85%] items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-sm text-deepEspresso ${isUser ? "bg-softCeladon" : "bg-deepEspresso"}`}
        >
          {isUser ? (
            <FiUser className="h-4 w-4" />
          ) : (
            <FaRobot className="h-4 w-4" />
          )}
        </div>
        <div
          className={`relative rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed shadow-sm ${isUser ? "rounded-br-sm bg-paleMint text-deepEspresso font-medium" : "rounded-bl-sm bg-white text-deepEspresso border"}`}
          
        >
          <div className="break-words">
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatMessage;
