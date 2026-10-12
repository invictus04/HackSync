import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaShieldAlt, FaUserPlus, FaUsers, FaEdit, FaExclamationCircle } from "react-icons/fa";
import {
  getMyHackathonDetails,
  createTeam,
  addMember,
  updateTeam,
} from "../../participant/services/participantService";

// ─── Schemas ──────────────────────────────────────────────────────────────────
const createTeamSchema = z.object({
  teamName: z.string().min(2, "Team name must be at least 2 characters."),
  skillsNeeded: z.string().optional(),
  lookingForMembers: z.boolean(),
});
const addMemberSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});
const updateTeamSchema = z.object({
  skillsNeeded: z.string().optional(),
  isLookingForMembers: z.boolean(),
});

// ─── Shared input style ───────────────────────────────────────────────────────
const inputClass =
  "w-full rounded-xl border border-dark-khaki/30 bg-white px-4 py-3 text-sm text-deep-espresso placeholder-dark-khaki/60 outline-none transition focus:border-dark-khaki focus:ring-2 focus:ring-dark-khaki/20";
function FieldError({ message }) {
  return message ? (
    <p className="mt-1 text-xs text-red-500 font-medium">{message}</p>
  ) : null;
}

// ─── Create Team Form ─────────────────────────────────────────────────────────
function CreateTeamPanel({ hackathonId, onCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { lookingForMembers: true },
  });
  async function onSubmit(data) {
    try {
      const team = await createTeam({
        hackathonId: parseInt(hackathonId),
        ...data,
      });
      toast.success("Team created successfully!");
      onCreated(team);
    } catch (err) {
      toast.error(err.message);
    }
  }
  return (
    <div className="rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-deep-espresso mb-1">
        Create Your Team
      </h2>
      <p className="text-sm text-dark-khaki mb-6">
        You'll become the team leader. Add members after creating the team.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-deep-espresso">
            Team Name *
          </label>
          <input
            className={inputClass}
            placeholder="e.g. Neural Ninjas"
            {...register("teamName")}
          />
          <FieldError message={errors.teamName?.message} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-deep-espresso">
            Skills Needed
          </label>
          <input
            className={inputClass}
            placeholder="e.g. React, ML, UI/UX"
            {...register("skillsNeeded")}
          />
          <p className="mt-1 text-xs text-dark-khaki font-medium">
            Skills you're looking for in teammates
          </p>
          <FieldError message={errors.skillsNeeded?.message} />
        </div>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dark-khaki/30 bg-corn-silk/20 px-4 py-3">
          <input
            type="checkbox"
            className="h-4 w-4 accent-deep-espresso"
            {...register("lookingForMembers")}
          />
          <span className="text-sm font-bold text-deep-espresso">
            Open for new members
          </span>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-dark-khaki py-3 font-bold text-corn-silk transition hover:bg-deep-espresso disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Team"}
        </button>
      </form>
    </div>
  );
}

