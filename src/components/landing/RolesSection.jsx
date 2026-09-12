// src/components/landing/RolesSection.jsx

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import { userRoles } from "../../constants/landingData";

const roleColors = [
  {
    border: "border-soft-celadon/50",
    iconBg: "bg-soft-celadon/20",
    iconText: "text-deep-espresso",
    accentBg: "bg-soft-celadon",
  },
  {
    border: "border-muted-slate/40",
    iconBg: "bg-muted-slate/20",
    iconText: "text-deep-espresso",
    accentBg: "bg-muted-slate",
  },
  {
    border: "border-warm-stone/30",
    iconBg: "bg-warm-stone/15",
    iconText: "text-deep-espresso",
    accentBg: "bg-warm-stone",
  },
];

export default function RolesSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Background tint */}
      <div className="absolute inset-0" />

      <Container>
        <SectionTitle
          badge="Built For Everyone"
          title="Designed For Every Role"
          description="Whether you're hosting, competing, mentoring, or judging — HackForge has specialized workflows for every user role."
        />

        <div className="grid md:grid-cols-3 gap-6">
          {userRoles.map((role, i) => {
            const Icon = role.icon;
            const c = roleColors[i % roleColors.length];
            return (
              <div
                key={role.id}
                className={`card-hover relative rounded-3xl p-8 overflow-hidden bg-white border ${c.border} shadow-[0_10px_30px_rgba(56,48,46,0.1)]`}
              >
                <div
                  className={`absolute left-0 top-8 bottom-8 w-1 rounded-full ${c.accentBg}`}
                />

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${c.iconBg} ${c.iconText}`}
                >
                  <Icon />
                </div>

                <h3
                  className="text-xl font-bold mb-3 text-deep-espresso"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {role.title}
                </h3>

                <p className="leading-relaxed text-sm text-warm-stone">{role.description}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
