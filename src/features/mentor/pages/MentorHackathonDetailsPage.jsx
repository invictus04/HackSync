import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getHackathonDetailsPublic, getMyAssignedHackathons, updateInvitationStatus } from "../services/mentorService";
import { FaArrowLeft, FaCheck, FaTimes, FaCalendarAlt, FaInfoCircle, FaUsers, FaTools, FaCode } from "react-icons/fa";
import Navbar from "../../../components/layout/Navbar";
import Button from "../../../components/ui/Button";

function formatDateTime(dateString, fallback = 'TBA') {
    if (!dateString) return fallback;
    return new Date(dateString).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function MentorHackathonDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hackathon, setHackathon] = useState(null);
    const [mentorStatus, setMentorStatus] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function loadData() {
        try {
            setIsLoading(true);
            const publicData = await getHackathonDetailsPublic(id);
            setHackathon(publicData);

            const assignedList = await getMyAssignedHackathons();
            const myAssignment = assignedList.find(h => h.hackathonId === parseInt(id));
            if (myAssignment) {
                setMentorStatus(myAssignment);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load hackathon details.");
            navigate("/mentor-dashboard");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStatus(status) {
        try {
            setUpdating(true);
            await updateInvitationStatus(id, status);
            toast.success(`Invitation ${status.toLowerCase()} successfully`);
            loadData();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update invitation status");
        } finally {
            setUpdating(false);
        }
    }

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

    if (!hackathon || !mentorStatus) return null;

    const isPending = mentorStatus.invitationStatus === "INVITED" || mentorStatus.invitationStatus === "PENDING";
    const isAccepted = mentorStatus.invitationStatus === "ACCEPTED";
    const isDeclined = mentorStatus.invitationStatus === "DECLINED" || mentorStatus.invitationStatus === "REJECTED";

    return (
        <>
            <Navbar hideLinks={true} />
            <div className="min-h-screen bg-corn-silk py-12 text-deep-espresso">
                <div className="mx-auto max-w-5xl px-5 md:px-8">
                    <button
                        onClick={() => navigate("/mentor-dashboard")}
                        className="mb-8 flex items-center gap-2 text-sm font-bold text-dark-khaki transition hover:text-deep-espresso"
                    >
                        <FaArrowLeft /> Back to Dashboard
                    </button>

                    {/* Main Content Card */}
                    <div className="rounded-3xl border border-dark-khaki/30 bg-white shadow-sm overflow-hidden">
                        {/* Banner Image */}
                        {hackathon.bannerImageUrl && (
                            <div className="h-48 md:h-64 w-full relative bg-corn-silk">
                                <img src={hackathon.bannerImageUrl} alt="Hackathon Banner" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                            </div>
                        )}

                        <div className="p-8 md:p-12 relative -mt-16 md:-mt-24 z-10">
                            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                                    isPending ? "bg-blue-100 text-blue-800 border-blue-200" :
                                    isAccepted ? "bg-green-100 text-green-800 border-green-200" :
                                    isDeclined ? "bg-red-100 text-red-800 border-red-200" :
                                    "bg-pink-100 text-pink-800 border-pink-200"
                                }`}>
                                    {mentorStatus.invitationStatus || "UNKNOWN"}
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                                {hackathon.profileImageUrl && (
                                    <img
                                        src={hackathon.profileImageUrl}
                                        alt="Profile"
                                        className="h-24 w-24 rounded-2xl object-cover border-4 border-white shadow-xl bg-corn-silk"
                                    />
                                )}
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-black text-deep-espresso tracking-tight mb-2">
                                        {hackathon.title}
                                    </h1>
                                    {hackathon.tagline && (
                                        <p className="text-lg text-dark-khaki font-medium">{hackathon.tagline}</p>
                                    )}
                                </div>
                            </div>

                            {/* Status Actions */}
                            <div className="mb-12 rounded-2xl border border-dark-khaki/20 bg-corn-silk/30 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                                <div>
                                    <h3 className="text-lg font-black text-deep-espresso mb-1">Mentor Invitation</h3>
                                    <p className="text-sm font-medium text-dark-khaki">
                                        {isPending ? "You have been invited to mentor teams for this hackathon." :
                                            isAccepted ? "You are an official mentor for this hackathon!" :
                                                "You have declined this mentor invitation."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    {isPending && (
                                        <>
                                            <button
                                                onClick={() => handleStatus('REJECTED')}
                                                disabled={updating}
                                                className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-500/20 disabled:opacity-50"
                                            >
                                                <FaTimes /> Decline
                                            </button>
                                            <button
                                                onClick={() => handleStatus('ACCEPTED')}
                                                disabled={updating}
                                                className="flex items-center gap-2 rounded-xl bg-dark-khaki px-6 py-2.5 text-sm font-bold text-corn-silk transition hover:bg-deep-espresso disabled:opacity-50"
                                            >
                                                <FaCheck /> Accept Invitation
                                            </button>
                                        </>
                                    )}

                                    {isAccepted && (
                                        <button
                                            onClick={() => navigate(`/mentor/workspace/${hackathon.id}`)}
                                            className="flex items-center gap-2 rounded-xl bg-dark-khaki px-6 py-2.5 text-sm font-bold text-corn-silk transition hover:bg-deep-espresso"
                                        >
                                            <FaTools /> Enter Workspace
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-black text-deep-espresso mb-4 pb-2 border-b border-dark-khaki/30">
                                            <FaInfoCircle className="text-dark-khaki" /> About
                                        </h3>
                                        <div className="text-dark-khaki font-medium prose prose-sm max-w-none">
                                            {hackathon.description || "No description provided."}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="flex items-center gap-2 text-lg font-black text-deep-espresso mb-4 pb-2 border-b border-dark-khaki/30">
                                            <FaCode className="text-dark-khaki" /> Rules & Requirements
                                        </h3>
                                        <div className="text-dark-khaki font-medium prose prose-sm max-w-none">
                                            {hackathon.rules || "No rules specified."}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-xl border border-dark-khaki/30 bg-corn-silk/20 p-5">
                                        <h3 className="text-sm font-bold text-deep-espresso uppercase tracking-wider mb-4">Schedule</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-lg bg-corn-silk text-dark-khaki">
                                                    <FaCalendarAlt size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-deep-espresso">Hackathon Starts</p>
                                                    <p className="text-sm font-medium text-dark-khaki">{formatDateTime(hackathon.hackathonStart)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="mt-1 p-2 rounded-lg bg-corn-silk text-dark-khaki">
                                                    <FaCalendarAlt size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-deep-espresso">Hackathon Ends</p>
                                                    <p className="text-sm font-medium text-dark-khaki">{formatDateTime(hackathon.hackathonEnd)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-dark-khaki/30 bg-corn-silk/20 p-5">
                                        <h3 className="text-sm font-bold text-deep-espresso uppercase tracking-wider mb-4">Team Rules</h3>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-corn-silk text-dark-khaki">
                                                <FaUsers size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-dark-khaki">
                                                    Teams must have between <span className="font-black text-deep-espresso">{hackathon.minTeamSize}</span> and <span className="font-black text-deep-espresso">{hackathon.maxTeamSize}</span> members.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
