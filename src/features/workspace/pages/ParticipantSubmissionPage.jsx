// src/features/workspace/pages/ParticipantSubmissionPage.jsx import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { FaGithub, FaGlobe, FaYoutube, FaCheckCircle } from "react-icons/fa";
import {
  getMyHackathonDetails,
  submitProject,
} from "../../participant/services/participantService"; // ─── Schema ───────────────────────────────────────────────────────────────────
const submissionSchema = z.object({
  projectTitle: z.string().min(1, "Project title is required."),
  tagLine: z.string().min(1, "Tagline is required."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters."),
  githubRepoUrl: z
    .string()
    .url("Must be a valid URL.")
    .optional()
    .or(z.literal("")),
  liveDemoUrl: z
    .string()
    .url("Must be a valid URL.")
    .optional()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("Must be a valid URL.")
    .optional()
    .or(z.literal("")),
});
const inputClass =
  "w-full rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-sm text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9] focus:ring-2 focus:ring-[#9CAEA9]/20";
function Field({ label, icon: Icon, error, hint, textarea, ...rest }) {
  return (
    <div>
      {" "}
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-[#6F6866]">
        {" "}
        {Icon && <Icon size={13} className="text-[#6F6866]" />} {label}{" "}
      </label>{" "}
      {textarea ? (
        <textarea rows={4} className={inputClass} {...rest} />
      ) : (
        <input className={inputClass} {...rest} />
      )}{" "}
      {hint && !error && <p className="mt-1 text-xs text-[#6F6866]">{hint}</p>}{" "}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}{" "}
    </div>
  );
} // ─── Success panel ────────────────────────────────────────────────────────────
function SuccessPanel({ submission }) {
  return (
    <div className="rounded-2xl border border-emerald-800/40 bg-emerald-900/20 p-6 text-center">
      {" "}
      <FaCheckCircle className="mx-auto mb-3 text-emerald-400" size={36} />{" "}
      <h2 className="text-xl font-bold text-[#38302E]">Project Submitted!</h2>{" "}
      <p className="mt-2 text-sm text-[#6F6866]">
        Your project has been submitted successfully.
      </p>{" "}
      <div className="mt-6 rounded-xl border border-[#788585]/30 bg-white/60 p-4 text-left space-y-2">
        {" "}
        <p className="text-xs text-[#6F6866]">
          Submission ID #{submission.projectSubmissionId}
        </p>{" "}
        <p className="text-lg font-bold text-[#38302E]">
          {submission.projectTitle}
        </p>{" "}
        <p className="text-sm text-indigo-300 italic">{submission.tagLine}</p>{" "}
        {submission.githubRepoUrl && (
          <a
            href={submission.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:underline"
          >
            {" "}
            <FaGithub size={13} /> GitHub Repository{" "}
          </a>
        )}{" "}
        {submission.liveDemoUrl && (
          <a
            href={submission.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:underline"
          >
            {" "}
            <FaGlobe size={13} /> Live Demo{" "}
          </a>
        )}{" "}
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-900/40 border border-emerald-700/40 px-3 py-1 text-xs font-semibold text-emerald-300">
          {" "}
          Status: {submission.submissionStatus}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
} // ─── Main export ──────────────────────────────────────────────────────────────
export function ParticipantSubmissionPage() {
  const { id } = useParams();
  const [teamId, setTeamId] = useState(null);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [hackathonStatus, setHackathonStatus] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(submissionSchema) });
  useEffect(() => {
    getMyHackathonDetails(id)
      .then((data) => {
        if (data?.teamDetails?.teamId) {
          setTeamId(data.teamDetails.teamId);
        }
        if (data?.hackathonDetails?.hackathonStatus) {
          setHackathonStatus(data.hackathonDetails.hackathonStatus);
        }
        if (data?.projectSubmission) {
          setSubmission(data.projectSubmission);
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoadingTeam(false));
  }, [id]);
  async function onSubmit(data) {
    if (!teamId) {
      toast.error(
        "You need a team before submitting. Go to the Team tab first.",
      );
      return;
    }
    try {
      const result = await submitProject({ teamId, ...data });
      setSubmission(result);
      toast.success("Project submitted successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  }
  const isCompleted = hackathonStatus === "COMPLETED";
  return (
    <div>
      {" "}
      <div className="mb-6">
        {" "}
        <p className="text-sm font-semibold uppercase tracking-widest text-[#9CAEA9]">
          Participant
        </p>{" "}
        <h1 className="mt-1 text-2xl font-bold text-[#38302E]">
          Project Submission
        </h1>{" "}
        <p className="mt-1 text-sm text-[#6F6866]">
          Submit your team's final project for judging.
        </p>{" "}
      </div>{" "}
      {isLoadingTeam ? (
        <div className="animate-pulse space-y-4">
          {" "}
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-16 rounded-xl bg-white border border-[#788585]/30"
            />
          ))}{" "}
        </div>
      ) : !teamId ? (
        <div className="rounded-2xl border border-amber-800/40 bg-amber-900/10 p-6 text-center">
          {" "}
          <p className="text-amber-300 font-semibold">
            You need a team to submit a project.
          </p>{" "}
          <p className="mt-1 text-sm text-[#6F6866]">
            Please create or join a team first from the Team tab.
          </p>{" "}
        </div>
      ) : submission ? (
        <SuccessPanel submission={submission} />
      ) : isCompleted ? (
        <div className="rounded-2xl border border-amber-800/40 bg-amber-900/10 p-6 text-center">
          {" "}
          <p className="text-amber-300 font-semibold">
            This hackathon has ended.
          </p>{" "}
          <p className="mt-1 text-sm text-[#6F6866]">
            Project submissions are closed.
          </p>{" "}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#788585]/30 bg-white p-6">
          {" "}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {" "}
            <Field
              label="Project Title *"
              type="text"
              placeholder="e.g. EcoChain — Blockchain for sustainability tracking"
              error={errors.projectTitle?.message}
              {...register("projectTitle")}
            />{" "}
            <Field
              label="Tagline *"
              type="text"
              placeholder="A one-liner that captures your project"
              error={errors.tagLine?.message}
              {...register("tagLine")}
            />{" "}
            <Field
              label="Description *"
              textarea
              placeholder="Describe what you built, the problem it solves, technologies used..."
              error={errors.description?.message}
              {...register("description")}
            />{" "}
            <div className="border-t border-[#788585]/30 pt-5">
              {" "}
              <p className="mb-4 text-sm font-semibold text-[#6F6866]">
                Links{" "}
                <span className="font-normal text-[#6F6866]">(optional)</span>
              </p>{" "}
              <div className="space-y-4">
                {" "}
                <Field
                  label="GitHub Repository"
                  icon={FaGithub}
                  type="url"
                  placeholder="https://github.com/your-org/your-repo"
                  error={errors.githubRepoUrl?.message}
                  {...register("githubRepoUrl")}
                />{" "}
                <Field
                  label="Live Demo URL"
                  icon={FaGlobe}
                  type="url"
                  placeholder="https://your-demo.vercel.app"
                  error={errors.liveDemoUrl?.message}
                  {...register("liveDemoUrl")}
                />{" "}
                <Field
                  label="YouTube Demo Video"
                  icon={FaYoutube}
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  error={errors.youtubeUrl?.message}
                  {...register("youtubeUrl")}
                />{" "}
              </div>{" "}
            </div>{" "}
            <div className="border-t border-[#788585]/30 pt-5 flex items-center justify-between gap-4">
              {" "}
              <p className="text-xs text-[#6F6866]">
                Team #{teamId} • Submitting will not block re-submission.
              </p>{" "}
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-[#9CAEA9] px-8 py-3 font-semibold text-[#38302E] transition hover:bg-indigo-500 disabled:opacity-50"
              >
                {" "}
                {isSubmitting ? "Submitting..." : "Submit Project"}{" "}
              </button>{" "}
            </div>{" "}
          </form>{" "}
        </div>
      )}{" "}
    </div>
  );
}
