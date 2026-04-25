import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
} from "../utils/studyGroupApi";
import { getAllSubjects, getSubjectById } from "../../component2/utils/C2api";
import { getUserById } from "../../component1/utils/C1api";
import RepStudySessions from "./BatchRepSession";

// ─── Icons ────────────────────────────────────────────────────────
const IconUsers = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconBook = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
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
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);
const IconCrown = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconUser = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconShield = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────
const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const inputCls = "w-full bg-[#0F0E47]/60 border border-[#505081] text-white placeholder-[#505081] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#8686AC] transition-colors";

// ─── Modal shell ─────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-[#272757] border border-[#505081] rounded-2xl w-full max-w-md shadow-2xl max-h-[85vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#505081] shrink-0">
        <h3 className="text-white font-medium">{title}</h3>
        <button onClick={onClose} className="text-[#8686AC] hover:text-white transition-colors"><IconX /></button>
      </div>
      <div className="p-6 overflow-y-auto">{children}</div>
    </div>
  </div>
);

// ─── Create / Edit modal ─────────────────────────────────────────
const ManageGroupModal = ({ group, subjects, semesterId, userId, onClose, onSuccess }) => {
  const isEdit = !!group;
  const [form, setForm] = useState({
    groupName:       group?.groupName   ?? "",
    status:          group?.status      ?? "ACTIVE",
    subjectId:       group?.subjectId   ?? (subjects[0]?.subjectId ?? ""),
    semesterId,
    createdByUserId: userId,
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.groupName.trim()) { setError("Group name is required."); return; }
    setLoading(true); setError("");
    try {
      if (isEdit) {
        await updateGroup(group.groupId, form);
      } else {
        await createGroup(form);
      }
      onSuccess(isEdit ? "Group updated!" : "Group created!");
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to save group.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={isEdit ? "Edit Study Group" : "Create Study Group"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {error && (
          <div className="bg-rose-950/50 text-rose-400 border border-rose-900 rounded-lg px-3 py-2.5 text-xs">
            {error}
          </div>
        )}

        <div>
          <label className="text-[#8686AC] text-xs mb-1.5 block">Group Name <span className="text-rose-400">*</span></label>
          <input
            required
            className={inputCls}
            placeholder="e.g. Advanced DSA Session"
            value={form.groupName}
            onChange={e => setForm(p => ({ ...p, groupName: e.target.value }))}
          />
        </div>

        <div>
          <label className="text-[#8686AC] text-xs mb-1.5 block">Subject</label>
          <select
            className={inputCls}
            value={form.subjectId}
            onChange={e => setForm(p => ({ ...p, subjectId: parseInt(e.target.value) }))}
          >
            {subjects.map(s => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName ?? s.name ?? `Subject #${s.subjectId}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[#8686AC] text-xs mb-1.5 block">Status</label>
          <div className="flex gap-2">
            {["ACTIVE", "INACTIVE"].map(s => (
              <button
                key={s} type="button"
                onClick={() => setForm(p => ({ ...p, status: s }))}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border-2 transition-all
                  ${form.status === s
                    ? s === "ACTIVE"
                      ? "bg-emerald-950/50 text-emerald-400 border-emerald-600"
                      : "bg-rose-950/50 text-rose-400 border-rose-600"
                    : "border-[#505081] text-[#8686AC] hover:border-[#8686AC]"
                  }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#505081] hover:bg-[#636399] text-white py-2.5 rounded-lg text-sm font-medium transition-all mt-2 disabled:opacity-60"
        >
          {loading ? "Processing…" : isEdit ? "Update Group" : "Create Group"}
        </button>
      </form>
    </Modal>
  );
};

// ─── Delete confirm modal ─────────────────────────────────────────
const DeleteModal = ({ group, onClose, onConfirm, loading }) => (
  <Modal title="Delete Group" onClose={onClose}>
    <div className="text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-rose-950/50 border border-rose-900 flex items-center justify-center mx-auto">
        <IconTrash />
      </div>
      <div>
        <p className="text-white font-semibold">Delete "{group.groupName}"?</p>
        <p className="text-[#8686AC] text-sm mt-1">
          This will permanently remove the group and all its members. This cannot be undone.
        </p>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onClose}
          className="flex-1 py-2.5 rounded-lg border border-[#505081] text-[#8686AC] hover:text-white text-sm font-medium transition-all">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-all disabled:opacity-60">
          {loading ? "Deleting…" : "Yes, Delete"}
        </button>
      </div>
    </div>
  </Modal>
);

// ─── Members modal ────────────────────────────────────────────────
const MembersModal = ({ group, currentUserId, onClose }) => {
  const [members,   setMembers]   = useState([]);
  const [userNames, setUserNames] = useState({});
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    getGroupMembers(group.groupId)
      .then(async (res) => {
        const list = res.data ?? res;
        setMembers(list);
        const results = await Promise.allSettled(
          list.map(m => getUserById(m.userId).then(r => ({ userId: m.userId, data: r.data ?? r })))
        );
        const names = {};
        results.forEach(r => {
          if (r.status === "fulfilled") {
            const { userId, data } = r.value;
            names[userId] = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
              || data.username || `User #${userId}`;
          }
        });
        setUserNames(names);
      })
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, [group.groupId]);

  return (
    <Modal title={`Members — ${group.groupName}`} onClose={onClose}>
      {loading ? (
        <p className="text-[#8686AC] text-sm text-center py-8">Loading members…</p>
      ) : members.length === 0 ? (
        <p className="text-[#505081] text-sm text-center py-8 italic">No members yet.</p>
      ) : (
        <ul className="space-y-2">
          {members.map(m => {
            const isCreator = m.userId === group.createdByUserId;
            const isYou     = m.userId === currentUserId;
            const name      = userNames[m.userId] ?? `User #${m.userId}`;
            const initials  = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            return (
              <li key={m.userId}
                className="flex items-center justify-between bg-[#0F0E47]/50 border border-[#505081] rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#505081] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium flex items-center gap-1.5 flex-wrap">
                      {name}
                      {isCreator && (
                        <span className="flex items-center gap-0.5 text-amber-400 text-xs">
                          <IconCrown /> Creator
                        </span>
                      )}
                      {isYou && <span className="text-[#8686AC] text-xs">(you)</span>}
                    </p>
                    <p className="text-[#8686AC] text-xs">Joined {fmtDate(m.joinedAt)}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-[#505081] text-xs text-center mt-4">
        {members.length} member{members.length !== 1 ? "s" : ""}
      </p>
    </Modal>
  );
};

// ─── Group Card ───────────────────────────────────────────────────
const GroupCard = ({ group, currentUserId, onEdit, onDelete, onViewMembers, onViewSessions }) => {
  const isActive  = group.status === "ACTIVE";
  const creatorName = group.creatorName ?? `User #${group.createdByUserId}`;
  const initials    = creatorName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="bg-[#272757] border border-[#505081] rounded-2xl flex flex-col hover:border-[#8686AC] transition-all duration-200"
    onClick={() => onViewSessions(group)}>

      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#505081]/50 flex items-center justify-center text-lg shrink-0">
          📚
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium border shrink-0 ${
          isActive
            ? "bg-emerald-950/50 text-emerald-400 border-emerald-900"
            : "bg-[#0F0E47]/60 text-[#505081] border-[#505081]"
        }`}>
          {group.status}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pb-4 flex-1 flex flex-col gap-3">
        <h3 className="text-white font-semibold text-sm leading-snug">{group.groupName}</h3>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[#8686AC] text-xs">
            <IconBook />
            <span className="truncate">{group.subjectName ?? `Subject #${group.subjectId}`}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8686AC] shrink-0"><IconUser /></span>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-4 h-4 rounded-full bg-[#505081] flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                {initials}
              </div>
              <span className="text-[#8686AC] truncate">{creatorName}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[#8686AC] text-xs">
            <IconCalendar />
            <span>Created {fmtDate(group.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#8686AC] text-xs">
            <IconUsers />
            <span>{group.memberCount ?? 0} member{group.memberCount !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Batch Rep badge */}
        <div className="flex items-center gap-1 mt-auto pt-1">
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#505081]/30 text-[#8686AC] border border-[#505081]">
            <IconShield /> Managed
          </span>
        </div>
      </div>

      {/* Footer — 3 actions */}
      <div className="flex border-t border-[#505081]/50">
        <button
          onClick={() => onViewMembers(group)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-[#8686AC] hover:text-white hover:bg-[#505081]/20 transition-all">
          <IconUsers /> Members
        </button>

        <div className="w-px bg-[#505081]/50"/>

        <button
          onClick={() => onEdit(group)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-sky-400 hover:text-sky-300 hover:bg-sky-500/5 transition-all">
          <IconEdit /> Edit
        </button>

        <div className="w-px bg-[#505081]/50"/>

        <button
          onClick={() => onDelete(group)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all">
          <IconTrash /> Delete
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════
const BatchRepStudyGroups = ({ onBack, semesterId }) => {
  const { userId } = useAuth();

  const [groups,   setGroups]   = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("ALL");
  const [toast,    setToast]    = useState(null);

  // Modals
  const [manageModal,  setManageModal]  = useState(null); // null | { mode, data? }
  const [deleteTarget, setDeleteTarget] = useState(null); // group | null
  const [deleting,     setDeleting]     = useState(false);
  const [viewMembers,  setViewMembers]  = useState(null); // group | null
  const [selectedGroup, setSelectedGroup] = useState(null);

  const flash = (msg, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, sRes] = await Promise.all([getAllGroups(), getAllSubjects()]);
      const allGroups   = gRes.data ?? gRes;
      const allSubjects = sRes.data ?? sRes;
      setSubjects(allSubjects);

      const filtered = semesterId
        ? allGroups.filter(g => g.semesterId === semesterId)
        : allGroups;

      // Resolve member counts + creator names
      const [memberResults, creatorResults] = await Promise.all([
        Promise.allSettled(
          filtered.map(g =>
            getGroupMembers(g.groupId).then(r => ({ groupId: g.groupId, members: r.data ?? r }))
          )
        ),
        Promise.allSettled(
          [...new Set(filtered.map(g => g.createdByUserId))].map(uid =>
            getUserById(uid).then(r => ({ userId: uid, data: r.data ?? r }))
          )
        ),
      ]);

      const countMap = {};
      memberResults.forEach(r => {
        if (r.status === "fulfilled") countMap[r.value.groupId] = r.value.members.length;
      });

      const creatorMap = {};
      creatorResults.forEach(r => {
        if (r.status === "fulfilled") {
          const { userId: uid, data } = r.value;
          creatorMap[uid] = `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim()
            || data.username || `User #${uid}`;
        }
      });

      const subjectMap = {};
      allSubjects.forEach(s => {
        subjectMap[s.subjectId] = s.subjectName ?? s.name ?? `Subject #${s.subjectId}`;
      });

      setGroups(filtered.map(g => ({
        ...g,
        memberCount:  countMap[g.groupId]           ?? 0,
        subjectName:  subjectMap[g.subjectId]        ?? `Subject #${g.subjectId}`,
        creatorName:  creatorMap[g.createdByUserId]  ?? `User #${g.createdByUserId}`,
      })));
    } catch {
      flash("Failed to load data.", false);
    } finally {
      setLoading(false);
    }
  }, [semesterId]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteGroup(deleteTarget.groupId);
      setGroups(p => p.filter(g => g.groupId !== deleteTarget.groupId));
      setDeleteTarget(null);
      flash("Group deleted.");
    } catch {
      flash("Failed to delete group.", false);
    } finally {
      setDeleting(false);
    }
  };

  const FILTERS = ["ALL", "ACTIVE", "INACTIVE"];

  const displayed = groups.filter(g => {
    const q = search.toLowerCase();
    if (q && !g.groupName.toLowerCase().includes(q)
          && !g.subjectName?.toLowerCase().includes(q)
          && !g.creatorName?.toLowerCase().includes(q)) return false;
    if (filter === "ACTIVE"   && g.status !== "ACTIVE")   return false;
    if (filter === "INACTIVE" && g.status !== "INACTIVE") return false;
    return true;
  });

  const counts = {
    total:    groups.length,
    active:   groups.filter(g => g.status === "ACTIVE").length,
    inactive: groups.filter(g => g.status !== "ACTIVE").length,
  };

  if (selectedGroup) {
    return <RepStudySessions group={selectedGroup} onBack={() => setSelectedGroup(null)} />
  }

  return (
    <div className="min-h-screen bg-[#0A0F2C]">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            {onBack && (
              <button onClick={onBack}
                className="flex items-center gap-2 mb-3 px-3 py-1.5 rounded-xl border border-[#505081] text-[#8686AC] hover:text-white hover:border-[#8686AC] text-sm font-medium transition-all">
                ← Back
              </button>
            )}
            <h1 className="text-white text-2xl font-semibold">Manage Study Groups</h1>
            <p className="text-[#8686AC] text-sm mt-1">
              Create, edit and moderate groups for Semester {semesterId}
            </p>
          </div>
          <button
            onClick={() => setManageModal({ mode: "create" })}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0F0E47] px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 self-start md:self-auto">
            <IconPlus /> New Study Group
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Total groups", value: counts.total   },
            { label: "Active",       value: counts.active  },
            { label: "Inactive",     value: counts.inactive},
          ].map(s => (
            <div key={s.label} className="bg-[#272757] border border-[#505081] rounded-xl px-4 py-3">
              <p className="text-[#8686AC] text-xs mb-1">{s.label}</p>
              <p className="text-white text-2xl font-medium">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#505081]"><IconSearch /></span>
            <input
              type="text"
              className={inputCls + " pl-9"}
              placeholder="Search by group name, subject or creator…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1">
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

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 border-2 border-[#505081] border-t-[#8686AC] rounded-full animate-spin"/>
            <p className="text-[#8686AC] text-sm">Loading groups…</p>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-[#505081] rounded-3xl">
            <div className="text-5xl mb-4 opacity-20">📚</div>
            <p className="text-white font-medium mb-1">No groups found</p>
            <p className="text-[#8686AC] text-sm">
              {search || filter !== "ALL"
                ? "Try a different search or filter."
                : "No study groups created yet. Create the first one!"}
            </p>
          </div>
        ) : (
          <>
            <p className="text-[#8686AC] text-xs mb-4">
              Showing <span className="text-white font-medium">{displayed.length}</span>
              {" "}of <span className="text-white font-medium">{groups.length}</span> groups
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {displayed.map(g => (
                <GroupCard
                  key={g.groupId}
                  group={g}
                  currentUserId={userId}
                  onEdit={grp => setManageModal({ mode: "edit", data: grp })}
                  onDelete={grp => setDeleteTarget(grp)}
                  onViewMembers={setViewMembers}
                  onViewSessions={setSelectedGroup}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {manageModal && (
        <ManageGroupModal
          group={manageModal.data}
          subjects={subjects}
          semesterId={semesterId}
          userId={userId}
          onClose={() => setManageModal(null)}
          onSuccess={(msg) => { flash(msg); load(); }}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          group={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}

      {viewMembers && (
        <MembersModal
          group={viewMembers}
          currentUserId={userId}
          onClose={() => setViewMembers(null)}
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

export default BatchRepStudyGroups;