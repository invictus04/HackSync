// src/features/admin/pages/AdminDashboard.jsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getAdminMetrics, getPendingHackathons, approveHackathon, rejectHackathon, banUser, unbanUser } from "../services/adminService";
import Navbar from "../../../components/layout/Navbar";

const STATUS_CONFIG = {
  DRAFT: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500" },
  APPROVED: { color: "bg-purple-100 text-purple-800 border-purple-200", dot: "bg-purple-500" },
  REJECTED: { color: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500" },
  PUBLISHED: { color: "bg-pink-100 text-pink-800 border-pink-200", dot: "bg-pink-500" },
  ACTIVE: { color: "bg-blue-100 text-blue-800 border-blue-200", dot: "bg-blue-500" },
  COMPLETED: { color: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" },
};

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`}></span>
      {status}
    </span>
  );
}

function StatSkeleton() {
  return (
    <div className="rounded-2xl border border-warm-stone bg-white p-6 animate-pulse space-y-3">
      <div className="h-4 w-24 rounded bg-warm-stone/20" />
      <div className="h-9 w-16 rounded bg-warm-stone/20" />
      <div className="h-3 w-36 rounded bg-warm-stone/20" />
    </div>
  );
}

function HackathonCardSkeleton() {
  return (
    <div className="rounded-xl border border-warm-stone bg-white p-5 animate-pulse space-y-3">
      <div className="h-5 w-48 rounded bg-warm-stone/20" />
      <div className="h-4 w-64 rounded bg-warm-stone/20" />
      <div className="h-3 w-full rounded bg-warm-stone/20" />
      <div className="h-3 w-5/6 rounded bg-warm-stone/20" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 w-24 rounded-lg bg-warm-stone/20" />
        <div className="h-9 w-24 rounded-lg bg-warm-stone/20" />
      </div>
    </div>
  );
}

function StatCard({ label, value, sublabel, colorClass = "text-deep-espresso" }) {
  return (
    <div className="rounded-2xl border border-warm-stone bg-white p-6 shadow-sm">
      <p className="text-sm text-black/60 mb-1">{label}</p>
      <p className={`text-4xl font-bold ${colorClass}`}>{value ?? "—"}</p>
      {sublabel && <p className="mt-1 text-xs text-black/40">{sublabel}</p>}
    </div>
  );
}

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}


export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  const [metrics, setMetrics] = useState(null);
  const [pendingHackathons, setPendingHackathons] = useState([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Ban user state
  const [banUserEmail, setBanUserEmail] = useState("");
  const [isBanning, setIsBanning] = useState(false);
  const [isUnbanning, setIsUnbanning] = useState(false);

  async function loadMetrics() {
    try {
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingMetrics(false);
    }
  }

  async function loadPending() {
    try {
      const data = await getPendingHackathons();
      setPendingHackathons(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingPending(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMetrics(); 
    loadPending();
  }, []);

  async function handleApprove(id) {
    setActionLoadingId(id);
    try {
      await approveHackathon(id);
      toast.success("Hackathon approved!");
      setPendingHackathons((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoadingId(null);
      loadMetrics(); // Refresh metrics after change
    }
  }

  async function handleReject(id) {
    setActionLoadingId(id);
    try {
      await rejectHackathon(id);
      toast.success("Hackathon rejected.");
      setPendingHackathons((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleBanUser() {
    const email = banUserEmail.trim();
    if (!email) {
      toast.error("Please enter a valid user email.");
      return;
    }
    setIsBanning(true);
    try {
      const bannedUser = await banUser(email);
      toast.success(`User ${bannedUser?.email || email} has been banned.`);
      setBanUserEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsBanning(false);
    }
  }

  async function handleUnbanUser() {
    const email = banUserEmail.trim();
    if (!email) {
      toast.error("Please enter a valid user email.");
      return;
    }
    setIsUnbanning(true);
    try {
      const unbannedUser = await unbanUser(email);
      toast.success(`User ${unbannedUser?.email || email} has been unbanned.`);
      setBanUserEmail("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsUnbanning(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-deep-espresso">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-7xl px-5 py-10 md:px-8">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-dark-khaki mb-2">Platform Admin</p>
          <h1 className="text-4xl font-bold">Command Center</h1>
          <p className="mt-2 text-black/60">
            Monitor activity, review hackathons, and moderate the platform.
            {user?.email && <span className="ml-2 text-black/40">Logged in as {user.email}</span>}
          </p>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {loadingMetrics ? (
            <>
              <StatSkeleton /><StatSkeleton /><StatSkeleton />
            </>
          ) : (
            <>
              <StatCard
                label="Active Hackathons"
                value={metrics?.totalActiveHackathons}
                sublabel="Live or approved events"
                colorClass="text-emerald-500"
              />
              <StatCard
                label="Registered Users"
                value={metrics?.totalRegisteredUsers}
                sublabel="Total platform signups"
                colorClass="text-dark-khaki"
              />
              <StatCard
                label="Total Submissions"
                value={metrics?.totalSubmissions}
                sublabel="Platform-wide project submissions"
                colorClass="text-amber-500"
              />
            </>
          )}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1fr_340px]">

          <div>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-deep-espresso">Review Pipeline</h2>
              {!loadingPending && (
                <span className="rounded-full bg-amber-100 border border-amber-300 px-3 py-0.5 text-xs font-semibold text-amber-700">
                  {pendingHackathons.length} pending
                </span>
              )}
            </div>

            <div className="space-y-4">
              {loadingPending ? (
                <><HackathonCardSkeleton /><HackathonCardSkeleton /></>
              ) : pendingHackathons.length === 0 ? (
                <div className="rounded-xl border border-dashed border-warm-stone bg-corn-silk p-10 text-center shadow-sm">
                  <p className="text-black/60 text-sm">✅ All clear — no hackathons pending review.</p>
                </div>
              ) : (
                pendingHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="rounded-xl border border-warm-stone bg-white p-5 transition hover:border-dark-khaki shadow-sm"
                  >
                    {/* Card header */}
                    <div className="mb-3 flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          <StatusBadge status={hackathon.hackathonStatus} />
                          <span className="text-xs text-black/40">ID #{hackathon.id}</span>
                        </div>
                        <h3 className="text-lg font-bold text-deep-espresso truncate">{hackathon.title}</h3>
                        <p className="text-sm text-black/60 mt-0.5">{hackathon.tagline}</p>
                      </div>
                      {hackathon.profileImageUrl && (
                        <img
                          src={hackathon.profileImageUrl}
                          alt={hackathon.title}
                          className="h-14 w-14 flex-shrink-0 rounded-xl object-cover border border-warm-stone"
                        />
                      )}
                    </div>

                    <p className="mb-4 text-sm leading-relaxed text-black/60 line-clamp-2">
                      {hackathon.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-4 text-xs text-black/60">
                      <span>📋 Reg: {fmtDate(hackathon.registrationStart)} → {fmtDate(hackathon.registrationEnd)}</span>
                      <span>🏆 Event: {fmtDate(hackathon.hackathonStart)} → {fmtDate(hackathon.hackathonEnd)}</span>
                      <span>👥 Team: {hackathon.minTeamSize}–{hackathon.maxTeamSize}</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(hackathon.id)}
                        disabled={actionLoadingId === hackathon.id}
                        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:opacity-50"
                      >
                        {actionLoadingId === hackathon.id ? "..." : "✓ Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(hackathon.id)}
                        disabled={actionLoadingId === hackathon.id}
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                      >
                        {actionLoadingId === hackathon.id ? "..." : "✕ Reject"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">

            <div className="rounded-xl border border-warm-stone bg-white p-5 shadow-sm">
              <h3 className="font-bold text-deep-espresso mb-1">Ban/Unban User</h3>
              <p className="text-xs text-black/60 mb-4">
                Enter a user email to ban or unban them from the platform.
              </p>
              <input
                type="email"
                value={banUserEmail}
                onChange={(e) => setBanUserEmail(e.target.value)}
                placeholder="User Email (e.g. user@example.com)"
                className="mb-3 w-full rounded-lg border border-warm-stone bg-white px-4 py-2.5 text-sm text-deep-espresso placeholder-black/40 outline-none focus:border-dark-khaki transition"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleBanUser}
                  disabled={isBanning || isUnbanning || !banUserEmail}
                  className="flex-1 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {isBanning ? "Banning..." : "Ban"}
                </button>
                <button
                  onClick={handleUnbanUser}
                  disabled={isBanning || isUnbanning || !banUserEmail}
                  className="flex-1 rounded-lg bg-soft-celadon border border-soft-celadon px-4 py-2.5 text-sm font-semibold text-deep-espresso transition hover:bg-white disabled:opacity-50"
                >
                  {isUnbanning ? "Unbanning..." : "Unban"}
                </button>
              </div>
            </div>

            {/* Quick stats recap */}
            <div className="rounded-xl border border-warm-stone bg-white p-5 shadow-sm">
              <h3 className="font-bold text-deep-espresso mb-4">Platform Summary</h3>
              <div className="space-y-3">
                {[
                  ["Pending Review", pendingHackathons.length, "text-amber-600"],
                  ["Active Hackathons", metrics?.totalActiveHackathons ?? "—", "text-emerald-600"],
                  ["Total Users", metrics?.totalRegisteredUsers ?? "—", "text-dark-khaki"],
                  ["Total Submissions", metrics?.totalSubmissions ?? "—", "text-deep-espresso"],
                ].map(([label, value, colorClass]) => (
                  <div key={label} className="flex items-center justify-between rounded-lg border border-warm-stone bg-corn-silk px-4 py-2.5">
                    <span className="text-sm text-black/60">{label}</span>
                    <span className={`text-sm font-bold ${colorClass}`}>{loadingMetrics && label !== "Pending Review" ? "..." : value}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
