import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useHackathonRole from "../hooks/useHackathonRole";
import HackathonWorkspaceLayout from "../../../layouts/HackathonWorkspaceLayout";
import { getParticipantHackathonById } from "../services/workspaceService";
import Navbar from "../../../components/layout/Navbar";
export default function HackathonWorkspacePage() {
  const { id } = useParams();
  const [hackathon, setHackathon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const role = useHackathonRole(id);
  useEffect(() => {
    async function fetchHackathon() {
      try {
        setLoading(true);
        const data = await getParticipantHackathonById(id);
        setHackathon(data);
      } catch {
        setError("Hackathon not found or access denied.");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchHackathon();
    }
  }, [id]);
  let content;
  if (loading) {
    content = (
      <div className="flex-1 bg-white p-10 text-dark-khaki flex items-center justify-center font-medium">
        Loading workspace...
      </div>
    );
  } else if (error || !hackathon) {
    content = (
      <div className="flex-1 bg-white p-10 text-deep-espresso flex flex-col items-center justify-center font-medium">
        <p className="mb-4">{error || "Hackathon not found"}</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-lg bg-dark-khaki text-corn-silk font-semibold hover:bg-deep-espresso transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  } else if (!role) {
    content = (
      <div className="flex-1 bg-white p-10 text-deep-espresso flex items-center justify-center">
        <div className="max-w-md w-full rounded-2xl border border-corn-silk bg-white p-8 shadow-xl text-center transition-all duration-300 hover:shadow-2xl">
          <h1 className="text-2xl font-bold mb-3 text-deep-espresso">
            Workspace Access Required
          </h1>
          <p className="text-dark-khaki mb-6">
            Register for this hackathon or use an account with an assigned role
            to view the workspace.
          </p>
          <button className="px-6 py-2 rounded-lg bg-dark-khaki text-corn-silk font-semibold hover:bg-deep-espresso transition-colors w-full">
            View Registration Options
          </button>
        </div>
      </div>
    );
  } else {
    content = <HackathonWorkspaceLayout role={role} hackathon={hackathon} />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-white text-deep-espresso">
      <Navbar />
      <div className="flex-1 flex flex-col min-h-0 relative">
        {content}
      </div>
    </div>
  );
}