// ─── Team Management Panel ────────────────────────────────────────────────────
function TeamManagementPanel({
  teamDetails,
  userEmail,
  onUpdated,
  isCompleted,
}) {
  const isLeader = teamDetails?.participants?.some(
    (p) => p.email === userEmail && p.teamLeader,
  );
  const addMemberForm = useForm({ resolver: zodResolver(addMemberSchema) });
  const updateTeamForm = useForm({
    resolver: zodResolver(updateTeamSchema),
    defaultValues: {
      skillsNeeded: teamDetails?.skillsNeeded || "",
      isLookingForMembers: teamDetails?.lookingForMembers ?? true,
    },
  });
  async function handleAddMember(data) {
    try {
      await addMember(teamDetails.teamId, data.email);
      toast.success("Member added successfully!");
      addMemberForm.reset();
      onUpdated();
    } catch (err) {
      toast.error(err.message);
    }
  }
  async function handleUpdateTeam(data) {
    try {
      await updateTeam(teamDetails.teamId, {
        isLookingForMembers: data.isLookingForMembers,
        skillsNeeded: data.skillsNeeded,
      });
      toast.success("Team settings updated!");
      onUpdated();
    } catch (err) {
      toast.error(err.message);
    }
  }
  return (
    <div className="space-y-6">
      {/* Team header card */}
      <div className="rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-dark-khaki">
              Team #{teamDetails.teamId}
            </p>
            <h2 className="mt-1 text-2xl font-black text-deep-espresso">
              {teamDetails.teamName}
            </h2>
            {teamDetails.skillsNeeded && (
              <p className="mt-1 text-sm text-dark-khaki font-medium">
                Skills: {teamDetails.skillsNeeded}
              </p>
            )}
          </div>
          {isLeader && (
            <span className="flex items-center gap-1.5 rounded-full bg-corn-silk border border-dark-khaki/30 px-3 py-1 text-xs font-bold text-deep-espresso">
              <FaShieldAlt size={10} /> You are Leader
            </span>
          )}
        </div>
        
        {/* Member list */}
        <h3 className="mt-6 mb-3 flex items-center gap-2 text-sm font-bold text-deep-espresso">
          <FaUsers size={14} className="text-dark-khaki" /> Members (
          {teamDetails.participants?.length || 0})
        </h3>
        <div className="space-y-2">
          {teamDetails.participants?.map((p) => (
            <div
              key={p.userId}
              className="flex items-center gap-3 rounded-xl border border-corn-silk bg-corn-silk/10 px-4 py-3"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-dark-khaki text-sm font-bold text-corn-silk">
                {(p.fullName || p.email || "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-deep-espresso">
                  {p.fullName || p.email}
                </p>
                <p className="truncate text-xs text-dark-khaki font-medium">
                  {p.email}
                </p>
              </div>
              {p.teamLeader && (
                <span className="flex items-center gap-1 rounded-full bg-corn-silk border border-dark-khaki/20 px-2 py-0.5 text-[10px] font-bold text-deep-espresso">
                  <FaShieldAlt size={9} /> Leader
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Add member (leader only) */}
      {isLeader && !isCompleted && (
        <div className="rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-deep-espresso">
            <FaUserPlus size={16} className="text-dark-khaki" /> Add Team Member
          </h3>
          <p className="mb-4 text-sm text-dark-khaki font-medium">
            Enter the registered email of the person to add.
          </p>
          <form
            onSubmit={addMemberForm.handleSubmit(handleAddMember)}
            className="flex gap-3"
          >
            <input
              type="email"
              placeholder="member@example.com"
              className={`${inputClass} flex-1`}
              {...addMemberForm.register("email")}
            />
            <button
              type="submit"
              disabled={addMemberForm.formState.isSubmitting}
              className="rounded-xl bg-dark-khaki px-6 py-3 text-sm font-bold text-corn-silk transition hover:bg-deep-espresso disabled:opacity-50"
            >
              {addMemberForm.formState.isSubmitting ? "Adding..." : "Add"}
            </button>
          </form>
          <FieldError
            message={addMemberForm.formState.errors.email?.message}
          />
        </div>
      )}
      
      {/* Update team settings (leader only) */}
      {isLeader && !isCompleted && (
        <div className="rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-deep-espresso">
            <FaEdit size={16} className="text-dark-khaki" /> Team Settings
          </h3>
          <form
            onSubmit={updateTeamForm.handleSubmit(handleUpdateTeam)}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-deep-espresso">
                Skills Needed
              </label>
              <input
                className={inputClass}
                placeholder="e.g. React, ML, UI/UX"
                {...updateTeamForm.register("skillsNeeded")}
              />
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dark-khaki/30 bg-corn-silk/20 px-4 py-3">
              <input
                type="checkbox"
                className="h-4 w-4 accent-deep-espresso"
                {...updateTeamForm.register("isLookingForMembers")}
              />
              <span className="text-sm font-bold text-deep-espresso">
                Open for new members
              </span>
            </label>
            <button
              type="submit"
              disabled={updateTeamForm.formState.isSubmitting}
              className="rounded-xl border-2 border-dark-khaki bg-white px-6 py-2.5 text-sm font-bold text-dark-khaki transition hover:bg-corn-silk disabled:opacity-50"
            >
              {updateTeamForm.formState.isSubmitting
                ? "Saving..."
                : "Save Settings"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ParticipantTeamPage() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  async function loadDetails() {
    try {
      setIsLoading(true);
      setHasError(false);
      const data = await getMyHackathonDetails(id);
      if (!data) {
          setHasError(true);
      } else {
          setDetails(data);
      }
    } catch (err) {
      setHasError(true);
      toast.error(err.message || "Failed to load team details");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((k) => (
          <div key={k} className="animate-pulse rounded-2xl border border-corn-silk bg-corn-silk/30 h-48" />
        ))}
      </div>
    );
  }

  if (hasError || !details) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-dark-khaki/30 bg-corn-silk/20 p-12 text-center shadow-sm">
          <FaExclamationCircle className="mx-auto mb-4 text-dark-khaki" size={48} />
          <h2 className="text-2xl font-black text-deep-espresso mb-2">Team Details Unavailable</h2>
          <p className="text-dark-khaki font-medium max-w-md mx-auto">
              We couldn't retrieve the team information for this workspace. This might happen if you are not registered for the hackathon, or the hackathon details have been removed.
          </p>
      </div>
    );
  }

  const teamDetails = details?.teamDetails;
  const hackathonId = details?.hackathonDetails?.id || parseInt(id, 10);
  const hackathonStatus = details?.hackathonDetails?.hackathonStatus;
  const isCompleted = hackathonStatus === 'COMPLETED';

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-dark-khaki">Participant</p>
        <h1 className="mt-1 text-3xl font-black text-deep-espresso">Team Management</h1>
      </div>
      {isCompleted && (
        <div className="mb-6 rounded-xl border border-dark-khaki bg-corn-silk p-4 text-deep-espresso font-bold flex items-center gap-3">
          <FaExclamationCircle size={20} className="text-dark-khaki" />
          This hackathon has ended. Team management is disabled.
        </div>
      )}
      {teamDetails ? (
        <TeamManagementPanel
          teamDetails={teamDetails}
          userEmail={user?.email}
          onUpdated={loadDetails}
          isCompleted={isCompleted}
        />
      ) : isCompleted ? null : (
        <CreateTeamPanel hackathonId={hackathonId} onCreated={loadDetails} />
      )}
    </div>
  );
}
