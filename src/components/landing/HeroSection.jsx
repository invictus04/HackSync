// /src/components/landing/HeroSection.jsx

import Container from "../common/Container";
import { useNavigate } from "react-router";

const stats = [
  { value: "500+", label: "Hackathons" },
  { value: "10K+", label: "Developers" },
  { value: "2K+", label: "Projects Built" },
];

const activityItems = [
  {
    team: "Team Quantum",
    action: "Submitted project",
    color: "bg-pale-mint text-deep-espresso",
  },
  {
    team: "Neural Forge",
    action: "Joined hackathon",
    color: "bg-pale-mint text-deep-espresso",
  },
  {
    team: "ByteWizards",
    action: "Mentor session",
    color: "bg-pale-mint text-deep-espresso",
  },
];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Container>
        <div className="relative grid lg:grid-cols-2 gap-20 items-center py-24 lg:py-0">
          <div className="animate-fade-in-up">
            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                lineHeight: 1.1,
              }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-deep-espresso"
            >
              Build. <span className="text-muted-slate">Collaborate.</span>
              <br />
              Compete.
            </h1>

            <p className="text-lg leading-relaxed max-w-lg mb-10 text-warm-stone">
              The complete platform for organizing, managing, mentoring, and
              judging world-class hackathons — all in one place.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/hackathons")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] font-semibold text-[0.95rem] cursor-pointer transition-all duration-250 ease-in-out bg-soft-celadon text-deep-espresso shadow-[0_4px_14px_rgba(156,174,169,0.3)] hover:-translate-y-0.5 hover:bg-muted-slate hover:text-white hover:shadow-[0_8px_24px_rgba(120,133,133,0.3)]"
              >
                Explore Hackathons
                <svg
                  width="16"
                  height="16"
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
                onClick={() => navigate("/host-hackathon")}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[14px] font-semibold text-[0.95rem] cursor-pointer transition-all duration-250 ease-in-out bg-white text-deep-espresso border border-muted-slate hover:bg-[#F8FAF9] hover:border-deep-espresso hover:-translate-y-0.5"
              >
                Host a Hackathon
              </button>
            </div>

            {/* Stats */}
            <div
              className="flex gap-8 mt-14 pt-10 border-t border-muted-slate/20"
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <p
                    className="text-3xl font-bold text-deep-espresso"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="text-sm text-warm-stone mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Dashboard Mockup ── */}
          <div className="relative animate-float hidden lg:block">
            {/* Main card */}
            <div
              className="relative bg-white rounded-[32px] p-6 overflow-hidden shadow-[0_24px_60px_rgba(56,48,46,0.08)] border border-muted-slate/30"
            >
              {/* Header row */}
              <div className="relative flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-muted-slate uppercase tracking-wider mb-1 font-semibold">
                    Active Hackathon
                  </p>
                  <h3 className="text-xl font-bold text-deep-espresso">
                    AI Innovation Challenge
                  </h3>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-600 text-xs font-bold">
                    LIVE
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="relative grid grid-cols-2 gap-3 mb-4">
                {[
                  {
                    label: "Participants",
                    value: "1,240",
                    bg: "#F8FAF9",
                    text: "text-deep-espresso",
                  },
                  {
                    label: "Teams",
                    value: "312",
                    bg: "#F8FAF9",
                    text: "text-deep-espresso",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-5 border border-muted-slate/15"
                    style={{
                      background: s.bg,
                    }}
                  >
                    <p className="text-xs text-warm-stone mb-2 font-medium">
                      {s.label}
                    </p>
                    <p
                      className={`text-3xl font-bold ${s.text}`}
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Activity Feed */}
              <div
                className="relative rounded-2xl p-5 bg-white border border-muted-slate/15"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-deep-espresso">
                    Recent Activity
                  </p>
                  <span
                    className="text-xs font-semibold text-muted-slate"
                  >
                    Live Updates
                  </span>
                </div>
                <div className="space-y-4">
                  {activityItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${item.color}`}
                        >
                          {item.team.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-deep-espresso">
                            {item.team}
                          </p>
                          <p className="text-xs text-warm-stone mt-0.5">
                            {item.action}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-soft-celadon font-medium">
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
