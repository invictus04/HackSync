import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { FaGithub, FaGlobe, FaYoutube, FaCheckCircle, FaExclamationCircle, FaUsers } from "react-icons/fa";
import {
  getMyHackathonDetails,
  submitProject,
} from "../../participant/services/participantService";

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
  "w-full rounded-xl border border-dark-khaki/30 bg-white px-4 py-3 text-sm text-deep-espresso placeholder-dark-khaki/60 outline-none transition focus:border-dark-khaki focus:ring-2 focus:ring-dark-khaki/20";

function Field({ label, icon: Icon, error, hint, textarea, ...rest }) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-deep-espresso">
        {Icon && <Icon size={14} className="text-dark-khaki" />} {label}
      </label>
      {textarea ? (
        <textarea rows={4} className={inputClass} {...rest} />
      ) : (
        <input className={inputClass} {...rest} />
      )}
      {hint && !error && <p className="mt-1 text-xs text-dark-khaki font-medium">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function SuccessPanel({ submission }) {
  return (
    <div className="rounded-2xl border border-dark-khaki/30 bg-corn-silk p-6 text-center shadow-sm">
      <FaCheckCircle className="mx-auto mb-3 text-dark-khaki" size={36} />
      <h2 className="text-xl font-black text-deep-espresso">Project Submitted!</h2>
      <p className="mt-2 text-sm text-dark-khaki font-medium">
        Your project has been submitted successfully.
      </p>
      <div className="mt-6 rounded-xl border border-dark-khaki/20 bg-white p-4 text-left space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-dark-khaki">
          Submission ID #{submission.projectSubmissionId}
        </p>
        <p className="text-lg font-black text-deep-espresso">
          {submission.projectTitle}
        </p>
        <p className="text-sm text-dark-khaki font-medium italic">{submission.tagLine}</p>
        {submission.githubRepoUrl && (
          <a
            href={submission.githubRepoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-dark-khaki hover:text-deep-espresso hover:underline"
          >
            <FaGithub size={14} /> GitHub Repository
          </a>
        )}
        {submission.liveDemoUrl && (
          <a
            href={submission.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-dark-khaki hover:text-deep-espresso hover:underline"
          >
            <FaGlobe size={14} /> Live Demo
          </a>
        )}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-corn-silk border border-dark-khaki/30 px-3 py-1 text-xs font-bold text-deep-espresso">
          Status: {submission.submissionStatus}
        </div>
      </div>
    </div>
  );
}

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
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-widest text-dark-khaki">
          Participant
        </p>
        <h1 className="mt-1 text-3xl font-black text-deep-espresso">
          Project Submission
        </h1>
        <p className="mt-1 text-sm font-medium text-dark-khaki">
          Submit your team's final project for judging.
        </p>
      </div>
      {isLoadingTeam ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="h-16 rounded-xl bg-corn-silk/30 border border-corn-silk"
            />
          ))}
        </div>
      ) : !teamId ? (
        <div className="rounded-2xl border-2 border-dashed border-dark-khaki/30 bg-corn-silk/20 p-8 text-center shadow-sm">
          <FaUsers className="mx-auto mb-4 text-dark-khaki" size={32} />
          <p className="text-lg font-black text-deep-espresso mb-2">
            Team Required
          </p>
          <p className="mt-1 text-sm font-medium text-dark-khaki">
            Please create or join a team from the Team tab before submitting.
          </p>
        </div>
      ) : submission ? (
        <SuccessPanel submission={submission} />
      ) : isCompleted ? (
        <div className="rounded-2xl border-2 border-dashed border-dark-khaki/30 bg-corn-silk/20 p-8 text-center shadow-sm">
          <FaExclamationCircle className="mx-auto mb-4 text-dark-khaki" size={32} />
          <p className="text-lg font-black text-deep-espresso mb-2">
            Hackathon Ended
          </p>
          <p className="mt-1 text-sm font-medium text-dark-khaki">
            Project submissions are closed.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Field
              label="Project Title *"
              type="text"
              placeholder="e.g. EcoChain — Blockchain for sustainability tracking"
              error={errors.projectTitle?.message}
              {...register("projectTitle")}
            />
            <Field
              label="Tagline *"
              type="text"
              placeholder="A one-liner that captures your project"
              error={errors.tagLine?.message}
              {...register("tagLine")}
            />
            <Field
              label="Description *"
              textarea
              placeholder="Describe what you built, the problem it solves, technologies used..."
              error={errors.description?.message}
              {...register("description")}
            />
            <div className="border-t border-corn-silk pt-5">
              <p className="mb-4 text-sm font-bold text-deep-espresso">
                Links <span className="font-medium text-dark-khaki">(optional)</span>
              </p>
              <div className="space-y-4">
                <Field
                  label="GitHub Repository"
                  icon={FaGithub}
                  type="url"
                  placeholder="https://github.com/your-org/your-repo"
                  error={errors.githubRepoUrl?.message}
                  {...register("githubRepoUrl")}
                />
                <Field
                  label="Live Demo URL"
                  icon={FaGlobe}
                  type="url"
                  placeholder="https://your-demo.vercel.app"
                  error={errors.liveDemoUrl?.message}
                  {...register("liveDemoUrl")}
                />
                <Field
                  label="YouTube Demo Video"
                  icon={FaYoutube}
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  error={errors.youtubeUrl?.message}
                  {...register("youtubeUrl")}
                />
              </div>
            </div>
            <div className="border-t border-corn-silk pt-5 flex items-center justify-between gap-4">
              <p className="text-xs font-medium text-dark-khaki">
                Team #{teamId} • Submitting will not block re-submission.
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-dark-khaki px-8 py-3 font-bold text-corn-silk transition hover:bg-deep-espresso disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Project"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
