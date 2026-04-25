import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getSessionsByGroup, markAttendance, removeAttendance, getAttendanceByUser  } from "../utils/studyGroupApi";
import FeedbackForm from "../../component1/pages/Feedbackform";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconVideo = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const IconLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconLogOut = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
};

const fmt12h = (time) => {
  if (!time) return "—";
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

const getSessionStatus = (session) => {
  const today = new Date().toISOString().slice(0, 10);
  if (session.sessionDate > today) return "UPCOMING";
  if (session.sessionDate < today) return "PAST";
  return "TODAY";
};

// ─── Session Card ──────────────────────────────────────────────────────────────
const SessionCard = ({ session, userId, onJoin, onLeave, busy, attendanceMap }) => {
  const isJoined = attendanceMap?.[session.sessionId] === "PRESENT";
  const isActive = session.status === "ACTIVE";
  const temporal = getSessionStatus(session);
  const isOnline = session.mode === "ONLINE";
  const isPast = temporal === "PAST";

  const temporalConfig = {
    UPCOMING: { label: "Upcoming", cls: "bg-blue-950/50 text-blue-400 border-blue-900" },
    TODAY:    { label: "Today",    cls: "bg-amber-950/50 text-amber-400 border-amber-900" },
    PAST:     { label: "Past",     cls: "bg-[#0F0E47]/60 text-[#505081] border-[#505081]" },
  };

  const modeConfig = {
    ONLINE:  { icon: <IconVideo />,  label: "Online",   cls: "bg-purple-950/50 text-purple-400 border-purple-900" },
    OFFLINE: { icon: <IconMapPin />, label: "In-person", cls: "bg-teal-950/50 text-teal-400 border-teal-900" },
  };

  const tConf = temporalConfig[temporal];
  const mConf = modeConfig[isOnline ? "ONLINE" : "OFFLINE"] ?? modeConfig.OFFLINE;

  return (
    <div className={`bg-[#272757] border rounded-2xl flex flex-col transition-all duration-200 hover:border-[#8686AC] ${
      temporal === "TODAY" ? "border-amber-800/60" : "border-[#505081]"
    }`}>
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#505081]/40 flex items-center justify-center text-lg shrink-0">
          {isOnline ? "💻" : "🏫"}
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${tConf.cls}`}>
            {tConf.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium border flex items-center gap-1 ${mConf.cls}`}>
            {mConf.icon} {mConf.label}
          </span>
          {!isActive && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-rose-950/50 text-rose-400 border-rose-900">
              Inactive
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex-1 flex flex-col gap-3">
        <h3 className="text-white font-semibold text-sm leading-snug">{session.sessionName}</h3>

        <div className="flex flex-col gap-2">
          {/* Date */}
          <div className="flex items-center gap-2 text-[#8686AC] text-xs">
            <IconCalendar />
            <span>{fmtDate(session.sessionDate)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-[#8686AC] text-xs">
            <IconClock />
            <span>{fmt12h(session.startTime)} – {fmt12h(session.endTime)}</span>
          </div>

          {/* Location / Link */}
          {isOnline ? (
            session.link && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8686AC] shrink-0"><IconLink /></span>
                <a
                  href={session.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 truncate transition-colors"
                >
                  {session.link}
                </a>
              </div>
            )
          ) : (
            session.location && (
              <div className="flex items-center gap-2 text-[#8686AC] text-xs">
                <IconMapPin />
                <span className="truncate">{session.location}</span>
              </div>
            )
          )}
        </div>

        {/* Attendance badge */}
        {isJoined && (
          <div className="flex">
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-900">
              ✓ Attending
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-[#505081]/50" />

      {/* Footer action */}
      <div className="px-5 py-3">
        {isPast || !isActive ? (
          <p className="text-[#505081] text-xs italic text-center">
            {isPast ? "Session has ended" : "Session is inactive"}
          </p>
        ) : isJoined ? (
          <button
            disabled={busy === session.sessionId}
            onClick={() => onLeave(session.sessionId)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-900/50 hover:border-rose-800 transition-all disabled:opacity-50"
          >
            <IconLogOut />
            {busy === session.sessionId ? "Leaving…" : "Leave Session"}
          </button>
        ) : (
          <button
            disabled={busy === session.sessionId}
            onClick={() => onJoin(session.sessionId)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-emerald-900/50 hover:border-emerald-800 transition-all disabled:opacity-50"
          >
            <IconPlus />
            {busy === session.sessionId ? "Joining…" : "Join Session"}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyState = ({ filtered }) => (
  <div className="text-center py-24 text-[#8686AC]">
    <div className="text-5xl mb-4 opacity-20">📅</div>
    <p className="text-white font-medium mb-1">No sessions found</p>
    <p className="text-sm">
      {filtered
        ? "Try a different search or filter."
        : "No study sessions have been created for this group yet."}
    </p>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const StudySessions = ({ group, onBack }) => {
  const { userId } = useAuth();

  const [sessions,  setSessions]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [err,       setErr]       = useState(null);
  const [busy,      setBusy]      = useState(null);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("ALL");
  const [toast,     setToast]     = useState(null);

  const [feedbackSessionId, setFeedbackSessionId] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const [attendanceMap, setAttendanceMap] = useState({});

  useEffect(() => {
  if (!userId) return;
  getAttendanceByUser(userId)
    .then((res) => {
      const list = res.data ?? res;
      const map = {};
      list.forEach(({ sessionId, attendanceStatus }) => {
        map[sessionId] = attendanceStatus;
      });
      setAttendanceMap(map);
    })
    .catch(() => {}); // silent fail — join/leave still works
}, [userId]);

  const flash = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getSessionsByGroup(group.groupId);
      const list = res.data ?? res;

      // Sort: today first, then upcoming, then past
      const order = { TODAY: 0, UPCOMING: 1, PAST: 2 };
      list.sort((a, b) => {
        const ta = order[getSessionStatus(a)] ?? 3;
        const tb = order[getSessionStatus(b)] ?? 3;
        if (ta !== tb) return ta - tb;
        return a.sessionDate.localeCompare(b.sessionDate);
      });

      setSessions(list);
    } catch {
      setErr("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  }, [group.groupId]);

  useEffect(() => { load(); }, [load]);

  const handleJoin = async (sessionId) => {
    setBusy(sessionId);
    try {
        await markAttendance({ sessionId, userId });
        setAttendanceMap(prev => ({ ...prev, [sessionId]: "PRESENT" }));
        flash("Joined session!");
    } catch (e) {
        flash(e?.response?.data?.message ?? "Failed to join session.", false);
    } finally {
        setBusy(null);
    }
    };

  const handleLeave = async (sessionId) => {
    setBusy(sessionId);
    try {
        await removeAttendance(sessionId, userId);
        setAttendanceMap(prev => ({ ...prev, [sessionId]: null }));
        flash("Left session.");
        setFeedbackSessionId(sessionId);
        setShowFeedback(true);
    } catch {
        flash("Failed to leave session.", false);
    } finally {
        setBusy(null);
    }
    };

  const FILTERS = ["ALL", "UPCOMING", "TODAY", "PAST", "JOINED"];

  const displayed = sessions.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.sessionName.toLowerCase().includes(q)
          && !s.location?.toLowerCase().includes(q)
          && !s.mode?.toLowerCase().includes(q)) return false;
    if (filter === "UPCOMING" && getSessionStatus(s) !== "UPCOMING") return false;
    if (filter === "TODAY"    && getSessionStatus(s) !== "TODAY")    return false;
    if (filter === "PAST"     && getSessionStatus(s) !== "PAST")     return false;
    if (filter === "JOINED"   && !s.isAttending)                     return false;
    return true;
  });

  const counts = {
    total:    sessions.length,
    upcoming: sessions.filter(s => getSessionStatus(s) === "UPCOMING").length,
    today:    sessions.filter(s => getSessionStatus(s) === "TODAY").length,
    joined:   sessions.filter(s => s.isAttending).length,
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-[#505081] text-[#8686AC] hover:text-white hover:border-[#8686AC] text-sm font-medium transition-all"
          >
            <IconArrowLeft /> Back to Groups
          </button>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#505081]/40 flex items-center justify-center text-2xl shrink-0">
              📚
            </div>
            <div>
              <h1 className="text-white text-2xl font-semibold">{group.groupName}</h1>
              <p className="text-[#8686AC] text-sm mt-0.5">Study Sessions</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total sessions", value: counts.total },
            { label: "Upcoming",       value: counts.upcoming },
            { label: "Today",          value: counts.today },
            { label: "Attending",      value: counts.joined },
          ].map(s => (
            <div key={s.label} className="bg-[#272757] border border-[#505081] rounded-xl px-4 py-3">
              <p className="text-[#8686AC] text-xs mb-1">{s.label}</p>
              <p className="text-white text-2xl font-medium">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#505081]"><IconSearch /></span>
            <input
              type="text"
              className="w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors"
              placeholder="Search by session name, location or mode…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-3 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-[#505081] text-white"
                    : "text-[#8686AC] hover:text-white hover:bg-[#505081]/30 border border-[#505081]"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {err && (
          <div className="bg-rose-950/50 text-rose-400 border border-rose-900 rounded-lg px-4 py-3 text-sm mb-6">{err}</div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-[#505081] border-t-[#8686AC] rounded-full animate-spin" />
            <p className="text-[#8686AC] text-sm">Loading sessions…</p>
          </div>
        ) : displayed.length === 0 ? (
          <EmptyState filtered={search !== "" || filter !== "ALL"} />
        ) : (
          <>
            <p className="text-[#8686AC] text-xs mb-4">
              Showing <span className="text-white font-medium">{displayed.length}</span>
              {" "}of <span className="text-white font-medium">{sessions.length}</span> sessions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayed.map(s => (
                <SessionCard
                  key={s.sessionId}
                  session={s}
                  userId={userId}
                  onJoin={handleJoin}
                  attendanceMap={attendanceMap} 
                  onLeave={handleLeave}
                  busy={busy}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <FeedbackForm
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        isDark={true} // Component uses dark theme colors
        userId={userId}
        sessionId={feedbackSessionId}
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium shadow-2xl backdrop-blur-xl ${
          toast.ok
            ? "bg-emerald-950/90 text-emerald-400 border-emerald-900"
            : "bg-rose-950/90 text-rose-400 border-rose-900"
        }`}>
          {toast.ok ? "✓" : "✕"} {toast.msg}
        </div>
      )}
    </div>
  );
};

export default StudySessions;