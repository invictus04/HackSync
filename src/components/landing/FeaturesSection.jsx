// src/components/landing/FeaturesSection.jsx

import SectionTitle from "../common/SectionTitle";
import FeatureCard from "./FeatureCard";
import { platformFeatures } from "../../constants/landingData";
import Container from "../common/Container";

export default function FeaturesSection() {
  return (
    <section className="relative py-28 dot-pattern">
      {/* Subtle section glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-soft-celadon/40 to-transparent"
      />

      <Container>
        <SectionTitle
          badge="Platform Features"
          title="Everything You Need To Run A Hackathon"
          description="Powerful tools for organizers, participants, judges, and mentors — all in one platform."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feature, i) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
