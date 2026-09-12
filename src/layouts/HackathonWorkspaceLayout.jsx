// src/layouts/HackathonWorkspaceLayout.jsx

import { Outlet } from "react-router";

import WorkspaceSidebar from "../features/workspace/components/WorkspaceSidebar";

export default function HackathonWorkspaceLayout({ role, hackathon }) {
  return (
    <div
      className="
                flex-1 w-full
                flex
                flex
            "
    >
      <WorkspaceSidebar role={role} hackathon={hackathon} />

      <main className="flex-1 p-5 md:p-8">
        <Outlet context={{ role, hackathon }} />
      </main>
    </div>
  );
}
