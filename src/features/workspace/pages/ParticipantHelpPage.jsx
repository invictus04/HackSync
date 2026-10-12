import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { FaTicketAlt, FaPlus, FaVideo, FaExclamationCircle } from "react-icons/fa";
import webSocketService from "../../../services/websocketService";
import {
  getMyHackathonDetails,
  createHelpTicket,
  getMyTickets,
} from "../../participant/services/participantService";

const helpSchema = z.object({
  issueTitle: z.string().min(5, "Title must be at least 5 characters."),
  issueDescription: z
    .string()
    .min(20, "Please describe the issue in more detail."),
  techTags: z.string().min(1, "Add at least one tech tag."),
});

const inputClass =
  "w-full rounded-xl border border-dark-khaki/30 bg-white px-4 py-3 text-sm text-deep-espresso placeholder-dark-khaki/60 outline-none transition focus:border-dark-khaki focus:ring-2 focus:ring-dark-khaki/20";

const TICKET_STATUS = {
  OPEN: "bg-corn-silk border-dark-khaki/30 text-deep-espresso",
  CLAIMED: "bg-dark-khaki border-deep-espresso/30 text-corn-silk",
  RESOLVED: "bg-deep-espresso border-dark-khaki/30 text-corn-silk",
  CLOSED: "bg-corn-silk/50 border-dark-khaki/20 text-dark-khaki",
};

function TicketStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${TICKET_STATUS[status] || TICKET_STATUS.OPEN}`}
    >
      {status}
    </span>
  );
}

function TicketCard({ ticket }) {
  const tags = ticket.techTags
    ? ticket.techTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  return (
    <div className="rounded-xl border border-corn-silk bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-black text-deep-espresso truncate">
            {ticket.issueTitle}
          </p>
          <p className="mt-1 text-sm font-medium text-dark-khaki line-clamp-2">
            {ticket.issueDescription}
          </p>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-dark-khaki/20 bg-corn-silk/30 px-2 py-0.5 text-xs font-semibold text-deep-espresso"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {ticket.status === "CLAIMED" && ticket.participantMeetingLink && (
        <div className="mt-4 pt-4 border-t border-corn-silk">
          <a
            href={ticket.participantMeetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-dark-khaki text-corn-silk px-5 py-2.5 text-sm font-bold hover:bg-deep-espresso transition"
          >
            <FaVideo /> Join Meeting with Mentor
          </a>
        </div>
      )}
      {ticket.ticketId && (
        <p className="mt-3 text-xs font-bold uppercase tracking-widest text-dark-khaki">
          Ticket #{ticket.ticketId}
        </p>
      )}
    </div>
  );
}

export function ParticipantHelpPage() {
  const { id } = useParams();
  const [teamId, setTeamId] = useState(null);
  const [hackathonId, setHackathonId] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [hackathonStatus, setHackathonStatus] = useState(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(helpSchema) });

  useEffect(() => {
    getMyHackathonDetails(id)
      .then((data) => {
        const tid = data?.teamDetails?.teamId;
        const hid = data?.hackathonDetails?.id || parseInt(id);
        setTeamId(tid);
        setHackathonId(hid);
        setHackathonStatus(data?.hackathonDetails?.hackathonStatus);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoadingTeam(false));
  }, [id]);

  useEffect(() => {
    if (!teamId || !hackathonId) return;
    
    const loadTickets = () => {
      setIsLoadingTickets(true);
      getMyTickets(hackathonId, teamId)
        .then(setTickets)
        .finally(() => setIsLoadingTickets(false));
    };
    
    loadTickets();
    
    webSocketService.connect(() => {
      webSocketService.subscribe('/topic/tickets', () => {
        setTimeout(() => {
          getMyTickets(hackathonId, teamId).then(setTickets);
        }, 500);
      });
    });
    
    return () => {
      webSocketService.unsubscribe('/topic/tickets');
      webSocketService.disconnect();
    };
  }, [teamId, hackathonId]);

  async function onSubmit(data) {
    try {
      const ticket = await createHelpTicket({ teamId, ...data });
      setTickets((prev) => [ticket, ...prev]);
      toast.success("Help ticket created! A mentor will pick it up soon.");
      reset();
      setShowForm(false);
    } catch (err) {
      toast.error(err.message);
    }
  }

  const isCompleted = hackathonStatus === "COMPLETED";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-dark-khaki">
            Participant
          </p>
          <h1 className="mt-1 text-3xl font-black text-deep-espresso">
            Mentor Help
          </h1>
          <p className="mt-1 text-sm font-medium text-dark-khaki">
            Create a help ticket — a mentor will claim it and schedule a session.
          </p>
        </div>
        {!isLoadingTeam && teamId && !isCompleted && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-xl bg-dark-khaki px-5 py-3 text-sm font-bold text-corn-silk transition hover:bg-deep-espresso"
          >
            <FaPlus size={12} /> {showForm ? "Cancel" : "New Ticket"}
          </button>
        )}
      </div>

      {isCompleted && (
        <div className="mb-6 rounded-xl border border-dark-khaki bg-corn-silk p-4 text-deep-espresso font-bold flex items-center gap-3">
          <FaExclamationCircle size={20} className="text-dark-khaki" />
          This hackathon has ended. Mentor help queue is closed.
        </div>
      )}

      {isLoadingTeam ? (
        <div className="animate-pulse space-y-4">
          {[1, 2].map((k) => (
            <div
              key={k}
              className="h-20 rounded-xl bg-corn-silk/30 border border-corn-silk"
            />
          ))}
        </div>
      ) : !teamId ? (
        <div className="rounded-2xl border-2 border-dashed border-dark-khaki/30 bg-corn-silk/20 p-8 text-center shadow-sm">
          <FaExclamationCircle className="mx-auto mb-4 text-dark-khaki" size={32} />
          <p className="text-lg font-black text-deep-espresso mb-2">
            Team Required
          </p>
          <p className="mt-1 text-sm font-medium text-dark-khaki">
            You need a team to request mentor help. Please create or join a team first from the Team tab.
          </p>
        </div>
      ) : (
        <>
          {showForm && (
            <div className="mb-6 rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-deep-espresso">
                New Help Ticket
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-deep-espresso">
                    Issue Title *
                  </label>
                  <input
                    className={inputClass}
                    placeholder="Brief summary of the problem"
                    {...register("issueTitle")}
                  />
                  {errors.issueTitle && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.issueTitle.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-deep-espresso">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    className={inputClass}
                    placeholder="Explain what you're stuck on, what you've tried, and any error messages..."
                    {...register("issueDescription")}
                  />
                  {errors.issueDescription && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.issueDescription.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-deep-espresso">
                    Tech Tags *
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. React, Spring Boot, Docker"
                    {...register("techTags")}
                  />
                  <p className="mt-1 text-xs font-medium text-dark-khaki">
                    Comma-separated tags. Helps route to the right mentor.
                  </p>
                  {errors.techTags && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.techTags.message}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-xl bg-dark-khaki py-3 font-bold text-corn-silk transition hover:bg-deep-espresso disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating..." : "Create Ticket"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    className="rounded-xl border-2 border-dark-khaki bg-white px-8 py-3 text-sm font-bold text-dark-khaki transition hover:bg-corn-silk"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="rounded-2xl border border-corn-silk bg-white p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-deep-espresso">
              <FaTicketAlt size={16} className="text-dark-khaki" /> My Tickets
              {tickets.length > 0 && (
                <span className="rounded-full bg-corn-silk px-2 py-0.5 text-xs font-bold text-deep-espresso">
                  {tickets.length}
                </span>
              )}
            </h2>
            
            {isLoadingTickets ? (
              <div className="space-y-3">
                {[1, 2].map((k) => (
                  <div
                    key={k}
                    className="animate-pulse h-20 rounded-xl bg-corn-silk/30"
                  />
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="py-12 text-center rounded-xl border border-dashed border-dark-khaki/30 bg-corn-silk/10">
                <FaTicketAlt className="mx-auto mb-3 text-dark-khaki" size={32} />
                <p className="text-lg font-black text-deep-espresso mb-1">
                  No tickets yet
                </p>
                <p className="text-sm font-medium text-dark-khaki">
                  Create one if you need help from a mentor!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((t, index) => (
                  <TicketCard key={t.ticketId || `ticket-${index}`} ticket={t} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
