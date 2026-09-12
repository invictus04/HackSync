// src/features/workspace/pages/ParticipantHelpPage.jsx import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { FaTicketAlt, FaPlus, FaVideo } from "react-icons/fa";
import webSocketService from "../../../services/websocketService";
import {
  getMyHackathonDetails,
  createHelpTicket,
  getMyTickets,
} from "../../participant/services/participantService"; // ─── Schema ───────────────────────────────────────────────────────────────────
const helpSchema = z.object({
  issueTitle: z.string().min(5, "Title must be at least 5 characters."),
  issueDescription: z
    .string()
    .min(20, "Please describe the issue in more detail."),
  techTags: z.string().min(1, "Add at least one tech tag."),
});
const inputClass =
  "w-full rounded-xl border border-[#788585]/30 bg-white px-4 py-3 text-sm text-[#38302E] placeholder-slate-500 outline-none transition focus:border-[#9CAEA9] focus:ring-2 focus:ring-[#9CAEA9]/20"; // ─── Status badge ─────────────────────────────────────────────────────────────
const TICKET_STATUS = {
  OPEN: "bg-blue-900/40 border-blue-700/40 text-blue-300",
  CLAIMED: "bg-amber-900/40 border-amber-700/40 text-amber-300",
  RESOLVED: "bg-emerald-900/40 border-emerald-700/40 text-emerald-300",
  CLOSED: "bg-slate-700/40 border-slate-600/40 text-[#6F6866]",
};
function TicketStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${TICKET_STATUS[status] || TICKET_STATUS.OPEN}`}
    >
      {" "}
      {status}{" "}
    </span>
  );
} // ─── Ticket card ──────────────────────────────────────────────────────────────
function TicketCard({ ticket }) {
  const tags = ticket.techTags
    ? ticket.techTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  return (
    <div className="rounded-xl border border-[#788585]/30 bg-white p-4">
      {" "}
      <div className="flex items-start justify-between gap-3">
        {" "}
        <div className="min-w-0 flex-1">
          {" "}
          <p className="font-semibold text-[#38302E] truncate">
            {ticket.issueTitle}
          </p>{" "}
          <p className="mt-1 text-sm text-[#6F6866] line-clamp-2">
            {ticket.issueDescription}
          </p>{" "}
        </div>{" "}
        <TicketStatusBadge status={ticket.status} />{" "}
      </div>{" "}
      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {" "}
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white px-2 py-0.5 text-xs text-[#6F6866]"
            >
              {tag}
            </span>
          ))}{" "}
        </div>
      )}{" "}
      {ticket.status === "CLAIMED" && ticket.participantMeetingLink && (
        <div className="mt-4 pt-4 border-t border-[#788585]/30">
          {" "}
          <a
            href={ticket.participantMeetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 px-4 py-2 text-sm font-semibold hover:bg-sky-600/40 transition"
          >
            {" "}
            <FaVideo /> Join Meeting with Mentor{" "}
          </a>{" "}
        </div>
      )}{" "}
      {ticket.ticketId && (
        <p className="mt-2 text-xs text-slate-600">Ticket #{ticket.ticketId}</p>
      )}{" "}
    </div>
  );
} // ─── Main export ──────────────────────────────────────────────────────────────
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
  } = useForm({ resolver: zodResolver(helpSchema) }); // Load team context useEffect(() => { getMyHackathonDetails(id) .then((data) => { const tid = data?.teamDetails?.teamId; const hid = data?.hackathonDetails?.id || parseInt(id); setTeamId(tid); setHackathonId(hid); setHackathonStatus(data?.hackathonDetails?.hackathonStatus); }) .catch((err) => toast.error(err.message)) .finally(() => setIsLoadingTeam(false)); }, [id]); // Load tickets once we have team context useEffect(() => { if (!teamId || !hackathonId) return; const loadTickets = () => { setIsLoadingTickets(true); getMyTickets(hackathonId, teamId) .then(setTickets) .finally(() => setIsLoadingTickets(false)); }; loadTickets(); // Connect to WebSocket for real-time ticket updates webSocketService.connect(() => { webSocketService.subscribe('/topic/tickets', () => { // Refresh tickets when any ticket is created, claimed, or resolved // Add a small delay to ensure backend DB transaction has committed setTimeout(() => { getMyTickets(hackathonId, teamId).then(setTickets); }, 500); }); }); return () => { webSocketService.unsubscribe('/topic/tickets'); webSocketService.disconnect(); }; }, [teamId, hackathonId]); async function onSubmit(data) { try { const ticket = await createHelpTicket({ teamId, ...data }); setTickets((prev) => [ticket, ...prev]); toast.success("Help ticket created! A mentor will pick it up soon."); reset(); setShowForm(false); } catch (err) { toast.error(err.message); } } const isCompleted = hackathonStatus === "COMPLETED"; return ( <div> <div className="mb-6 flex flex-wrap items-center justify-between gap-4"> <div> <p className="text-sm font-semibold uppercase tracking-widest text-[#9CAEA9]">Participant</p> <h1 className="mt-1 text-2xl font-bold text-[#38302E]">Mentor Help</h1> <p className="mt-1 text-sm text-[#6F6866]">Create a help ticket — a mentor will claim it and schedule a session.</p> </div> {!isLoadingTeam && teamId && !isCompleted && ( <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl bg-[#9CAEA9] px-4 py-2.5 text-sm font-semibold text-[#38302E] transition hover:bg-indigo-500" > <FaPlus size={12} /> {showForm ? "Cancel" : "New Ticket"} </button> )} </div> {isCompleted && ( <div className="mb-6 rounded-xl border border-amber-800/40 bg-amber-900/10 p-4 text-amber-300 font-medium"> This hackathon has ended. Mentor help queue is closed. </div> )} {isLoadingTeam ? ( <div className="animate-pulse space-y-4"> {[1, 2].map((k) => <div key={k} className="h-20 rounded-xl bg-white border border-[#788585]/30" />)} </div> ) : !teamId ? ( <div className="rounded-2xl border border-amber-800/40 bg-amber-900/10 p-6 text-center"> <p className="text-amber-300 font-semibold">You need a team to request mentor help.</p> <p className="mt-1 text-sm text-[#6F6866]">Please create or join a team first from the Team tab.</p> </div> ) : ( <> {/* Create ticket form */} {showForm && ( <div className="mb-6 rounded-2xl border border-indigo-800/40 bg-white p-6"> <h2 className="mb-4 text-base font-bold text-[#38302E]">New Help Ticket</h2> <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> <div> <label className="mb-1.5 block text-sm font-medium text-[#6F6866]">Issue Title *</label> <input className={inputClass} placeholder="Brief summary of the problem" {...register("issueTitle")} /> {errors.issueTitle && <p className="mt-1 text-xs text-red-400">{errors.issueTitle.message}</p>} </div> <div> <label className="mb-1.5 block text-sm font-medium text-[#6F6866]">Description *</label> <textarea rows={4} className={inputClass} placeholder="Explain what you're stuck on, what you've tried, and any error messages..." {...register("issueDescription")} /> {errors.issueDescription && <p className="mt-1 text-xs text-red-400">{errors.issueDescription.message}</p>} </div> <div> <label className="mb-1.5 block text-sm font-medium text-[#6F6866]">Tech Tags *</label> <input className={inputClass} placeholder="e.g. React, Spring Boot, Docker" {...register("techTags")} /> <p className="mt-1 text-xs text-[#6F6866]">Comma-separated tags. Helps route to the right mentor.</p> {errors.techTags && <p className="mt-1 text-xs text-red-400">{errors.techTags.message}</p>} </div> <div className="flex gap-3 pt-1"> <button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl bg-[#9CAEA9] py-3 font-semibold text-[#38302E] transition hover:bg-indigo-500 disabled:opacity-50" > {isSubmitting ? "Creating..." : "Create Ticket"} </button> <button type="button" onClick={() => { setShowForm(false); reset(); }} className="rounded-xl border border-slate-600 bg-white px-6 py-3 text-sm font-medium text-[#6F6866] transition hover:bg-[#CCDAD1]/40" > Cancel </button> </div> </form> </div> )} {/* Ticket list */} <div className="rounded-2xl border border-[#788585]/30 bg-white p-6"> <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-[#38302E]"> <FaTicketAlt size={14} className="text-[#9CAEA9]" /> My Tickets {tickets.length > 0 && ( <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#6F6866]">{tickets.length}</span> )} </h2> {isLoadingTickets ? ( <div className="space-y-3"> {[1, 2].map(k => <div key={k} className="animate-pulse h-20 rounded-xl bg-white" />)} </div> ) : tickets.length === 0 ? ( <div className="py-10 text-center"> <FaTicketAlt className="mx-auto mb-3 text-slate-700" size={28} /> <p className="text-sm text-[#6F6866]">No tickets yet. Create one if you need help!</p> </div> ) : ( <div className="space-y-3"> {tickets.map((t, index) => ( <TicketCard key={t.ticketId || `ticket-${index}`} ticket={t} /> ))} </div> )} </div> </> )} </div> );
}
