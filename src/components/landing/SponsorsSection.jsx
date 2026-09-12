// src/components/landing/SponsorsSection.jsx

import Container from "../common/Container";

const sponsors = [
  { name: "Google", icon: "G" },
  { name: "Microsoft", icon: "M" },
  { name: "GitHub", icon: "⌥" },
  { name: "AWS", icon: "⚡" },
  { name: "OpenAI", icon: "⬡" },
  { name: "Stripe", icon: "S" },
  { name: "Vercel", icon: "▲" },
];

// Duplicate for seamless loop
const doubled = [...sponsors, ...sponsors];

export default function SponsorsSection() {
  return (
    <section
      className="py-16 overflow-hidden border-y border-muted-slate/20"
    >
      <Container>
        <p
          className="text-center text-xs uppercase tracking-widest font-bold mb-10 text-muted-slate"
        >
          Trusted By Leading Organizations
        </p>
      </Container>

      {/* Marquee track */}
      <div className="relative">
        {/* Left fade - using pale-mint to match global background */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-pale-mint to-transparent"
        />
        {/* Right fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-pale-mint to-transparent"
        />

        <div className="flex animate-marquee gap-8">
          {doubled.map((s, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-6 py-3 rounded-xl whitespace-nowrap shrink-0 bg-white border border-muted-slate/20 shadow-[0_4px_14px_rgba(56,48,46,0.02)]"
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold bg-[#F8FAF9] text-deep-espresso border border-muted-slate/10"
              >
                {s.icon}
              </span>
              <span className="font-bold text-sm text-warm-stone">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
