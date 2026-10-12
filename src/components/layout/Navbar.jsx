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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center cursor-pointer transition-all duration-300 w-9 h-9 rounded-xl border border-dark-khaki/30 text-sm font-semibold ${
          isOpen ? "bg-dark-khaki text-corn-silk" : "bg-corn-silk/50 text-deep-espresso hover:bg-dark-khaki/20"
        }`}
      >
        <FaUser size={14} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-56 rounded-2xl py-2 z-50 transition-all bg-corn-silk border border-dark-khaki/30 shadow-[0_20px_40px_rgba(56,48,46,0.15)]"
        >
          {cleanRole && (
            <div
              className="px-4 py-3 border-b border-dark-khaki/20"
            >
              <span
                className="text-[11px] font-bold uppercase tracking-widest text-dark-khaki"
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
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-semibold cursor-pointer transition-colors duration-200 bg-transparent text-deep-espresso hover:bg-dark-khaki/10"
            >
              Dashboard
            </button>

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-semibold transition-colors duration-200 text-deep-espresso bg-transparent no-underline hover:bg-dark-khaki/10"
            >
              My Profile
            </Link>
          </div>

          <div className="border-t border-dark-khaki/20 my-1" />

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-[14px] font-semibold cursor-pointer transition-colors duration-200 text-deep-espresso bg-transparent hover:bg-dark-khaki/10"
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

  const isHackathonDetails = location.pathname.match(/^\/hackathons\/[^/]+$/);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled
            ? "bg-corn-silk/85 backdrop-blur-md border-b border-dark-khaki/30 pt-0"
            : isHackathonDetails
            ? "bg-white border-b border-transparent pt-3"
            : "bg-transparent border-b border-transparent pt-3"
        }`}
      >
        <Container>
          <nav
            className="flex items-center justify-between transition-all duration-500"
            style={{ height: scrolled ? 64 : 76 }}
          >
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
                <span className="text-dark-khaki font-medium">Sync</span>
              </span>
            </Link>

            {displayLinks.length > 0 && (
              <div
                className={`hidden md:flex items-center rounded-full px-2 gap-2 ${
                  scrolled
                    ? "bg-transparent border-none p-0"
                    : "bg-corn-silk/40 border border-dark-khaki/20 py-1.5 px-3"
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
                          ? `font-bold text-corn-silk bg-dark-khaki ${
                              !scrolled ? "shadow-[0_2px_8px_rgba(56,48,46,0.15)]" : ""
                            }`
                          : "font-semibold text-dark-khaki bg-transparent hover:text-deep-espresso hover:bg-dark-khaki/10"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            )}

            <div
              className="hidden md:flex items-center"
              style={{ gap: "16px" }}
            >
              {isAuthenticated ? (
                <>
                  <button
                    onClick={goToDashboard}
                    className="cursor-pointer transition-all duration-300 py-2.5 px-6 rounded-xl text-sm font-bold text-corn-silk bg-dark-khaki border-none shadow-[0_4px_14px_rgba(56,48,46,0.15)] hover:bg-deep-espresso hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,48,46,0.25)]"
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
                    className="cursor-pointer transition-colors duration-200 py-2 px-4 text-sm font-bold text-dark-khaki bg-transparent border-none hover:text-deep-espresso"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="cursor-pointer transition-all duration-300 py-2.5 px-6 rounded-xl text-sm font-bold text-corn-silk bg-dark-khaki border-none shadow-[0_4px_14px_rgba(56,48,46,0.15)] hover:bg-deep-espresso hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(56,48,46,0.25)]"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button
              className="md:hidden flex items-center justify-center cursor-pointer transition-colors bg-corn-silk border border-dark-khaki/30 rounded-lg text-deep-espresso text-base py-2 px-2.5 hover:bg-dark-khaki/10"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </nav>
        </Container>
      </header>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden bg-deep-espresso/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed top-[80px] left-4 right-4 z-50 md:hidden rounded-2xl overflow-hidden transition-all bg-corn-silk border border-dark-khaki/30 shadow-[0_24px_60px_rgba(56,48,46,0.5)]"
          >
            <div className="p-5 flex flex-col gap-2">
              {displayLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl transition-colors duration-200 py-3 px-4 text-[15px] font-bold no-underline ${
                      active
                        ? "text-corn-silk bg-dark-khaki"
                        : "text-deep-espresso bg-transparent hover:bg-dark-khaki/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="border-t border-dark-khaki/20 my-3" />

              {isAuthenticated ? (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      goToDashboard();
                    }}
                    className="w-full cursor-pointer transition-colors duration-200 py-3 rounded-xl text-[15px] font-bold text-corn-silk bg-dark-khaki border-none text-center hover:bg-deep-espresso"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="w-full cursor-pointer transition-colors duration-200 py-3 rounded-xl text-[15px] font-bold text-deep-espresso bg-dark-khaki/10 border border-dark-khaki/20 text-center hover:bg-dark-khaki/20"
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
                    className="w-full cursor-pointer transition-colors duration-200 py-3 rounded-xl text-[15px] font-bold text-deep-espresso bg-dark-khaki/10 border border-dark-khaki/20 text-center hover:bg-dark-khaki/20"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register");
                    }}
                    className="w-full cursor-pointer transition-colors duration-200 py-3 rounded-xl text-[15px] font-bold text-corn-silk bg-dark-khaki border-none text-center hover:bg-deep-espresso"
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
