import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FaArrowLeft, FaTicketAlt, FaHandSparkles, FaCheckCircle, FaVideo, FaExclamationCircle } from "react-icons/fa";
import { getTicketsByStatus, claimTicket, resolveTicket } from "../services/mentorService";
import webSocketService from "../../../services/websocketService";
import Navbar from "../../../components/layout/Navbar";
import Button from "../../../components/ui/Button";

export default function MentorWorkspacePage() {
    const { id } = useParams(); // hackathon ID
    const navigate = useNavigate();

    const [openTickets, setOpenTickets] = useState([]);
    const [claimedTickets, setClaimedTickets] = useState([]);
    const [resolvedTickets, setResolvedTickets] = useState([]);
    
    const [isLoading, setIsLoading] = useState(true);

    const fetchTickets = useCallback(async () => {
        try {
            const [open, claimed, resolved] = await Promise.all([
                getTicketsByStatus("OPEN"),
                getTicketsByStatus("CLAIMED"),
                getTicketsByStatus("RESOLVED")
            ]);
            setOpenTickets(Array.isArray(open) ? open : []);
            setClaimedTickets(Array.isArray(claimed) ? claimed : []);
            setResolvedTickets(Array.isArray(resolved) ? resolved : []);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchTickets().finally(() => setIsLoading(false));

        webSocketService.connect(() => {
            webSocketService.subscribe('/topic/tickets', () => {
                setTimeout(() => {
                    fetchTickets();
                }, 500);
            });
        }, (error) => {
            console.error("WebSocket connection failed", error);
            toast.error("Real-time updates disconnected");
        });

        return () => {
            webSocketService.unsubscribe('/topic/tickets');
            webSocketService.disconnect();
        };
    }, [fetchTickets]);

    const handleClaim = async (ticketId) => {
        try {
            await claimTicket(ticketId);
            toast.success("Ticket claimed! A meeting link has been generated.");
            fetchTickets();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to claim ticket.");
        }
    };

    const handleResolve = async (ticketId) => {
        try {
            await resolveTicket(ticketId);
            toast.success("Ticket resolved successfully.");
            fetchTickets();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to resolve ticket.");
        }
    };

    const openMeeting = (link) => {
        if (link) window.open(link, "_blank");
    };

    if (isLoading) {
        return (
            <>
                <Navbar hideLinks={true} />
                <div className="min-h-screen bg-corn-silk p-8 flex justify-center items-center">
                    <div className="animate-spin h-12 w-12 border-4 border-dark-khaki border-t-transparent rounded-full"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar hideLinks={true} />
            <div className="min-h-screen bg-corn-silk text-deep-espresso flex flex-col h-screen">
                {/* Header */}
                <div className="border-b border-dark-khaki/30 bg-white p-4 shrink-0 flex items-center gap-4">
                    <button
                        onClick={() => navigate(`/mentor/hackathon/${id}`)}
                        className="p-2 rounded-xl bg-corn-silk/50 hover:bg-dark-khaki/10 text-dark-khaki hover:text-deep-espresso transition border border-transparent hover:border-dark-khaki/20"
                    >
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-deep-espresso">Mentor Workspace</h1>
                        <p className="text-xs font-medium text-dark-khaki">Real-time help desk. Claim tickets to assist teams.</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-corn-silk text-deep-espresso border border-dark-khaki/30 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-deep-espresso animate-pulse"></span>
                        Live
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex-1 overflow-x-auto p-6 flex gap-6 items-start">
                    
                    {/* OPEN COLUMN */}
                    <div className="flex flex-col flex-1 min-w-[320px] rounded-2xl border border-dark-khaki/30 bg-white overflow-hidden max-h-full shadow-sm">
                        <div className="p-4 border-b border-dark-khaki/20 bg-corn-silk/30 flex justify-between items-center shrink-0">
                            <h3 className="font-black flex items-center gap-2 text-deep-espresso">
                                <FaExclamationCircle className="text-dark-khaki" /> Open Requests
                            </h3>
                            <span className="bg-white text-deep-espresso border border-dark-khaki/20 text-xs px-2 py-0.5 rounded-full font-bold">
                                {openTickets.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-dark-khaki/30">
                            {openTickets.length === 0 ? (
                                <p className="text-center text-sm font-medium text-dark-khaki py-8">No open requests right now.</p>
                            ) : (
                                openTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-corn-silk/20 rounded-xl p-4 border border-dark-khaki/20 shadow-sm">
                                        <h4 className="font-black text-deep-espresso mb-2">{ticket.issueTitle}</h4>
                                        <p className="text-sm font-medium text-dark-khaki line-clamp-3 mb-3">{ticket.issueDescription}</p>
                                        {ticket.techTags && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {ticket.techTags.split(',').map((tag, i) => (
                                                    <span key={i} className="text-[10px] uppercase font-bold px-2 py-1 bg-white text-dark-khaki rounded border border-dark-khaki/20">
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <Button 
                                            className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 bg-dark-khaki text-corn-silk hover:bg-deep-espresso transition"
                                            onClick={() => handleClaim(ticket.id)}
                                        >
                                            <FaHandSparkles /> Claim Ticket
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* CLAIMED COLUMN */}
                    <div className="flex flex-col flex-1 min-w-[320px] rounded-2xl border border-dark-khaki/30 bg-white overflow-hidden max-h-full shadow-sm">
                        <div className="p-4 border-b border-dark-khaki/20 bg-corn-silk/30 flex justify-between items-center shrink-0">
                            <h3 className="font-black flex items-center gap-2 text-deep-espresso">
                                <FaTicketAlt className="text-dark-khaki" /> My Sessions
                            </h3>
                            <span className="bg-white text-deep-espresso border border-dark-khaki/20 text-xs px-2 py-0.5 rounded-full font-bold">
                                {claimedTickets.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-dark-khaki/30">
                            {claimedTickets.length === 0 ? (
                                <p className="text-center text-sm font-medium text-dark-khaki py-8">You haven't claimed any tickets yet.</p>
                            ) : (
                                claimedTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-white rounded-xl p-4 border border-dark-khaki/40 shadow-md relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-dark-khaki"></div>
                                        <h4 className="font-black text-deep-espresso mb-2 ml-1">{ticket.issueTitle}</h4>
                                        <p className="text-sm font-medium text-dark-khaki mb-4 ml-1">{ticket.issueDescription}</p>
                                        
                                        <div className="space-y-2 ml-1">
                                            <Button 
                                                variant="outline"
                                                className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 border-2 border-dark-khaki text-dark-khaki hover:bg-corn-silk transition"
                                                onClick={() => openMeeting(ticket.mentorMeetingLink)}
                                            >
                                                <FaVideo /> Join Meeting
                                            </Button>
                                            <Button 
                                                variant="secondary"
                                                className="w-full py-2.5 text-sm font-bold flex items-center justify-center gap-2 bg-dark-khaki text-corn-silk hover:bg-deep-espresso transition border-none"
                                                onClick={() => handleResolve(ticket.id)}
                                            >
                                                <FaCheckCircle /> Mark Resolved
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RESOLVED COLUMN */}
                    <div className="flex flex-col flex-1 min-w-[320px] rounded-2xl border border-dark-khaki/30 bg-white overflow-hidden max-h-full opacity-75 shadow-sm">
                        <div className="p-4 border-b border-dark-khaki/20 bg-corn-silk/30 flex justify-between items-center shrink-0">
                            <h3 className="font-black flex items-center gap-2 text-deep-espresso">
                                <FaCheckCircle className="text-dark-khaki" /> Resolved
                            </h3>
                            <span className="bg-white text-deep-espresso border border-dark-khaki/20 text-xs px-2 py-0.5 rounded-full font-bold">
                                {resolvedTickets.length}
                            </span>
                        </div>
                        <div className="p-4 flex-1 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-dark-khaki/30">
                            {resolvedTickets.length === 0 ? (
                                <p className="text-center text-sm font-medium text-dark-khaki py-8">No resolved tickets yet.</p>
                            ) : (
                                resolvedTickets.map(ticket => (
                                    <div key={ticket.id} className="bg-corn-silk/40 rounded-xl p-4 border border-dark-khaki/20 shadow-sm">
                                        <h4 className="font-bold text-deep-espresso/60 mb-1 line-through">{ticket.issueTitle}</h4>
                                        <p className="text-xs font-medium text-dark-khaki/80">Resolved at: {new Date(ticket.resolvedAt).toLocaleTimeString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
