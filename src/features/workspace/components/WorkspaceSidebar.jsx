import { NavLink, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import {
    FaHome, FaUsers, FaProjectDiagram, FaBullhorn,
    FaHandsHelping, FaClipboardList, FaGavel, FaBalanceScale,
    FaQuestionCircle, FaSignOutAlt, FaChevronLeft
} from "react-icons/fa";
import { logout } from "../../auth/redux/authSlice";
import { logoutUser } from "../../auth/services/authService";
import { getMyAssignedHackathons } from "../../judge/services/judgeService";
import { useState, useEffect } from "react";

/*
 * Each role gets its own quiet status colour: a small dot plus a soft tinted pill.
 * Hues are distinct but share the same muted saturation, so nothing shouts.
 */
const ROLE_META = {
    ORGANIZER: { label: "Organizer", pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
    PARTICIPANT: { label: "Participant", pill: "bg-sky-50 text-sky-700 ring-sky-600/20", dot: "bg-sky-500" },
    JUDGE: { label: "Judge", pill: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
    MENTOR: { label: "Mentor", pill: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
    ADMIN: { label: "Admin", pill: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-500" },
};

const ROLE_LINKS = {
    ORGANIZER: [
        { name: "Overview", path: "overview", icon: FaHome },
        { name: "Participants", path: "participants", icon: FaUsers },
        { name: "Submissions", path: "submissions", icon: FaProjectDiagram },
        { name: "Announcements", path: "announcements", icon: FaBullhorn },
    ],
    PARTICIPANT: [
        { name: "Overview", path: "overview", icon: FaHome },
        { name: "My team", path: "team", icon: FaHandsHelping },
        { name: "Submission", path: "submission", icon: FaProjectDiagram },
        { name: "Get help", path: "help", icon: FaQuestionCircle },
    ],
    JUDGE: [
        { name: "Assigned projects", path: "assigned-projects", icon: FaGavel },
    ],
    MENTOR: [
        { name: "Help queue", path: "help-queue", icon: FaClipboardList },
    ],
    ADMIN: [
        { name: "Overview", path: "overview", icon: FaHome },
        { name: "Participants", path: "participants", icon: FaUsers },
        { name: "Submissions", path: "submissions", icon: FaProjectDiagram },
    ],
};

const BACK_NAV = {
    ORGANIZER: { path: "/host-dashboard", label: "Host dashboard" },
    JUDGE: { path: "/judge-dashboard", label: "Judge dashboard" },
    ADMIN: { path: "/admin", label: "Admin dashboard" },
    MENTOR: { path: "/hackathons", label: "All hackathons" },
    PARTICIPANT: { path: "/hackathons", label: "All hackathons" },
};

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-khaki/60";

export default function WorkspaceSidebar({ role, hackathon }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isSuperJudge, setIsSuperJudge] = useState(false);

    useEffect(() => {
        if (role === "JUDGE" && hackathon?.id) {
            getMyAssignedHackathons()
                .then((assignments) => {
                    const current = assignments.find((a) => a.hackathonId === hackathon.id);
                    if (current?.isSuperJudge) setIsSuperJudge(true);
                })
                .catch(() => { });
        }
    }, [role, hackathon?.id]);

    let links = ROLE_LINKS[role] || ROLE_LINKS.PARTICIPANT;
    if (role === "JUDGE" && isSuperJudge) {
        links = [...links, { name: "Submit winners", path: "submit-winners", icon: FaBalanceScale }];
    }

    const meta = ROLE_META[role] || ROLE_META.PARTICIPANT;
    const backNav = BACK_NAV[role] || BACK_NAV.PARTICIPANT;

    async function handleLogout() {
        await logoutUser();
        dispatch(logout());
        navigate("/login");
    }

    return (
        <aside className="flex w-64 flex-shrink-0 flex-col border-r border-deep-espresso/10 bg-corn-silk">
            {/* Header */}
            <div className="px-5 pb-5 pt-5">
                <button
                    onClick={() => navigate(backNav.path)}
                    className={`-ml-1 mb-5 flex items-center gap-1.5 rounded px-1 py-0.5 text-xs font-medium text-deep-espresso/60 transition-colors hover:text-deep-espresso ${focusRing}`}
                >
                    <FaChevronLeft size={9} />
                    {backNav.label}
                </button>

                <h2 className="line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-deep-espresso">
                    {hackathon?.title || "Hackathon"}
                </h2>

                <span
                    className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${meta.pill}`}
                >
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" />
                    {meta.label}
                    {role === "JUDGE" && isSuperJudge && (
                        <span className="text-amber-700/70">· Super</span>
                    )}
                </span>
            </div>

            {/* Navigation */}
            <nav aria-label="Workspace" className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${focusRing} ${isActive
                                    ? "bg-deep-espresso/[0.06] font-semibold text-deep-espresso"
                                    : "font-medium text-deep-espresso/60 hover:bg-deep-espresso/[0.04] hover:text-deep-espresso"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        aria-hidden="true"
                                        className={`absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-deep-espresso transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                    <Icon
                                        size={14}
                                        className={`flex-shrink-0 transition-colors ${isActive
                                                ? "text-deep-espresso"
                                                : "text-deep-espresso/40 group-hover:text-deep-espresso/70"
                                            }`}
                                    />
                                    {link.name}
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t border-deep-espresso/10 p-3">
                <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-deep-espresso/60 transition-colors hover:bg-rose-50 hover:text-rose-700 ${focusRing}`}
                >
                    <FaSignOutAlt size={14} className="flex-shrink-0" />
                    Sign out
                </button>
            </div>
        </aside>
    );
}