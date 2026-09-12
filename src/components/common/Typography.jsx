// src/components/common/Typography.jsx

export function SectionHeading({ children, className = "" }) {
  return (
    <h2
      className={`
                text-4xl
                md:text-5xl
                font-bold
                leading-tight
                ${className}
            `}
    >
      {children}
    </h2>
  );
}

export function SectionDescription({ children, className = "" }) {
  return (
    <p
      className={`
                mt-6
                text-lg
                text-slate-400
                leading-relaxed
                ${className}
            `}
    >
      {children}
    </p>
  );
}
