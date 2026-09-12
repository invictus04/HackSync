// /src/pages/shared/NotFound.jsx

import { Link } from "react-router";

export default function NotFound() {
  return (
    <div
      className="
                min-h-screen
                flex
                flex-col
                items-center
                justify-center
                bg-slate-950
                text-white
            "
    >
      <h1 className="text-7xl font-extrabold mb-4">404</h1>

      <p className="text-slate-400 mb-8">Page not found</p>

      <Link
        to="/"
        className="
                    px-6
                    py-3
                    rounded-xl
                    bg-indigo-600
                    hover:bg-indigo-500
                    transition
                "
      >
        Go Home
      </Link>
    </div>
  );
}
