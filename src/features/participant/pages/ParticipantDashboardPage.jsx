import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import {
  FaCalendarAlt,
  FaArrowRight,
  FaRocket,
  FaSearch,
} from "react-icons/fa";
import { getMyHackathons } from "../services/participantService";
import Navbar from "../../../components/layout/Navbar"; 

const STATUS_STYLES = {
  APPROVED: {
    bg: "bg-emerald-100 border-emerald-200",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  ACTIVE: {
    bg: "bg-blue-100 border-blue-200",
    text: "text-blue-800",
    dot: "bg-blue-500",
  },
  COMPLETED: {
    bg: "bg-warm-stone/20 border-warm-stone/30",
    text: "text-deep-espresso",
    dot: "bg-warm-stone",
  },
  DRAFT: {
    bg: "bg-amber-100 border-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  PUBLISHED: {
    bg: "bg-dark-khaki/20 border-dark-khaki/30",
    text: "text-dark-khaki",
    dot: "bg-dark-khaki",
  },
  REJECTED: {
    bg: "bg-red-100 border-red-200",
    text: "text-red-800",
    dot: "bg-red-500",
  },
};

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.DRAFT;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold shadow-sm ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} /> {status}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-warm-stone/30 bg-corn-silk overflow-hidden shadow-sm">
      <div className="h-44 bg-warm-stone/20" />
      <div className="p-6 space-y-4">
        <div className="h-6 w-3/4 rounded bg-warm-stone/20" />
        <div className="h-4 w-1/2 rounded bg-warm-stone/20" />
        <div className="h-4 w-2/3 rounded bg-warm-stone/20 mt-2" />
        <div className="h-11 rounded-xl bg-warm-stone/20 mt-4" />
      </div>
    </div>
  );
}

function HackathonCard({ hackathon }) {
  return (
    <div className="group flex flex-col rounded-2xl border border-warm-stone/30 bg-corn-silk overflow-hidden hover:border-dark-khaki/60 transition-all duration-300 hover:shadow-xl hover:shadow-dark-khaki/10">
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-dark-khaki/20 via-deep-espresso/5 to-pale-mint/20">
        {hackathon.bannerImageUrl ? (
          <img
            src={hackathon.bannerImageUrl}
            alt={hackathon.title}
            className="h-full w-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <FaRocket className="text-dark-khaki/30 transition-transform duration-500 group-hover:scale-110 group-hover:text-dark-khaki/50" size={56} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-espresso/80 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4">
          <StatusBadge status={hackathon.hackathonStatus} />
        </div>
        {hackathon.profileImageUrl && (
          <img
            src={hackathon.profileImageUrl}
            alt=""
            className="absolute bottom-3 right-3 h-12 w-12 rounded-xl object-cover border-2 border-white shadow-md"
          />
        )}
      </div>
      
      {/* Content */}
      <div className="flex flex-1 flex-col p-6 bg-corn-silk">
        <h3 className="text-xl font-bold text-deep-espresso leading-snug line-clamp-2 group-hover:text-dark-khaki transition-colors">
          {hackathon.title}
        </h3>
        <p className="mt-2 text-sm text-warm-stone line-clamp-2">
          {hackathon.tagline}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-warm-stone font-semibold bg-white w-fit px-3 py-1.5 rounded-lg border border-warm-stone/10">
          <FaCalendarAlt size={12} className="text-dark-khaki" />
          <span>
            {fmtDate(hackathon.hackathonStart)} — {fmtDate(hackathon.hackathonEnd)}
          </span>
        </div>
        <div className="mt-2 text-xs text-warm-stone font-semibold bg-white w-fit px-3 py-1.5 rounded-lg border border-warm-stone/10">
          Team size: {hackathon.minTeamSize}–{hackathon.maxTeamSize} members
        </div>
        <div className="mt-auto pt-6">
          <Link
            to={`/workspace/${hackathon.id}/overview`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-dark-khaki px-4 py-3 text-sm font-bold text-white transition-colors duration-300 hover:bg-deep-espresso shadow-md"
          >
            Open Workspace <FaArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-warm-stone/40 bg-corn-silk/50 py-24 text-center px-4">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm mb-6 border border-warm-stone/20">
        <FaRocket className="text-dark-khaki" size={40} />
      </div>
      <h3 className="text-2xl font-bold text-deep-espresso">No Hackathons Yet</h3>
      <p className="mt-3 max-w-md text-sm text-warm-stone leading-relaxed">
        You haven't joined any hackathons. Browse open hackathons and create your team to get started on your next big idea.
      </p>
      <Link
        to="/hackathons"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-dark-khaki px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-deep-espresso hover:shadow-lg hover:-translate-y-0.5 shadow-md"
      >
        <FaSearch size={14} /> Browse Hackathons
      </Link>
    </div>
  );
}

export default function ParticipantDashboardPage() {
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getMyHackathons()
      .then(setHackathons)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Dashboard Header */}
      <div className="border-b border-warm-stone/20 bg-corn-silk rounded-2xl px-5 py-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-widest text-dark-khaki mb-3 flex items-center gap-2">
              <span className="w-8 h-1 bg-dark-khaki rounded-full"></span> Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-deep-espresso">My Hackathons</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/hackathons"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-dark-khaki bg-white px-6 py-3 text-sm font-bold text-dark-khaki transition-all duration-300 hover:bg-dark-khaki hover:text-white shadow-sm"
            >
              <FaSearch size={14} /> Browse Hackathons
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mx-auto max-w-6xl px-5 py-16">
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((k) => (
              <SkeletonCard key={k} />
            ))}
          </div>
        ) : hackathons.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="flex items-center gap-3 mb-8">
                <div className="h-8 w-1.5 bg-dark-khaki rounded-full"></div>
                <p className="text-lg font-bold text-deep-espresso">
                {hackathons.length} hackathon{hackathons.length !== 1 ? "s" : ""} registered
                </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {hackathons.map((h) => (
                <HackathonCard key={h.id} hackathon={h} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
