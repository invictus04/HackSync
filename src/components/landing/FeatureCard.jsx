// src/components/landing/FeatureCard.jsx

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}) {
  return (
    <div
      className="card-hover group relative overflow-hidden rounded-3xl p-8 bg-white border border-muted-slate/20 shadow-[0_10px_30px_rgba(56,48,46,0.03)]"
    >
      {/* Minimal top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-soft-celadon to-transparent"
      />

      {/* Inner subtle glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(204, 218, 209, 0.3) 0%, transparent 70%)",
        }}
      />

      {/* Icon */}
      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-xl mb-6 transition-transform duration-300 group-hover:scale-110 bg-[#F8FAF9] text-muted-slate border border-muted-slate/15"
      >
        <Icon />
      </div>

      <h3
        className="relative text-xl font-bold mb-3 text-deep-espresso"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {title}
      </h3>

      <p
        className="relative leading-relaxed text-sm text-warm-stone"
      >
        {description}
      </p>
    </div>
  );
}
