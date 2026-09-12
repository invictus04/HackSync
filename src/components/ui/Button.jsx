// /src/components/ui/Button.jsx

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "px-6 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer";

  const variants = {
    primary:
      "bg-deep-espresso hover:bg-muted-slate text-white shadow-lg shadow-deep-espresso/10 hover:-translate-y-0.5",

    secondary:
      "bg-soft-celadon hover:bg-white text-deep-espresso border border-soft-celadon hover:border-muted-slate/20 shadow-sm",

    outline:
      "border border-muted-slate/20 text-deep-espresso hover:bg-muted-slate hover:text-white",
  };

  return (
    <button
      className={`
                ${baseStyles}
                ${variants[variant]}
                ${className}
            `}
      {...props}
    >
      {children}
    </button>
  );
}
