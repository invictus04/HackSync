// src/components/common/SectionTitle.jsx

export default function SectionTitle({ badge, title, description }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      {badge && (
        <span
          className="mb-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-soft-celadon text-sm font-semibold text-muted-slate"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-soft-celadon" />
          {badge}
        </span>
      )}

      <h2
        className="text-4xl md:text-5xl font-bold leading-tight text-deep-espresso"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h2>

      {description && (
        <p
          className="mt-5 text-lg leading-relaxed text-warm-stone"
        >
          {description}
        </p>
      )}
    </div>
  );
}
