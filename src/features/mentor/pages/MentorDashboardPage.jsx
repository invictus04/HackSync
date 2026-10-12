import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { getMyAssignedHackathons } from "../services/mentorService";
import { FaChalkboardTeacher, FaUsers } from "react-icons/fa";
import Navbar from "../../../components/layout/Navbar";

function fmtDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function MentorHackathonCard({ hackathon }) {
  const navigate = useNavigate();
  const isPending = hackathon.invitationStatus === "INVITED" || hackathon.invitationStatus === "PENDING";
  const isAccepted = hackathon.invitationStatus === "ACCEPTED";
  const isDeclined = hackathon.invitationStatus === "DECLINED" || hackathon.invitationStatus === "REJECTED";

  return (
    <div
      onClick={() => navigate(`/mentor/hackathon/${hackathon.hackathonId}`)}
      className="flex flex-col rounded-2xl border border-dark-khaki/30 bg-white overflow-hidden transition cursor-pointer hover:border-dark-khaki hover:shadow-lg hover:-translate-y-1 shadow-sm"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${
            isPending ? "bg-blue-100 text-blue-800 border-blue-200" :
            isAccepted ? "bg-green-100 text-green-800 border-green-200" :
            isDeclined ? "bg-red-100 text-red-800 border-red-200" :
            "bg-pink-100 text-pink-800 border-pink-200"
          }`}>
            {hackathon.invitationStatus || "UNKNOWN"}
          </span>
        </div>

        <h3 className="text-xl font-black text-deep-espresso line-clamp-1">
          {hackathon.title || `Hackathon #${hackathon.hackathonId}`}
        </h3>
        
        {hackathon.tagline && (
          <p className="mt-1 text-sm font-medium text-dark-khaki line-clamp-1">
            {hackathon.tagline}
          </p>
        )}

        <p className="mt-3 text-xs font-bold text-dark-khaki">
          🗓️ {fmtDate(hackathon.hackathonStarts)} → {fmtDate(hackathon.hackathonEnds)}
        </p>

        <div className="mt-2 text-xs font-bold text-dark-khaki uppercase tracking-widest">
          Status: {hackathon.hackathonStatus}
        </div>

        <div className="mt-auto pt-5 flex gap-2">
          {isPending && (
            <div className="flex-1 text-center py-2 text-xs font-bold text-deep-espresso bg-corn-silk rounded-xl border border-dark-khaki/30 shadow-sm">
              Action Required: View Details
            </div>
          )}

          {isAccepted && (
            <div className="flex-1 text-center py-2 text-xs font-bold text-corn-silk bg-dark-khaki rounded-xl border border-deep-espresso/30 shadow-sm">
              Assigned as Mentor
            </div>
          )}

          {isDeclined && (
            <div className="flex-1 text-center py-2 text-xs font-medium text-dark-khaki italic bg-corn-silk/30 rounded-xl border border-dark-khaki/10">
              Declined
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MentorDashboardPage() {
  const [hackathons, setHackathons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadData() {
    try {
      const data = await getMyAssignedHackathons();
      setHackathons(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentor assignments");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar hideLinks={true} />
        <div className="min-h-screen bg-corn-silk py-12 flex justify-center items-center">
          <p className="text-dark-khaki font-bold text-lg animate-pulse">Loading your workspace...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar hideLinks={true} />
      <div className="min-h-screen bg-corn-silk py-12 text-deep-espresso">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="mb-10 flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-dark-khaki mb-2">
                <FaChalkboardTeacher size={16} /> Mentor Panel
              </p>
              <h1 className="text-4xl font-black text-deep-espresso">My Mentorships</h1>
              <p className="mt-2 text-dark-khaki font-medium text-lg">
                Manage your hackathon invitations and mentor workspaces.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {hackathons.length === 0 ? (
              <div className="col-span-full rounded-3xl border-2 border-dashed border-dark-khaki/30 bg-white py-24 text-center shadow-sm">
                <FaUsers className="mx-auto mb-5 text-dark-khaki" size={56} />
                <h3 className="text-2xl font-black text-deep-espresso mb-3">No mentorship assignments yet</h3>
                <p className="text-dark-khaki font-medium text-lg max-w-md mx-auto">
                  You will see hackathons here when organizers invite you to mentor teams.
                </p>
              </div>
            ) : (
              hackathons.map((h) => (
                <MentorHackathonCard key={h.hackathonId} hackathon={h} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
