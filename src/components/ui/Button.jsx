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
      "bg-dark-khaki hover:bg-deep-espresso text-white shadow-lg shadow-dark-khaki/20 hover:-translate-y-0.5",

    secondary:
      "bg-warm-stone hover:bg-white text-deep-espresso border border-warm-stone hover:border-dark-khaki shadow-sm",

    outline:
      "border border-warm-stone text-deep-espresso hover:bg-dark-khaki hover:text-white",
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
