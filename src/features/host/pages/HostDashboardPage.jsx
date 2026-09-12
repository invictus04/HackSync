// src/features/hackathons/pages/HostDashboardPage.jsx import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import Navbar from "../../../components/layout/Navbar";
import { getHostHackathons } from "../services/hostService"; // ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  DRAFT: {
    color: "bg-amber-900/40 text-amber-300 border-amber-700/40",
    dot: "bg-amber-400",
  },
  APPROVED: {
    color: "bg-emerald-900/40 text-emerald-300 border-emerald-700/40",
    dot: "bg-emerald-400",
  },
  REJECTED: {
    color: "bg-red-900/40 text-red-300 border-red-700/40",
    dot: "bg-red-400",
  },
  PUBLISHED: {
    color: "bg-indigo-900/40 text-indigo-300 border-indigo-700/40",
    dot: "bg-indigo-400",
  },
  ACTIVE: {
    color: "bg-blue-900/40 text-blue-300 border-blue-700/40",
    dot: "bg-blue-400",
  },
  COMPLETED: {
    color: "bg-slate-700/40 text-[#6F6866] border-slate-600/40",
    dot: "bg-slate-400",
  },
};
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.color}`}
    >
      {" "}
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} /> {status}{" "}
    </span>
  );
} // ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[#788585]/30 bg-white overflow-hidden animate-pulse">
      {" "}
      <div className="h-36 bg-white" />{" "}
      <div className="p-5 space-y-3">
        {" "}
        <div className="h-4 w-20 rounded bg-white" />{" "}
        <div className="h-6 w-48 rounded bg-white" />{" "}
        <div className="h-4 w-64 rounded bg-white" />{" "}
        <div className="h-3 w-40 rounded bg-white" />{" "}
        <div className="mt-4 flex gap-2">
          {" "}
          <div className="h-9 flex-1 rounded-xl bg-white" />{" "}
          <div className="h-9 flex-1 rounded-xl bg-white" />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
} // ─── Hackathon Card ────────────────────────────────────────────────────────────
function HackathonCard({ hackathon }) {
  const navigate = useNavigate();
  function fmtDate(value) {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return (
    <div className="group flex flex-col rounded-2xl border border-[#788585]/30 bg-white overflow-hidden transition hover:border-[#788585]/30 hover:shadow-lg hover:shadow-black/30">
      {" "}
      {/* Banner */}{" "}
      <div className="relative h-36 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
        {" "}
        {hackathon.bannerImageUrl ? (
          <img
            src={hackathon.bannerImageUrl}
            alt=""
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            {" "}
            <span className="text-4xl opacity-20">🏆</span>{" "}
          </div>
        )}{" "}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />{" "}
        {hackathon.profileImageUrl && (
          <img
            src={hackathon.profileImageUrl}
            alt=""
            className="absolute bottom-3 left-4 h-12 w-12 rounded-xl border-2 border-[#788585]/30 object-cover"
          />
        )}{" "}
      </div>{" "}
      {/* Body */}{" "}
      <div className="flex flex-1 flex-col p-5">
        {" "}
        <div className="mb-3 flex items-center justify-between">
          {" "}
          <StatusBadge status={hackathon.hackathonStatus} />{" "}
          <span className="text-xs text-slate-600">#{hackathon.id}</span>{" "}
        </div>{" "}
        <h3 className="text-lg font-bold text-[#38302E] line-clamp-1">
          {hackathon.title}
        </h3>{" "}
        <p className="mt-1 text-sm text-[#6F6866] line-clamp-1">
          {hackathon.tagline}
        </p>{" "}
        <p className="mt-3 text-xs text-[#6F6866]">
          {" "}
          🏆 {fmtDate(hackathon.hackathonStarts)} →{" "}
          {fmtDate(hackathon.hackathonEnds)}{" "}
        </p>{" "}
        {/* Actions */}{" "}
        <div className="mt-auto pt-5 flex">
          {" "}
          <button
            onClick={() => navigate(`/host/hackathon/${hackathon.id}/manage`)}
            className="flex-1 rounded-xl bg-[#9CAEA9]/10 border border-indigo-500/30 py-2.5 text-sm font-bold text-[#9CAEA9] shadow-sm transition-all hover:bg-[#9CAEA9] hover:text-[#38302E] hover:border-indigo-500 hover:shadow-indigo-600/20 hover:-translate-y-0.5 cursor-pointer"
          >
            {" "}
            Manage Hackathon{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
} // ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HostDashboardPage() {
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function load() {
      try {
        const data = await getHostHackathons();
        setHackathons(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);
  return (
    <div className="min-h-screen bg-white text-[#38302E]">
      {" "}
      <Navbar />{" "}
      <div className="py-12 mx-auto max-w-7xl px-5 md:px-8">
        {" "}
        {/* Header */}{" "}
        <div className="mb-10 flex items-start justify-between gap-4">
          {" "}
          <div>
            {" "}
            <p className="text-xs font-semibold uppercase tracking-widest text-[#9CAEA9] mb-2">
              Organizer
            </p>{" "}
            <h1 className="text-4xl font-bold">My Hackathons</h1>{" "}
            <p className="mt-2 text-[#6F6866]">
              All hackathons you've created on HackSync.
            </p>{" "}
          </div>{" "}
          <Link
            to="/host-hackathon"
            className="shrink-0 rounded-xl bg-[#9CAEA9] px-5 py-2.5 text-sm font-semibold text-[#38302E] transition hover:bg-indigo-500"
          >
            {" "}
            + Create New{" "}
          </Link>{" "}
        </div>{" "}
        {/* Grid */}{" "}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {" "}
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />{" "}
          </div>
        ) : hackathons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#788585]/30 bg-white/50 py-20 text-center">
            {" "}
            <p className="text-5xl mb-4">🚀</p>{" "}
            <h3 className="text-xl font-bold text-[#38302E] mb-2">
              No hackathons yet
            </h3>{" "}
            <p className="text-[#6F6866] mb-6">
              Create your first hackathon and inspire the community.
            </p>{" "}
            <Link
              to="/host-hackathon"
              className="inline-block rounded-xl bg-[#9CAEA9] px-6 py-3 font-semibold text-[#38302E] transition hover:bg-indigo-500"
            >
              {" "}
              Create Hackathon →{" "}
            </Link>{" "}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {" "}
            {hackathons.map((h) => (
              <HackathonCard key={h.id} hackathon={h} />
            ))}{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
