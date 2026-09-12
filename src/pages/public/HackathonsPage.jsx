
import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useSearchParams } from "react-router";

import PageHeader from "../../features/workspace/components/PageHeader";
import Button from "../../components/ui/Button";
import Container from "../../components/common/Container";
import { formatDate } from "../../utils/formatters";
import { getDiscoveryFeed } from "../../features/workspace/services/workspaceService";

const filters = [
  { value: "ALL", label: "ALL" },
  { value: "ACTIVE", label: "LIVE" },
  { value: "APPROVED", label: "YET TO COME" }
];

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state (sync with URL query params)
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || "0", 10);
  const size = parseInt(searchParams.get("size") || "10", 10);
  const [totalPages, setTotalPages] = useState(1);

  const setPage = (newPage) => {
    setSearchParams(prev => {
      prev.set("page", newPage);
      prev.set("size", size);
      return prev;
    });
  };

  const setSize = (newSize) => {
    setSearchParams(prev => {
      prev.set("page", "0");
      prev.set("size", newSize);
      return prev;
    });
  };

  // Search and filter state
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    async function fetchHackathons() {
      try {
        setLoading(true);
        const response = await getDiscoveryFeed(page, size);
        setHackathons(response.content || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.message || "Failed to load hackathons");
      } finally {
        setLoading(false);
      }
    }
    fetchHackathons();
  }, [page, size]);

  // Frontend search over the currently fetched page (as requested)
  const visibleHackathons = useMemo(() => {
    return hackathons.filter((hackathon) => {
      const matchesStatus = status === "ALL" || hackathon.hackathonStatus === status;
      const contentStr = `${hackathon.title || ""} ${hackathon.tagline || ""} ${hackathon.description || ""}`.toLowerCase();
      const matchesSearch = contentStr.includes(debouncedQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [debouncedQuery, hackathons, status]);

  return (
    <section className="py-14 bg-pale-mint min-h-screen">
      <Container>
        <PageHeader
          eyebrow="HACKATHON DISCOVERY"
          title="Find the right challenge to build, compete, and learn"
          description="Browse live and upcoming hackathons, inspect timelines, and register to participate."
        />

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Filters and Search */}
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-muted-slate/20 bg-white p-4 md:flex-row md:items-center shadow-[0_10px_30px_rgba(56,48,46,0.03)]">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-muted-slate/20 bg-[#F8FAF9] px-4 py-3 focus-within:border-soft-celadon transition-colors">
            <FaSearch className="text-muted-slate" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, tagline, or description..."
              className="w-full bg-transparent text-sm text-deep-espresso outline-none placeholder:text-muted-slate"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatus(filter.value)}
                className={`
                  rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all
                  ${status === filter.value
                    ? "border-soft-celadon bg-soft-celadon/20 text-deep-espresso shadow-[0_4px_14px_rgba(156,174,169,0.2)]"
                    : "border-muted-slate/20 bg-transparent text-warm-stone hover:border-muted-slate/40 hover:text-deep-espresso"
                  }
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(size)].map((_, i) => (
              <article
                key={`skeleton-${i}`}
                className="flex flex-col rounded-2xl border border-muted-slate/20 bg-white overflow-hidden shadow-[0_10px_30px_rgba(56,48,46,0.03)]"
              >
                {/* Banner Skeleton */}
                <div className="relative h-48 bg-[#F8FAF9] animate-pulse">
                  {/* Status Badge Skeleton */}
                  <div className="absolute top-4 right-4 h-6 w-20 rounded-full bg-muted-slate/10" />
                  {/* Profile Image Skeleton */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-20 w-20 rounded-xl bg-muted-slate/15 border-4 border-white shadow-[0_4px_14px_rgba(56,48,46,0.05)]" />
                </div>

                {/* Body Skeleton */}
                <div className="flex flex-col flex-1 p-6 pt-14 text-center animate-pulse">
                  {/* Title Skeleton */}
                  <div className="mx-auto h-6 w-3/4 rounded-full bg-muted-slate/15 mb-3" />
                  {/* Tagline Skeleton */}
                  <div className="mx-auto h-4 w-1/2 rounded-full bg-soft-celadon/30 mb-6" />

                  {/* Description Skeleton */}
                  <div className="space-y-2 mb-8">
                    <div className="h-3 w-full rounded-full bg-muted-slate/5" />
                    <div className="h-3 w-5/6 mx-auto rounded-full bg-muted-slate/5" />
                    <div className="h-3 w-4/6 mx-auto rounded-full bg-muted-slate/5" />
                  </div>

                  {/* Dates & Size Skeleton */}
                  <div className="grid grid-cols-2 gap-4 mb-6 bg-[#F8FAF9] rounded-xl p-4 border border-muted-slate/10">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-16 rounded-full bg-muted-slate/10 mb-2" />
                      <div className="h-4 w-20 rounded-full bg-muted-slate/15" />
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-16 rounded-full bg-muted-slate/10 mb-2" />
                      <div className="h-4 w-24 rounded-full bg-muted-slate/15" />
                    </div>
                  </div>

                  {/* Button Skeleton */}
                  <div className="mt-auto h-12 w-full rounded-xl bg-soft-celadon/30" />
                </div>
              </article>
            ))}
          </div>
        ) : visibleHackathons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-muted-slate/30 rounded-2xl bg-white shadow-[0_10px_30px_rgba(56,48,46,0.02)]">
            <span className="text-5xl mb-4 opacity-70">🔍</span>
            <h3 className="text-xl font-bold text-deep-espresso mb-2">No hackathons found</h3>
            <p className="text-warm-stone">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleHackathons.map((hackathon) => (
                <article
                  key={hackathon.id}
                  className="group flex flex-col rounded-2xl border border-muted-slate/20 bg-white overflow-hidden transition-all hover:-translate-y-1 hover:border-muted-slate/40 hover:shadow-2xl hover:shadow-[0_15px_40px_rgba(56,48,46,0.08)]"
                >
                  {/* Banner Area */}
                  <div className="relative h-48 bg-[#F8FAF9]">
                    {/* Inner container for banner image (with overflow-hidden for scale effect) */}
                    <div className="absolute inset-0 overflow-hidden">
                      {hackathon.bannerImageUrl ? (
                        <img
                          src={hackathon.bannerImageUrl}
                          alt="Banner"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-15 bg-[size:24px_24px]" style={{ backgroundImage: "radial-gradient(var(--color-muted-slate) 1px, transparent 1px)" }}>
                          {/* Dot pattern */}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <span className="bg-white text-[10px] font-bold tracking-widest uppercase text-deep-espresso px-3 py-1.5 rounded-full border border-muted-slate/20 shadow-sm flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {hackathon.hackathonStatus?.replace("_", " ")}
                      </span>
                    </div>

                    {/* Profile Image (Overlapping) */}
                    {hackathon.profileImageUrl && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 h-20 w-20 rounded-xl overflow-hidden border-4 border-white shadow-[0_4px_14px_rgba(56,48,46,0.05)] bg-white">
                        <img
                          src={hackathon.profileImageUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Body Area */}
                  <div className="flex flex-col flex-1 p-6 pt-14 text-center">
                    <h2
                      className="text-xl font-bold text-deep-espresso mb-1 line-clamp-1 group-hover:text-muted-slate transition-colors"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {hackathon.title}
                    </h2>
                    <p className="text-sm text-soft-celadon/90 font-bold mb-4 line-clamp-1 drop-shadow-sm">
                      {hackathon.tagline}
                    </p>

                    <p className="text-sm text-warm-stone line-clamp-3 mb-6 flex-1">
                      {hackathon.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs text-deep-espresso mb-6 bg-[#F8FAF9] border border-muted-slate/10 rounded-xl p-4">
                      <div>
                        <span className="block text-warm-stone mb-1">Starts</span>
                        <span className="font-semibold">{hackathon.hackathonStart ? formatDate(hackathon.hackathonStart) : 'TBA'}</span>
                      </div>
                      <div>
                        <span className="block text-warm-stone mb-1">Team Size</span>
                        <span className="font-semibold">{hackathon.minTeamSize} - {hackathon.maxTeamSize}</span>
                      </div>
                    </div>

                    <Link to={`/hackathons/${hackathon.id}`} className="mt-auto block">
                      <button className="w-full flex items-center justify-center bg-soft-celadon text-deep-espresso border-none hover:-translate-y-[1px] hover:bg-muted-slate hover:text-white hover:shadow-[0_6px_24px_rgba(120,133,133,0.35)] transition-all py-3 rounded-xl font-bold shadow-[0_2px_16px_rgba(156,174,169,0.3)] cursor-pointer">
                        View Details
                      </button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              {/* Prev / Pages / Next */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="flex items-center gap-2 rounded-xl border border-muted-slate/20 bg-white px-4 py-2 text-sm font-semibold text-deep-espresso transition hover:bg-[#F8FAF9] disabled:opacity-50 disabled:cursor-not-allowed h-10 shadow-sm cursor-pointer"
                >
                  <FaChevronLeft className="text-xs" />
                </button>
                <div className="flex items-center gap-1.5">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer ${page === i
                          ? "bg-soft-celadon text-deep-espresso shadow-[0_4px_14px_rgba(156,174,169,0.3)]"
                          : "bg-white text-warm-stone border border-muted-slate/20 hover:border-muted-slate/40 hover:text-deep-espresso hover:bg-[#F8FAF9]"
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page === totalPages - 1}
                  className="flex items-center gap-2 rounded-xl border border-muted-slate/20 bg-white px-4 py-2 text-sm font-semibold text-deep-espresso transition hover:bg-[#F8FAF9] disabled:opacity-50 disabled:cursor-not-allowed h-10 shadow-sm cursor-pointer"
                >
                  <FaChevronRight className="text-xs" />
                </button>
              </div>

              {/* Size & Go To */}
              <div className="flex items-center gap-4 text-sm text-warm-stone">
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="h-10 rounded-xl border border-muted-slate/20 bg-white px-3 text-deep-espresso outline-none focus:border-soft-celadon focus:ring-1 focus:ring-soft-celadon shadow-sm"
                >
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="50">50 / page</option>
                </select>

                <div className="flex items-center gap-2">
                  <span>Go to</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                          setPage(val - 1);
                        }
                      }
                    }}
                    className="h-10 w-16 rounded-xl border border-muted-slate/20 bg-white px-3 text-center text-deep-espresso outline-none focus:border-soft-celadon focus:ring-1 focus:ring-soft-celadon shadow-sm"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

