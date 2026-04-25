import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getSessionsByGroup,
  createSession,
  updateSession,
  deleteSession,
  getAttendanceBySession,
} from "../utils/studyGroupApi";
import { getUserById } from "../../component1/utils/C1api";

// ─── Icons ─────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const IconUsers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconClock = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconMapPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconVideo = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const IconLink = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);
const IconCrown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconAlertTriangle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
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
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
};
const getSessionStatus = (session) => {
  const today = new Date().toISOString().slice(0, 10);
  if (session.sessionDate > today) return "UPCOMING";
  if (session.sessionDate < today) return "PAST";
  return "TODAY";
};
const todayISO = () => new Date().toISOString().slice(0, 10);

const inputCls = "w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors";
const labelCls = "block text-[#8686AC] text-xs font-medium mb-1.5";

// ─── Modal Shell ───────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, wide, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className={`bg-[#1E1E50] border border-[#505081] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] w-full ${wide ? "max-w-2xl" : "max-w-md"}`}>
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#505081] shrink-0">
        <h3 className="text-white font-semibold text-sm">{title}</h3>
        <button onClick={onClose} className="text-[#8686AC] hover:text-white transition-colors"><IconX /></button>
      </div>
      <div className="p-6 overflow-y-auto flex-1">{children}</div>
    </div>
  </div>
);

// ─── Session Form (Create / Edit) ──────────────────────────────────────────────
const BLANK = {
  sessionName: "", sessionDate: todayISO(), startTime: "09:00",
  endTime: "11:00", mode: "ONLINE", location: "", link: "", status: "ACTIVE",
};

