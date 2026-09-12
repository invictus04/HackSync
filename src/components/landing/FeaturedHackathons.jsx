// src/components/landing/FeaturedHackathons.jsx
// Fetches the first 3 live hackathons from the real backend for the landing page preview.

import { useEffect, useState } from "react";
import { Link } from "react-router";

import Container from "../common/Container";
import SectionTitle from "../common/SectionTitle";
import { getDiscoveryFeed } from "../../features/workspace/services/workspaceService";
import { formatDate } from "../../utils/formatters";

const bgColors = ["bg-[#F8FAF9]", "bg-pale-mint", "bg-[#E5ECE9]"];

function HackathonPreviewCard({ hackathon, idx }) {
  return (
    <div
      className="card-hover group flex flex-col overflow-hidden rounded-3xl bg-white border border-muted-slate/25 shadow-[0_10px_30px_rgba(56,48,46,0.03)]"
    >
      {/* Banner */}
      <div
        className={`h-44 relative overflow-hidden ${bgColors[idx % bgColors.length]}`}
      >
        {/* Dot pattern on banner */}
        <div
          className="absolute inset-0 opacity-15 bg-[size:24px_24px]"
          style={{
            backgroundImage: "radial-gradient(var(--color-muted-slate) 1px, transparent 1px)",
          }}
        />
        <div className="absolute bottom-4 left-5">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-muted-slate/20 text-deep-espresso"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {hackathon.status?.replace("_", " ") || "Live"}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span
            className="text-xs font-bold px-2 py-1 rounded-lg bg-white text-warm-stone border border-muted-slate/15"
          >
            {hackathon.mode || "Online"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3
          className="text-lg font-bold line-clamp-2 mb-2 text-deep-espresso"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {hackathon.title}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-2 flex-1 mb-4 text-warm-stone"
        >
          {hackathon.shortDescription ||
            hackathon.tagline ||
            "Join this exciting hackathon challenge."}
        </p>

        <div
          className="space-y-2 text-sm mb-5 border-t border-muted-slate/15 pt-3.5"
        >
          {hackathon.prizePool && (
            <div className="flex justify-between">
              <span className="text-warm-stone">Prize Pool</span>
              <span className="font-bold text-deep-espresso">
                {hackathon.prizePool}
              </span>
            </div>
          )}
          {hackathon.registrationEnd && (
            <div className="flex justify-between">
              <span className="text-warm-stone">Registration Ends</span>
              <span className="font-bold text-deep-espresso">
                {formatDate(hackathon.registrationEnd)}
              </span>
            </div>
          )}
          {hackathon.minTeamSize && (
            <div className="flex justify-between">
              <span className="text-warm-stone">Team Size</span>
              <span className="font-bold text-deep-espresso">
                {hackathon.minTeamSize}–{hackathon.maxTeamSize}
              </span>
            </div>
          )}
        </div>

        <Link to={`/hackathons/${hackathon.id}`} className="block">
          <button
            className="w-full flex items-center justify-center font-bold text-sm py-3 rounded-xl transition-all bg-soft-celadon text-deep-espresso hover:bg-muted-slate hover:text-white"
          >
            <span>View Details</span>
          </button>
        </Link>
      </div>
    </div>
  );
}

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div
      className="overflow-hidden rounded-3xl animate-pulse bg-white border border-muted-slate/15"
    >
      <div className="h-44 bg-[#F8FAF9]" />
      <div className="p-6 space-y-3">
        <div
          className="h-3 w-24 rounded-full bg-muted-slate/10"
        />
        <div
          className="h-5 w-3/4 rounded-full bg-muted-slate/10"
        />
        <div
          className="h-3 w-full rounded-full bg-muted-slate/5"
        />
        <div
          className="h-3 w-2/3 rounded-full bg-muted-slate/5"
        />
        <div
          className="mt-6 h-11 w-full rounded-xl bg-soft-celadon/30"
        />
      </div>
    </div>
  );
}

export default function FeaturedHackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await getDiscoveryFeed(0, 3);
        setHackathons((response.content || []).slice(0, 3));
      } catch {
        // Silently fail — landing page still renders without featured section
        setHackathons([]);
      } finally {
        setLoading(false);
      }
    }
    fetchFeatured();
  }, []);

  // Don't render the section if there's nothing to show and we're not loading
  if (!loading && hackathons.length === 0) return null;

  return (
    <section className="relative py-28 overflow-hidden">
      <Container>
        <SectionTitle
          badge="Featured Events"
          title="Explore Trending Hackathons"
          description="Discover exciting hackathons from top communities, universities, and organizations worldwide."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : hackathons.map((hackathon, i) => (
                <HackathonPreviewCard
                  key={hackathon.id}
                  hackathon={hackathon}
                  idx={i}
                />
              ))}
        </div>

        {!loading && hackathons.length > 0 && (
          <div className="mt-14 text-center">
            <Link to="/hackathons">
              <button
                className="px-10 py-3 rounded-xl font-bold text-sm transition-all bg-transparent text-warm-stone border border-muted-slate/30 hover:text-deep-espresso hover:border-muted-slate/50 hover:bg-pale-mint/30"
              >
                Browse All Hackathons →
              </button>
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}
