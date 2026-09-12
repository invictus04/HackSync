// src/components/landing/TestimonialsSection.jsx

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Hackathon Organizer",
    initials: "RS",
    color: "bg-soft-celadon",
  },
  {
    id: 2,
    name: "Priya Verma",
    role: "Participant",
    initials: "PV",
    color: "bg-pale-mint",
  },
  {
    id: 3,
    name: "Ankit Patel",
    role: "Judge",
    initials: "AP",
    color: "bg-muted-slate",
  },
];

const feedbackData = [
  "HackSync completely transformed the way we manage hackathons and judging workflows. The organizer dashboard alone saved us 10+ hours per event.",
  "The team collaboration and submission system made our experience incredibly smooth. We could focus on building instead of wrestling with logistics.",
  "Clean evaluation dashboards and rubric scoring saved hours during project reviews. Blind-mode judging ensured completely unbiased results.",
];

function StarRating() {
  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" className="fill-soft-celadon">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <Container>
        <SectionTitle
          badge="Community Feedback"
          title="Loved By Developers & Organizers"
          description="Thousands of innovators trust HackSync to run and participate in world-class hackathons."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className="card-hover relative rounded-3xl p-8 flex flex-col bg-white border border-muted-slate/20 shadow-[0_10px_30px_rgba(56,48,46,0.03)]"
            >
              {/* Big quote mark */}
              <span
                className="absolute top-6 right-7 text-6xl font-bold leading-none select-none text-soft-celadon/20"
                style={{
                  fontFamily: "Georgia, serif",
                }}
              >
                "
              </span>

              <StarRating />

              <p
                className="leading-relaxed flex-1 text-sm mb-8 text-warm-stone"
              >
                {feedbackData[idx]}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${t.color} text-deep-espresso`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm text-deep-espresso">
                    {t.name}
                  </p>
                  <p
                    className="text-xs font-medium text-muted-slate"
                  >
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