const SessionForm = ({ initial, groupId, createdByUserId, onSave, onClose, saving }) => {
  const [form, setForm] = useState(initial ?? BLANK);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, groupId, createdByUserId });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label className={labelCls}>Session name *</label>
        <input required className={inputCls} placeholder="e.g. OOP Revision" value={form.sessionName}
          onChange={e => set("sessionName", e.target.value)} />
      </div>

      {/* Date */}
      <div>
        <label className={labelCls}>Date *</label>
        <input required type="date" className={inputCls} value={form.sessionDate}
          onChange={e => set("sessionDate", e.target.value)} />
      </div>

      {/* Start / End time */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Start time *</label>
          <input required type="time" className={inputCls} value={form.startTime}
            onChange={e => set("startTime", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>End time *</label>
          <input required type="time" className={inputCls} value={form.endTime}
            onChange={e => set("endTime", e.target.value)} />
        </div>
      </div>

      {/* Mode */}
      <div>
        <label className={labelCls}>Mode *</label>
        <div className="flex gap-2">
          {["ONLINE", "OFFLINE"].map(m => (
            <button key={m} type="button"
              onClick={() => set("mode", m)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                form.mode === m
                  ? "bg-[#505081] text-white border-[#8686AC]"
                  : "text-[#8686AC] border-[#505081] hover:border-[#8686AC] hover:text-white"
              }`}>
              {m === "ONLINE" ? "Online" : "In-person"}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional: Location or Link */}
      {form.mode === "ONLINE" ? (
        <div>
          <label className={labelCls}>Meeting link</label>
          <input type="url" className={inputCls} placeholder="https://zoom.us/j/..." value={form.link}
            onChange={e => set("link", e.target.value)} />
        </div>
      ) : (
        <div>
          <label className={labelCls}>Location</label>
          <input className={inputCls} placeholder="e.g. Room 204, Main Building" value={form.location}
            onChange={e => set("location", e.target.value)} />
        </div>
      )}

      {/* Status */}
      <div>
        <label className={labelCls}>Status</label>
        <div className="flex gap-2">
          {["ACTIVE", "INACTIVE"].map(s => (
            <button key={s} type="button"
              onClick={() => set("status", s)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all ${
                form.status === s
                  ? s === "ACTIVE"
                    ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                    : "bg-rose-950/60 text-rose-400 border-rose-800"
                  : "text-[#8686AC] border-[#505081] hover:border-[#8686AC] hover:text-white"
              }`}>
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 py-2.5 rounded-lg text-xs font-medium text-[#8686AC] border border-[#505081] hover:text-white hover:border-[#8686AC] transition-all">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 rounded-lg text-xs font-medium bg-[#505081] hover:bg-[#6060A0] text-white transition-all disabled:opacity-50">
          {saving ? "Saving…" : initial ? "Update session" : "Create session"}
        </button>
      </div>
    </form>
  );
};

// ─── Delete Confirm Modal ──────────────────────────────────────────────────────
const DeleteConfirmModal = ({ session, onConfirm, onClose, deleting }) => (
  <Modal title="Delete session" onClose={onClose}>
    <div className="flex flex-col items-center text-center gap-4 py-2">
      <div className="w-14 h-14 rounded-2xl bg-rose-950/50 border border-rose-900 flex items-center justify-center text-rose-400">
        <IconAlertTriangle />
      </div>
      <div>
        <p className="text-white font-medium mb-1">Delete "{session.sessionName}"?</p>
        <p className="text-[#8686AC] text-sm">This will permanently remove the session and all its attendance records. This cannot be undone.</p>
      </div>
      <div className="flex gap-2 w-full pt-2">
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-lg text-xs font-medium text-[#8686AC] border border-[#505081] hover:text-white hover:border-[#8686AC] transition-all">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting}
          className="flex-1 py-2.5 rounded-lg text-xs font-medium bg-rose-900/60 hover:bg-rose-800/60 text-rose-400 border border-rose-900 hover:border-rose-700 transition-all disabled:opacity-50">
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
    </div>
  </Modal>
);

// ─── Attendance Modal ──────────────────────────────────────────────────────────
const AttendanceModal = ({ session, onClose }) => {
  const [attendees, setAttendees] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");

  useEffect(() => {
    getAttendanceBySession(session.sessionId)
      .then(async (res) => {
        const list = res.data ?? res;
        setAttendees(list);
        const results = await Promise.allSettled(
          list.map(a => getUserById(a.userId).then(r => ({ userId: a.userId, data: r.data ?? r })))
        );
        const names = {};
        results.forEach(r => {
          if (r.status === "fulfilled") {
            const { userId, data } = r.value;
            names[userId] = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim() || data.username || `User #${userId}`;
          }
        });
        setUserNames(names);
      })
      .catch(() => setAttendees([]))
      .finally(() => setLoading(false));
  }, [session.sessionId]);

  const filtered = attendees.filter(a => {
    if (!search) return true;
    const name = (userNames[a.userId] ?? "").toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <Modal title={`Attendance — ${session.sessionName}`} onClose={onClose}>
      {/* Session info pill row */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="flex items-center gap-1.5 text-xs text-[#8686AC] bg-[#0F0E47]/60 border border-[#505081] rounded-full px-3 py-1">
          <IconCalendar /> {fmtDate(session.sessionDate)}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-[#8686AC] bg-[#0F0E47]/60 border border-[#505081] rounded-full px-3 py-1">
          <IconClock /> {fmt12h(session.startTime)} – {fmt12h(session.endTime)}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-10 gap-3">
          <div className="w-6 h-6 border-2 border-[#505081] border-t-[#8686AC] rounded-full animate-spin" />
          <p className="text-[#8686AC] text-xs">Loading attendance…</p>
        </div>
      ) : attendees.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-3 opacity-20">👥</p>
          <p className="text-white font-medium text-sm mb-1">No attendees yet</p>
          <p className="text-[#505081] text-xs">No students have joined this session.</p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#505081]"><IconSearch /></span>
            <input
              type="text"
              className={inputCls + " pl-9"}
              placeholder="Search attendees…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <ul className="space-y-2">
            {filtered.map((a, i) => {
              const name = userNames[a.userId] ?? `User #${a.userId}`;
              const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
              return (
                <li key={a.userId ?? i}
                  className="flex items-center gap-3 bg-[#0F0E47]/50 border border-[#505081] rounded-xl px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-[#505081] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{name}</p>
                    {a.markedAt && (
                      <p className="text-[#505081] text-xs">Marked {new Date(a.markedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                    )}
                  </div>
                  <span className="text-emerald-400 text-xs bg-emerald-950/50 border border-emerald-900 rounded-full px-2 py-0.5 shrink-0">
                    ✓ Present
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="text-[#505081] text-xs text-center mt-4">
            {filtered.length} of {attendees.length} attendee{attendees.length !== 1 ? "s" : ""}
          </p>
        </>
      )}
    </Modal>
  );
};

// ─── Session Row Card ──────────────────────────────────────────────────────────
const SessionRowCard = ({ session, onEdit, onDelete, onViewAttendance }) => {
  const temporal = getSessionStatus(session);
  const isOnline = session.mode === "ONLINE";
  const isActive = session.status === "ACTIVE";

  const temporalCls = {
    UPCOMING: "bg-blue-950/50 text-blue-400 border-blue-900",
    TODAY:    "bg-amber-950/50 text-amber-400 border-amber-900",
    PAST:     "bg-[#0F0E47]/60 text-[#505081] border-[#505081]",
  };

  return (
    <div className={`bg-[#272757] border rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#8686AC] ${
      temporal === "TODAY" ? "border-amber-800/60" : "border-[#505081]"
    }`}>
      {/* Top accent bar for TODAY */}
      {temporal === "TODAY" && (
        <div className="h-0.5 bg-gradient-to-r from-amber-700/0 via-amber-500/60 to-amber-700/0" />
      )}

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#505081]/40 flex items-center justify-center text-base shrink-0">
              {isOnline ? "💻" : "🏫"}
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">{session.sessionName}</h3>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${temporalCls[temporal]}`}>
                  {temporal.charAt(0) + temporal.slice(1).toLowerCase()}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${
                  isOnline ? "bg-purple-950/50 text-purple-400 border-purple-900" : "bg-teal-950/50 text-teal-400 border-teal-900"
                }`}>
                  {isOnline ? <IconVideo /> : <IconMapPin />}
                  {isOnline ? "Online" : "In-person"}
                </span>
                {!isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full border bg-rose-950/50 text-rose-400 border-rose-900">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-1.5 shrink-0">
            <button onClick={() => onViewAttendance(session)}
              title="View attendance"
              className="p-2 rounded-lg text-[#8686AC] hover:text-white hover:bg-[#505081]/40 border border-transparent hover:border-[#505081] transition-all">
              <IconUsers />
            </button>
            <button onClick={() => onEdit(session)}
              title="Edit session"
              className="p-2 rounded-lg text-[#8686AC] hover:text-blue-400 hover:bg-blue-950/30 border border-transparent hover:border-blue-900 transition-all">
              <IconEdit />
            </button>
            <button onClick={() => onDelete(session)}
              title="Delete session"
              className="p-2 rounded-lg text-[#8686AC] hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900 transition-all">
              <IconTrash />
            </button>
          </div>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#8686AC]">
          <span className="flex items-center gap-1.5">
            <IconCalendar /> {fmtDate(session.sessionDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <IconClock /> {fmt12h(session.startTime)} – {fmt12h(session.endTime)}
          </span>
          {isOnline && session.link && (
            <a href={session.link} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors">
              <IconLink /> {session.link}
            </a>
          )}
          {!isOnline && session.location && (
            <span className="flex items-center gap-1.5">
              <IconMapPin /> {session.location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const RepStudySessions = ({ group, onBack }) => {
  const { userId } = useAuth();

  const [sessions,      setSessions]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [err,           setErr]           = useState(null);
  const [toast,         setToast]         = useState(null);
  const [search,        setSearch]        = useState("");
  const [filter,        setFilter]        = useState("ALL");

  // Modal states
  const [showCreate,    setShowCreate]    = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deletingSession, setDeletingSession] = useState(null);
  const [attendanceSession, setAttendanceSession] = useState(null);

  // Action loading
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const flash = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getSessionsByGroup(group.groupId);
      const list = res.data ?? res;
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

  // ── CRUD handlers ────────────────────────────────────────────────────────────
  const handleCreate = async (data) => {
    setSaving(true);
    try {
      const res = await createSession(data);
      const created = res.data ?? res;
      setSessions(prev => {
        const next = [created, ...prev];
        const order = { TODAY: 0, UPCOMING: 1, PAST: 2 };
        return next.sort((a, b) => {
          const ta = order[getSessionStatus(a)] ?? 3;
          const tb = order[getSessionStatus(b)] ?? 3;
          if (ta !== tb) return ta - tb;
          return a.sessionDate.localeCompare(b.sessionDate);
        });
      });
      setShowCreate(false);
      flash("Session created successfully!");
    } catch (e) {
      flash(e?.response?.data?.message ?? "Failed to create session.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      const res = await updateSession(editingSession.sessionId, data);
      const updated = res.data ?? { ...editingSession, ...data };
      setSessions(prev => prev.map(s => s.sessionId === editingSession.sessionId ? updated : s));
      setEditingSession(null);
      flash("Session updated!");
    } catch (e) {
      flash(e?.response?.data?.message ?? "Failed to update session.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteSession(deletingSession.sessionId);
      setSessions(prev => prev.filter(s => s.sessionId !== deletingSession.sessionId));
      setDeletingSession(null);
      flash("Session deleted.");
    } catch {
      flash("Failed to delete session.", false);
    } finally {
      setDeleting(false);
    }
  };

  // ── Filter / search ──────────────────────────────────────────────────────────
  const FILTERS = ["ALL", "UPCOMING", "TODAY", "PAST", "ACTIVE", "INACTIVE"];

  const displayed = sessions.filter(s => {
    const q = search.toLowerCase();
    if (q && !s.sessionName.toLowerCase().includes(q)
          && !s.location?.toLowerCase().includes(q)
          && !s.mode?.toLowerCase().includes(q)) return false;
    if (filter === "UPCOMING" && getSessionStatus(s) !== "UPCOMING") return false;
    if (filter === "TODAY"    && getSessionStatus(s) !== "TODAY")    return false;
    if (filter === "PAST"     && getSessionStatus(s) !== "PAST")     return false;
    if (filter === "ACTIVE"   && s.status !== "ACTIVE")              return false;
    if (filter === "INACTIVE" && s.status === "ACTIVE")              return false;
    return true;
  });

  const counts = {
    total:    sessions.length,
    upcoming: sessions.filter(s => getSessionStatus(s) === "UPCOMING").length,
    today:    sessions.filter(s => getSessionStatus(s) === "TODAY").length,
    active:   sessions.filter(s => s.status === "ACTIVE").length,
  };

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      <div className="max-w-5xl mx-auto px-5 py-8">

        {/* Header */}
        <div className="mb-8">
          <button onClick={onBack}
            className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-[#505081] text-[#8686AC] hover:text-white hover:border-[#8686AC] text-sm font-medium transition-all">
            <IconArrowLeft /> Back to Groups
          </button>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#505081]/40 flex items-center justify-center text-2xl shrink-0">📚</div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-white text-2xl font-semibold">{group.groupName}</h1>
                 
                </div>
                <p className="text-[#8686AC] text-sm mt-0.5">Manage study sessions</p>
              </div>
            </div>

            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#505081] hover:bg-[#6060A0] text-white text-sm font-medium transition-all shrink-0">
              <IconPlus /> New session
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Total sessions", value: counts.total },
            { label: "Upcoming",       value: counts.upcoming },
            { label: "Today",          value: counts.today },
            { label: "Active",         value: counts.active },
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
            <input type="text"
              className="w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors"
              placeholder="Search sessions…"
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

        {/* Session list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-[#505081] border-t-[#8686AC] rounded-full animate-spin" />
            <p className="text-[#8686AC] text-sm">Loading sessions…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24 text-[#8686AC]">
            <div className="text-5xl mb-4 opacity-20">📅</div>
            <p className="text-white font-medium mb-1">No sessions found</p>
            <p className="text-sm">
              {search || filter !== "ALL"
                ? "Try a different search or filter."
                : "No sessions yet. Click \"New session\" to create the first one."}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#8686AC] text-xs mb-4">
              Showing <span className="text-white font-medium">{displayed.length}</span>
              {" "}of <span className="text-white font-medium">{sessions.length}</span> sessions
            </p>
            <div className="flex flex-col gap-3">
              {displayed.map(s => (
                <SessionRowCard
                  key={s.sessionId}
                  session={s}
                  onEdit={setEditingSession}
                  onDelete={setDeletingSession}
                  onViewAttendance={setAttendanceSession}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <Modal title="Create new session" onClose={() => setShowCreate(false)}>
          <SessionForm
            groupId={group.groupId}
            createdByUserId={userId}
            onSave={handleCreate}
            onClose={() => setShowCreate(false)}
            saving={saving}
          />
        </Modal>
      )}

      {editingSession && (
        <Modal title="Edit session" onClose={() => setEditingSession(null)}>
          <SessionForm
            initial={{
              sessionName: editingSession.sessionName,
              sessionDate: editingSession.sessionDate,
              startTime:   editingSession.startTime?.slice(0, 5) ?? "",
              endTime:     editingSession.endTime?.slice(0, 5) ?? "",
              mode:        editingSession.mode ?? "ONLINE",
              location:    editingSession.location ?? "",
              link:        editingSession.link ?? "",
              status:      editingSession.status ?? "ACTIVE",
            }}
            groupId={group.groupId}
            createdByUserId={editingSession.createdByUserId}
            onSave={handleUpdate}
            onClose={() => setEditingSession(null)}
            saving={saving}
          />
        </Modal>
      )}

      {deletingSession && (
        <DeleteConfirmModal
          session={deletingSession}
          onConfirm={handleDelete}
          onClose={() => setDeletingSession(null)}
          deleting={deleting}
        />
      )}

      {attendanceSession && (
        <AttendanceModal
          session={attendanceSession}
          onClose={() => setAttendanceSession(null)}
        />
      )}

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

export default RepStudySessions;