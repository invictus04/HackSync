// src/features/hackathons/pages/HostManagePage.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Navbar from "../../../components/layout/Navbar";

import {
  getHostHackathonById,
  getHostHackathonDetails,
  inviteJudge,
  inviteMentor,
  publishHackathonResults,
  assignSuperJudge,
  disqualifySubmission,
  createEvaluationCriteria,
  getEvaluationCriteria,
  updateEvaluationCriteria
} from "../services/hostService";

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  APPROVED: "bg-purple-100 text-purple-800 border-purple-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  PUBLISHED: "bg-pink-100 text-pink-800 border-pink-200",
  ACTIVE: "bg-blue-100 text-blue-800 border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.DRAFT}`}>
      {status}
    </span>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-xl bg-slate-800" />
      <div className="h-5 w-48 rounded bg-slate-800" />
      <div className="h-40 rounded-2xl bg-slate-900" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="h-48 rounded-2xl bg-slate-900" />
        <div className="h-48 rounded-2xl bg-slate-900" />
      </div>
    </div>
  );
}

// ─── Invite form ───────────────────────────────────────────────────────────────
function InviteForm({ title, description, onInvite, placeholder = "user@example.com", disabled = false, disabledReason = "" }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data) {
    if (disabled) return;
    setIsLoading(true);
    try {
      await onInvite(data.email);
      toast.success(`${title.replace("Invite ", "")} added successfully!`);
      reset();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`rounded-2xl border border-warm-stone bg-corn-silk p-6 ${disabled ? 'opacity-70' : ''}`}>
      <h3 className="text-lg font-bold text-deep-espresso mb-1">{title}</h3>
      <p className="text-sm text-black/60 mb-5">{description}</p>

      {disabled ? (
        <div className="rounded-xl border border-warm-stone/40 bg-warm-stone/20 px-4 py-3 mb-4">
          <p className="text-xs text-deep-espresso font-medium">{disabledReason}</p>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          type="email"
          disabled={disabled || isLoading}
          placeholder={placeholder}
          className="w-full rounded-xl border border-warm-stone bg-corn-silk px-4 py-3 text-sm text-deep-espresso placeholder-black/60 outline-none transition focus:border-black disabled:opacity-50 disabled:cursor-not-allowed"
          {...register("email", { required: "Email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email." } })}
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        <button
          type="submit"
          disabled={disabled || isLoading}
          className="w-full rounded-xl bg-dark-khaki py-2.5 text-sm font-semibold text-white transition hover:bg-deep-espresso disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending..." : "Send Invite"}
        </button>
      </form>
    </div>
  );
}

