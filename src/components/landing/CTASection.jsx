// src/components/landing/CTASection.jsx

import Container from "../common/Container";
import { useNavigate } from "react-router";

const stats = [
  { value: "500+", label: "Hackathons Hosted" },
  { value: "10K+", label: "Active Developers" },
  { value: "98%", label: "Satisfaction Rate" },
];

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="py-24">
      <Container>
        <div
          className="relative overflow-hidden rounded-3xl bg-white border border-muted-slate/25 shadow-[0_24px_60px_rgba(56,48,46,0.05)]"
        >
          {/* Subtle top accent line */}
          <div
            className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-soft-celadon/50 to-transparent"
          />

          {/* Dot pattern texture (using light theme dots) */}
          <div
            className="absolute inset-0 pointer-events-none opacity-15 bg-[size:24px_24px]"
            style={{
              backgroundImage:
                "radial-gradient(var(--color-muted-slate) 1px, transparent 1px)",
            }}
          />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center px-8 md:px-16 py-16 md:py-20">
            {/* Left side content */}
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-5 text-muted-slate">
                Get Started Today
              </p>

              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-5 text-deep-espresso"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Ready to build something{" "}
                <span className="text-soft-celadon">amazing</span>?
              </h2>

              <p
                className="text-base md:text-lg leading-relaxed mb-10 text-warm-stone max-w-[520px]"
              >
                Whether you're organizing your first hackathon or joining as a
                participant — we've got everything you need.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/host-hackathon")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[0.9rem] cursor-pointer transition-all duration-200 ease-in-out bg-soft-celadon text-deep-espresso shadow-[0_2px_16px_rgba(156,174,169,0.3)] hover:-translate-y-px hover:bg-muted-slate hover:text-white hover:shadow-[0_6px_24px_rgba(120,133,133,0.35)]"
                >
                  Start Hosting
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => navigate("/hackathons")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[0.9rem] cursor-pointer transition-all duration-200 ease-in-out bg-transparent text-warm-stone border border-muted-slate/30 hover:text-deep-espresso hover:border-muted-slate/50 hover:bg-pale-mint/10"
                >
                  Explore Events
                </button>
              </div>

              {/* Divider */}
              <div
                className="my-12 border-t border-muted-slate/15"
              />

              {/* Bottom row: stats */}
              <div className="grid grid-cols-3 gap-8 max-w-lg">
                {stats.map((s, i) => (
                  <div key={i}>
                    <p
                      className="text-2xl md:text-3xl font-bold text-deep-espresso"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="text-xs mt-1 uppercase tracking-wider font-semibold text-muted-slate"
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side image */}
            <div className="hidden lg:block relative h-full min-h-[400px] w-full rounded-2xl overflow-hidden border border-muted-slate/20 shadow-lg">
              <img
                src="/hackathon_img.jpg"
                alt="Hackathon Event"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-deep-espresso/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
