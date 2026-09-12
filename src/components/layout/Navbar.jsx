// src/components/layout/Navbar.jsx

import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

import Container from "../common/Container";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/redux/authSlice";
import { logoutUser } from "../../features/auth/services/authService";
import { getRoleRedirectPath } from "../../utils/navigation";

function UserProfileDropdown({ handleLogout, goToDashboard }) {
  const { platformRoles } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayRole = platformRoles?.[1] || platformRoles?.[0] || "";
  const cleanRole = displayRole.replace("ROLE_", "");

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar circle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center cursor-pointer transition-all duration-300 w-9 h-9 rounded-xl border border-muted-slate/20 text-sm font-semibold ${
          isOpen ? "bg-soft-celadon text-deep-espresso" : "bg-pale-mint/30 text-deep-espresso hover:bg-pale-mint/60"
        }`}
      >
        <FaUser size={14} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 rounded-2xl py-2 z-50 transition-all bg-deep-espresso border border-pale-mint/15 shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
        >
          {cleanRole && (
            <div
              className="px-4 py-3 border-b border-pale-mint/10"
            >
              <span
                className="text-[11px] font-bold uppercase tracking-widest text-white"
              >
                {cleanRole}
              </span>
            </div>
          )}

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                goToDashboard();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-medium cursor-pointer transition-colors duration-200 bg-transparent text-white hover:bg-pale-mint/10"
            >
              Dashboard
            </button>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors duration-200 text-white bg-transparent no-underline hover:bg-pale-mint/10"
            >
              My Profile
            </Link>
          </div>

          <div className="border-t border-pale-mint/10 my-1" />

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-medium cursor-pointer transition-colors duration-200 text-[#ff8080] bg-transparent hover:bg-[#ff8080]/10"
            >
              <FaSignOutAlt size={12} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


export default function Navbar({ hideLinks = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, platformRoles } = useSelector((state) => state.auth);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    // Set initial state
    setScrolled(window.scrollY > 20);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Explore", path: "/hackathons" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const shouldHideLinks = hideLinks || platformRoles?.includes("MENTOR");
  const displayLinks = shouldHideLinks ? [] : navLinks;

  function goToDashboard() {
    navigate(getRoleRedirectPath(platformRoles));
  }

  function handleLogout() {
    logoutUser();
    dispatch(logout());
    navigate("/");
  }

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-white/85 backdrop-blur-md border-b border-muted-slate/15 pt-0"
            : "bg-transparent border-b border-transparent pt-3"
        }`}
      >
        <Container>
          <nav
            className="flex items-center justify-between transition-all duration-500"
            style={{ height: scrolled ? 64 : 76 }}
          >
            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center select-none"
              style={{ textDecoration: "none" }}
            >
              <span
                className="text-[22px] font-bold text-deep-espresso tracking-[-0.03em]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Hack
                <span className="text-muted-slate font-medium">Sync</span>
              </span>
            </Link>

            {/* ── Desktop Links ── */}
            {displayLinks.length > 0 && (
              <div
                className={`hidden md:flex items-center rounded-full px-2 gap-2 ${
                  scrolled
                    ? "bg-transparent border-none p-0"
                    : "bg-white/40 border border-white/60 py-1.5 px-3"
                }`}
              >
                {displayLinks.map((link) => {
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`relative transition-all duration-300 text-sm py-1.5 px-4 rounded-[20px] no-underline ${
                        active
                          ? `font-semibold text-deep-espresso bg-white ${
                              !scrolled ? "shadow-[0_2px_8px_rgba(56,48,46,0.05)]" : ""
                            }`
                          : "font-medium text-warm-stone bg-transparent hover:text-deep-espresso hover:bg-white/60"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── Desktop Actions ── */}
            <div
              className="hidden md:flex items-center"
              style={{ gap: "16px" }}
            >
              {isAuthenticated ? (
                <>
                  <button
                    onClick={goToDashboard}
                    className="cursor-pointer transition-all duration-300 py-2 px-5 rounded-xl text-sm font-semibold text-white bg-deep-espresso border-none shadow-[0_4px_14px_rgba(56,48,46,0.15)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,48,46,0.25)]"
                  >
                    Dashboard
                  </button>
                  <UserProfileDropdown
                    handleLogout={handleLogout}
                    goToDashboard={goToDashboard}
                  />
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="cursor-pointer transition-colors duration-200 py-2 px-4 text-sm font-semibold text-warm-stone bg-transparent border-none hover:text-deep-espresso"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="cursor-pointer transition-all duration-300 py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-deep-espresso border-none shadow-[0_4px_14px_rgba(156,174,169,0.2)] hover:-translate-y-0.5  hover:shadow-[0_6px_20px_rgba(120,133,133,0.3)]"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* ── Mobile Toggle ── */}
            <button
              className="md:hidden flex items-center justify-center cursor-pointer transition-colors bg-white border border-muted-slate/20 rounded-lg text-deep-espresso text-base py-2 px-2.5"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </nav>
        </Container>
      </header>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed top-[80px] left-4 right-4 z-50 md:hidden rounded-2xl overflow-hidden transition-all bg-deep-espresso border border-pale-mint/15 shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
          >
            <div className="p-5 flex flex-col gap-2">
              {displayLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl transition-colors duration-200 py-3 px-4 text-[15px] font-semibold no-underline ${
                      active
                        ? "text-deep-espresso bg-pale-mint"
                        : "text-pale-mint bg-transparent"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t border-pale-mint/10 my-3" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      goToDashboard();
                    }}
                    className="w-full cursor-pointer transition-colors py-3 rounded-xl text-[15px] font-semibold text-deep-espresso bg-pale-mint border-none text-center"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full cursor-pointer transition-colors py-3 rounded-xl text-[15px] font-semibold text-[#ff8080] bg-[#ff8080]/10 border border-[#ff8080]/20 text-center"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/login");
                    }}
                    className="w-full cursor-pointer transition-colors py-3 rounded-xl text-[15px] font-semibold text-pale-mint bg-pale-mint/5 border border-pale-mint/10 text-center"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register");
                    }}
                    className="w-full cursor-pointer transition-all py-3 rounded-xl text-[15px] font-semibold text-deep-espresso bg-pale-mint border-none text-center"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