// ─── Detail row ────────────────────────────────────────────────────────────────
function DetailRow({ label, value }) {
  return (
    <div className="flex gap-4 py-2">
      <span className="min-w-40 text-sm text-dark-khaki shrink-0">{label}</span>
      <span className="text-sm text-black/60 font-medium">{value || "—"}</span>
    </div>
  );
}

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ─── Evaluation Criteria Form ──────────────────────────────────────────────────
function EvaluationCriteriaForm({ hackathonId, initialData, onSuccess, onCancel }) {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      reset({
        criteriaName: initialData.criteriaName,
        description: initialData.description,
        maxScore: initialData.maxScore
      });
    } else {
      reset({ criteriaName: "", description: "", maxScore: "" });
    }
  }, [initialData, reset]);

  async function onSubmit(data) {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateEvaluationCriteria(hackathonId, initialData.id, {
          criteriaName: data.criteriaName,
          description: data.description,
          maxScore: parseInt(data.maxScore)
        });
        toast.success("Evaluation criteria updated successfully!");
      } else {
        await createEvaluationCriteria(hackathonId, {
          criteriaName: data.criteriaName,
          description: data.description,
          maxScore: parseInt(data.maxScore)
        });
        toast.success("Evaluation criteria created successfully!");
      }
      reset();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6">
      <h3 className="text-lg font-bold text-deep-espresso mb-1">
        {initialData ? "Edit Criteria" : "Create Criteria"}
      </h3>
      <p className="text-sm text-black/60 mb-5">
        {initialData ? "Update the scoring rules." : "Define how judges will evaluate submissions."}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-deep-espresso">Criteria Name</label>
          <input
            type="text"
            className="w-full rounded-xl border border-warm-stone bg-white px-4 py-2.5 text-sm text-deep-espresso placeholder-black/40 outline-none transition focus:border-dark-khaki"
            {...register("criteriaName", { required: "Name is required." })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-deep-espresso">Description</label>
          <textarea
            rows={2}
            className="w-full rounded-xl border border-warm-stone bg-white px-4 py-2.5 text-sm text-deep-espresso placeholder-black/40 outline-none transition focus:border-dark-khaki"
            {...register("description", { required: "Description is required." })}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-deep-espresso">Max Score</label>
          <input
            type="number"
            min="1"
            className="w-full rounded-xl border border-warm-stone bg-white px-4 py-2.5 text-sm text-deep-espresso placeholder-black/40 outline-none transition focus:border-dark-khaki"
            {...register("maxScore", { required: "Max score is required." })}
          />
        </div>
        <div className="flex gap-3">
          {initialData && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-warm-stone bg-white py-2.5 text-sm font-semibold text-deep-espresso transition hover:bg-warm-stone/30"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-xl bg-dark-khaki py-2.5 text-sm font-semibold text-white transition hover:bg-deep-espresso disabled:opacity-50"
          >
            {isLoading ? "Saving..." : initialData ? "Update Criteria" : "Add Criteria"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function HostManagePage() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  const [editingCriteria, setEditingCriteria] = useState(null);

  async function load() {
    try {
      const basicData = await getHostHackathonById(id);
      let fullDataList = [];
      try {
        fullDataList = await getHostHackathonDetails();
      } catch (e) {
        console.warn("Could not fetch full rosters", e);
      }
      const fullData = fullDataList.find(h => h.id.toString() === id.toString()) || {};

      let criteriaList = [];
      try {
        criteriaList = await getEvaluationCriteria(id);
      } catch (e) {
        console.warn("Could not fetch evaluation criteria", e);
      }

      setHackathon({ ...basicData, ...fullData, criteria: criteriaList });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handlePublish() {
    if (!window.confirm("Publish results? This will make the winning results public. This action cannot be undone.")) return;
    setIsPublishing(true);
    try {
      await publishHackathonResults(id);
      toast.success("Results published successfully!");
      setHackathon((prev) => ({ ...prev, hackathonStatus: "PUBLISHED" }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleAssignSuperJudge(judgeEmail) {
    if (!window.confirm("Assign as Super Judge?")) return;
    try {
      await assignSuperJudge(id, judgeEmail);
      toast.success("Super Judge assigned!");
      // Optimistically update
      setHackathon(prev => ({
        ...prev,
        judges: prev.judges?.map(j => j.email === judgeEmail ? { ...j, isSuperJudge: true } : j)
      }));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleDisqualify(submissionId) {
    if (!window.confirm("Disqualify this submission? This action is permanent.")) return;
    try {
      await disqualifySubmission(id, submissionId);
      toast.success("Submission disqualified!");
      setHackathon(prev => ({
        ...prev,
        submissions: prev.submissions?.map(s => s.id === submissionId ? { ...s, submissionStatus: "DISQUALIFIED" } : s)
      }));
    } catch (err) {
      toast.error(err.message);
    }
  }

  const TABS = [
    { id: "OVERVIEW", label: "Overview" },
    { id: "ROSTERS", label: "Rosters & Invites" },
    { id: "SUBMISSIONS", label: "Submissions" },
    { id: "EVALUATION", label: "Evaluation Criteria" }
  ];

  const canInvite = ["APPROVED", "ACTIVE", "COMPLETED"].includes(hackathon?.hackathonStatus);
  const inviteDisabledReason = "Invitations can only be sent when the hackathon is Approved, Active, or Completed.";

  return (
    <div className="min-h-screen bg-white text-white">
      <Navbar />
      <div className="py-12 mx-auto max-w-5xl px-5 md:px-8">

        {/* Back nav */}
        <Link to="/host-dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-warm-stone hover:text-dark-khaki transition">
          ← Back to My Hackathons
        </Link>

        {isLoading ? (
          <Skeleton />
        ) : !hackathon ? (
          <div className="py-20 text-center text-deep-espresso">Hackathon not found.</div>
        ) : (
          <div className="space-y-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={hackathon.hackathonStatus} />
                  <span className="text-xs text-warm-stone">ID #{hackathon.id}</span>
                </div>
                <h1 className="text-3xl font-bold text-deep-espresso">{hackathon.title}</h1>
                <p className="mt-1 text-soft-celadon">{hackathon.tagline}</p>
              </div>
              {hackathon.profileImageUrl && (
                <img src={hackathon.profileImageUrl} alt="" className="h-20 w-20 rounded-2xl object-cover border border-warm-stone shrink-0" />
              )}
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 ${activeTab === t.id ? "border-dark-khaki text-dark-khaki" : "border-transparent text-warm-stone "}`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === "OVERVIEW" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Banner */}
                  {hackathon.bannerImageUrl && (
                    <img src={hackathon.bannerImageUrl} alt="Banner" className="w-full h-52 rounded-2xl object-cover border border-warm-stone" />
                  )}

                  {/* Details */}
                  <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6">
                    <h2 className="text-lg font-bold text-deep-espresso mb-4">Hackathon Details</h2>
                    <DetailRow label="Description" value={hackathon.description} />
                    <DetailRow label="Min Team Size" value={hackathon.minTeamSize} />
                    <DetailRow label="Max Team Size" value={hackathon.maxTeamSize} />
                    <DetailRow label="Registration Opens" value={fmtDate(hackathon.registrationStart)} />
                    <DetailRow label="Registration Closes" value={fmtDate(hackathon.registrationEnd)} />
                    <DetailRow label="Hackathon Starts" value={fmtDate(hackathon.hackathonStart)} />
                    <DetailRow label="Hackathon Ends" value={fmtDate(hackathon.hackathonEnd)} />
                    <DetailRow label="Result Declaration" value={fmtDate(hackathon.resultDeclarationDate)} />
                  </div>

                  {/* Rules and FAQ */}
                  {(hackathon.rules || hackathon.faq) && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {hackathon.rules && (
                        <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6">
                          <h2 className="text-lg font-bold text-deep-espresso mb-3">Rules</h2>
                          <p className="text-sm text-black/60 whitespace-pre-wrap">{hackathon.rules}</p>
                        </div>
                      )}
                      {hackathon.faq && (
                        <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6">
                          <h2 className="text-lg font-bold text-deep-espresso mb-3">FAQ</h2>
                          <p className="text-sm text-black/60 whitespace-pre-wrap">{hackathon.faq}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Feedback Notes */}
                  {hackathon.feedBackNotes && (
                    <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6">
                      <h2 className="text-lg font-bold text-deep-espresso mb-2">Admin Feedback</h2>
                      <p className="text-sm text-black/60 whitespace-pre-wrap">{hackathon.feedBackNotes}</p>
                    </div>
                  )}

                  {/* Publish Results */}
                  <div className="rounded-2xl border border-warm-stone bg-corn-silk p-6">
                    <h2 className="text-lg font-bold text-deep-espresso mb-1">Publish Results</h2>
                    <p className="text-sm text-black/60 mb-5">
                      Publishing results makes the winner standings publicly visible. This is only possible once all judges have completed their evaluations and the hackathon status is{" "}
                      <span className="text-emerald-400 font-semibold">COMPLETED</span>.
                    </p>

                    {hackathon.hackathonStatus === "COMPLETED" ? (
                      <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
                      >
                        {isPublishing ? "Publishing..." : "🏆 Publish Results"}
                      </button>
                    ) : (
                      <div className="rounded-xl border border-amber-800/40 bg-deep-espresso px-5 py-4">
                        <p className="text-sm text-white">
                          ⏳ Results can only be published when the hackathon status is <strong>COMPLETED</strong>.
                          Currently: <strong>{hackathon.hackathonStatus}</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ROSTERS" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid gap-4 md:grid-cols-2">
                    <InviteForm
                      title="Invite Judge"
                      description="Judges evaluate and score participant submissions. Enter their registered email."
                      onInvite={(email) => inviteJudge(id, email)}
                      disabled={!canInvite}
                      disabledReason={inviteDisabledReason}
                    />
                    <InviteForm
                      title="Invite Mentor"
                      description="Mentors guide teams and resolve blockers during the hackathon. Enter their registered email."
                      onInvite={(email) => inviteMentor(id, email)}
                      disabled={!canInvite}
                      disabledReason={inviteDisabledReason}
                    />
                  </div>

                  {/* Judges List */}
                  <div className="rounded-2xl border border-warm-stone bg-corn-silk overflow-hidden">
                    <div className="px-6 py-4 flex items-center justify-between">
                      <h3 className="font-bold text-deep-espresso">Judges</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded-md text-deep-espresso">{hackathon.judges?.length || 0}</span>
                    </div>
                    {hackathon.judges?.length > 0 ? (
                      <div className="divide-y divide-warm-stone">
                        {hackathon.judges.map(judge => (
                          <div key={judge.id} className="p-4 px-6 flex items-center justify-between hover:bg-warm-stone/20 transition-colors">
                            <div>
                              <p className="text-sm font-semibold text-deep-espresso">{judge.email}</p>
                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${judge.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{judge.status}</span>
                                {judge.isSuperJudge && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">👑 Super Judge</span>}
                                {judge.assignedAt && (
                                  <span className="text-[10px] text-black/60">Assigned: {new Date(judge.assignedAt).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>
                            {!judge.isSuperJudge && judge.status === 'ACCEPTED' && (
                              <button onClick={() => handleAssignSuperJudge(judge.email)} className="text-xs font-semibold text-white transition-colors bg-dark-khaki hover:bg-deep-espresso cursor-pointer px-3 py-1.5 rounded-lg">
                                Make Super Judge
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-deep-espresso">No judges invited yet.</div>
                    )}
                  </div>

                  {/* Mentors List */}
                  <div className="rounded-2xl border border-warm-stone bg-corn-silk overflow-hidden">
                    <div className="px-6 py-4 border-warm-stone flex items-center justify-between">
                      <h3 className="font-bold text-deep-espresso">Mentors</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded-md text-deep-espresso">{hackathon.mentors?.length || 0}</span>
                    </div>
                    {hackathon.mentors?.length > 0 ? (
                      <div className="divide-y divide-warm-stone">
                        {hackathon.mentors.map(mentor => (
                          <div key={mentor.id} className="p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-warm-stone/20 transition-colors">
                            <div>
                              <p className="text-sm font-semibold text-deep-espresso">{mentor.email}</p>
                              <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${mentor.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{mentor.status}</span>
                            </div>
                            {mentor.expertiseTags && (
                              <p className="text-xs text-black/60 truncate max-w-[200px]">{mentor.expertiseTags}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-deep-espresso">No mentors invited yet.</div>
                    )}
                  </div>

                  {/* Teams List */}
                  <div className="rounded-2xl border border-warm-stone bg-corn-silk overflow-hidden">
                    <div className="px-6 py-4 border-warm-stone flex items-center justify-between">
                      <h3 className="font-bold text-deep-espresso">Registered Teams</h3>
                      <span className="text-xs bg-white px-2 py-1 rounded-md text-deep-espresso">{hackathon.teams?.length || 0}</span>
                    </div>
                    {hackathon.teams?.length > 0 ? (
                      <div className="divide-y divide-warm-stone">
                        {hackathon.teams.map(team => (
                          <div key={team.teamId} className="p-4 px-6 hover:bg-warm-stone/20 transition-colors">
                            <h4 className="text-sm font-bold text-deep-espresso mb-3 flex items-center gap-2">
                              {team.teamName}
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white text-deep-espresso">Team ID: {team.teamId}</span>
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {team.participants?.map(p => (
                                <div key={p.userId} className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-lg border border-warm-stone">
                                  <div className="h-5 w-5 rounded-full bg-dark-khaki/20 flex items-center justify-center text-dark-khaki text-[10px] font-bold">
                                    {(p.fullName || p.email)[0].toUpperCase()}
                                  </div>
                                  <span className="text-xs text-deep-espresso font-medium">{p.fullName || p.email}</span>
                                  {p.teamLeader && (
                                    <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded ml-1" title="Team Leader">⭐ Leader</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-sm text-deep-espresso">No teams registered yet.</div>
                    )}
                  </div>

                </div>
              )}

              {activeTab === "SUBMISSIONS" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-corn-silk/50 border border-warm-stone/50 rounded-xl p-4 text-sm text-deep-espresso">
                    Review project submissions from registered teams. You can disqualify submissions that violate the hackathon rules.
                  </div>

                  {hackathon.submissions?.length > 0 ? (
                    <div className="grid gap-4">
                      {hackathon.submissions.map(sub => (
                        <div key={sub.id} className="rounded-2xl border border-warm-stone bg-corn-silk p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-deep-espresso">{sub.projectTitle}</h3>
                              {sub.submissionStatus === "DISQUALIFIED" && (
                                <span className="bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Disqualified</span>
                              )}
                            </div>
                            <p className="text-sm text-dark-khaki mb-3">{sub.tagLine}</p>
                            <p className="text-sm text-black/60 mb-4 line-clamp-2">{sub.description}</p>

                            <div className="flex flex-wrap gap-3">
                              {sub.githubRepoUrl && (
                                <a href={sub.githubRepoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-deep-espresso hover:text-dark-khaki transition-colors bg-white px-3 py-1.5 rounded-lg border border-warm-stone hover:border-dark-khaki">
                                  GitHub Repo
                                </a>
                              )}
                              {sub.liveDemoUrl && (
                                <a href={sub.liveDemoUrl} target="_blank" rel="noreferrer" className="text-xs font-semibold text-deep-espresso hover:text-dark-khaki transition-colors bg-white px-3 py-1.5 rounded-lg border border-warm-stone hover:border-dark-khaki">
                                  Live Demo
                                </a>
                              )}
                              <span className="text-xs text-black/60 px-3 py-1.5">Team: {sub.teamName}</span>
                            </div>
                          </div>

                          {sub.submissionStatus !== "DISQUALIFIED" && (
                            <button onClick={() => handleDisqualify(sub.id)} className="shrink-0 text-xs font-semibold text-red-600 hover:text-red-700 transition-colors bg-red-50 px-3 py-2 rounded-lg border border-red-200 hover:border-red-300">
                              Disqualify
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-warm-stone bg-corn-silk p-12 text-center text-deep-espresso/50">
                      No projects have been submitted yet.
                    </div>
                  )}
                </div>
              )}

              {activeTab === "EVALUATION" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    {/* Left: Form */}
                    <EvaluationCriteriaForm
                      hackathonId={id}
                      initialData={editingCriteria}
                      onSuccess={() => {
                        setEditingCriteria(null);
                        load(); // refresh criteria list
                      }}
                      onCancel={() => setEditingCriteria(null)}
                    />

                    {/* Right: List of Criteria */}
                    <div className="rounded-2xl border border-warm-stone bg-corn-silk overflow-hidden flex flex-col h-full">
                      <div className="px-6 py-4 border-warm-stone flex items-center justify-between">
                        <h3 className="font-bold text-deep-espresso">Existing Criteria</h3>
                        <span className="text-xs bg-white px-2 py-1 rounded-md text-deep-espresso">{hackathon.criteria?.length || 0} Total</span>
                      </div>
                      <div className="p-4 flex-1 overflow-y-auto max-h-[400px]">
                        {hackathon.criteria?.length > 0 ? (
                          <div className="space-y-3">
                            {hackathon.criteria.map(c => (
                              <div key={c.id} className="rounded-xl border border-warm-stone bg-white p-4 hover:border-dark-khaki transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h4 className="font-bold text-dark-khaki">{c.criteriaName}</h4>
                                    <p className="text-xs text-black/60 mt-1 mb-2 line-clamp-2">{c.description}</p>
                                    <span className="inline-block px-2 py-1 rounded bg-dark-khaki/20 text-deep-espresso text-[10px] font-bold">MAX SCORE: {c.maxScore}</span>
                                  </div>
                                  <button
                                    onClick={() => setEditingCriteria(c)}
                                    className="shrink-0 rounded-lg p-2 text-deep-espresso hover:text-white hover:bg-dark-khaki transition"
                                    title="Edit Criteria"
                                  >
                                    ✎ Edit
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center text-deep-espresso px-6">
                            <span className="text-4xl mb-3">📊</span>
                            <p className="text-sm">No criteria created yet.</p>
                            <p className="text-xs mt-1">Use the form to define how judges will score submissions.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>


          </div>
        )}
      </div>
    </div>
  );
}
