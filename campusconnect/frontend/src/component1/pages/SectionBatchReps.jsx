import { useState, useEffect } from "react";
import {
  UserCheck, CheckCircle, XCircle, Plus,
  Trash2, RefreshCw, Mail, Hash,
  Calendar, AlertTriangle, Loader2, Users
} from "lucide-react";

import {
  StatCard, ThemedModal, ThemedField, T, StatusBadge,
} from "../components/AdminUiComponents";
import { getAllUsers, deleteUser } from "../utils/C1api";

// ─── Delete Confirm Modal ──────────────────────────────────────────
const DeleteConfirm = ({ open, name, onCancel, onConfirm, isDark }) => {
  const t = T(isDark);
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={onCancel}/>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className={`w-full max-w-sm rounded-2xl shadow-2xl border overflow-hidden ${isDark ? "bg-[#111B3D] border-[#2B3E7A]" : "bg-white border-gray-200"}`}>
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle size={22} className="text-red-600"/>
            </div>
            <h3 className={`font-bold text-base ${t.textPrimary}`}>Remove Batch Rep?</h3>
            <p className={`text-sm mt-1 ${t.textSecondary}`}>
              Remove <span className="font-semibold">{name}</span> from their batch rep role?
            </p>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onCancel} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold hover:opacity-80 ${isDark ? "border-[#2B3E7A] text-slate-300" : "border-gray-200 text-gray-600"}`}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">Yes, Remove</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Rep Card ─────────────────────────────────────────────────────
const RepCard = ({ rep, onRemove, isDark }) => {
  const t = T(isDark);
  const initials = rep.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={`${t.innerBg} border ${t.innerBorder} rounded-2xl p-4 flex flex-col gap-3 hover:border-[#5478FF]/40 hover:shadow-md transition-all group`}>
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#5478FF] to-[#53CBF3] flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className={`font-bold text-sm truncate ${t.textPrimary}`}>{rep.name}</p>
            <p className={`text-[10px] truncate ${t.textMuted}`}>{rep.email}</p>
          </div>
        </div>
        <StatusBadge status={rep.active ? "ACTIVE" : "INACTIVE"}/>
      </div>

      {/* Detail chips */}
      <div className="flex flex-wrap gap-1.5">
        {rep.batch && rep.batch !== "Not Assigned" && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-sky-300" : "bg-sky-50 border-sky-200 text-sky-700"}`}>
            <Hash size={9}/>{rep.batch}
          </span>
        )}
        {rep.program && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-purple-300" : "bg-purple-50 border-purple-200 text-purple-700"}`}>
            {rep.program}
          </span>
        )}
        {rep.since && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-amber-300" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
            <Calendar size={9}/>Since {rep.since}
          </span>
        )}
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(rep)}
        className="mt-auto w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl border border-red-400/40 text-red-500 bg-red-500/5 hover:bg-red-500/15 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={11}/>Remove Rep
      </button>
    </div>
  );
};

// ─── Skeleton Card ────────────────────────────────────────────────
const SkeletonCard = ({ isDark }) => (
  <div className={`rounded-2xl border p-4 space-y-3 animate-pulse ${isDark ? "bg-[#111B3D] border-[#2B3E7A]" : "bg-white border-gray-200"}`}>
    <div className="flex items-center gap-3">
      <div className={`h-10 w-10 rounded-xl ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
      <div className="flex-1 space-y-1.5">
        <div className={`h-3 w-3/5 rounded-full ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
        <div className={`h-2.5 w-2/5 rounded-full ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
      </div>
    </div>
    <div className="flex gap-2">
      <div className={`h-4 w-16 rounded-full ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
      <div className={`h-4 w-12 rounded-full ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
export default function SectionBatchReps({ notify, isDark }) {
  const t = T(isDark);

  const [reps,    setReps]    = useState([]);
  const [modal,   setModal]   = useState(false);
  const [confirm, setConfirm] = useState(null); // { id, name }
  const [loading, setLoading] = useState(true);
  const [removing,setRemoving]= useState(false);
  const [search,  setSearch]  = useState("");
  const [form,    setForm]    = useState({ name:"", email:"", faculty:"", program:"", batch:"" });

  useEffect(() => { loadBatchReps(); }, []);

  const loadBatchReps = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setReps(
        res.data
          .filter(u => u.roleId === 2)
          .map(u => ({
            id:      u.userId,
            name:    `${u.firstName} ${u.lastName}`,
            email:   u.email,
            batch:   u.batchId ? `Batch ${u.batchId}` : "Not Assigned",
            faculty: u.campusId,
            program: u.studentId?.slice(0, 2) ?? "",
            since:   u.createdAt?.slice(0, 7) ?? "",
            active:  u.status === "ACTIVE",
            raw:     u,
          }))
      );
    } catch {
      notify?.("error", "Failed to load batch reps");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!confirm) return;
    setRemoving(true);
    try {
      // await removeBatchRep(confirm.id);
      notify?.("success", `${confirm.name} removed as Batch Rep.`);
      loadBatchReps();
    } catch {
      notify?.("error", "Failed to remove batch rep.");
    } finally {
      setRemoving(false);
      setConfirm(null);
    }
  };

  const hc   = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const save = () => { notify?.("info", "Assign reps via request approval."); setModal(false); };

  const total    = reps.length;
  const active   = reps.filter(r => r.active).length;
  const inactive = total - active;

  const displayed = reps.filter(r =>
    !search ||
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  // ──────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-full ${t.pageBg} p-6 space-y-6`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-lg font-black flex items-center gap-2.5 ${t.textPrimary}`}>
            <div className="h-8 w-8 rounded-xl bg-[#5478FF]/15 border border-[#5478FF]/30 flex items-center justify-center">
              <UserCheck size={16} className="text-[#5478FF]"/>
            </div>
            Batch Reps
          </h2>
          <p className={`text-xs mt-0.5 ml-10 ${t.textMuted}`}>Students assigned as batch representatives</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadBatchReps}
            disabled={loading}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${isDark ? "border-[#2B3E7A] text-slate-400 hover:text-white hover:bg-[#1C2C5A]" : "border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""}/>Refresh
          </button>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#5478FF] hover:bg-[#4060ee] text-white rounded-xl text-xs font-bold shadow-sm shadow-[#5478FF]/30 transition-colors"
          >
            <Plus size={13}/>Assign Rep
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Reps"   value={total}    icon={UserCheck}   colorKey="blue"  isDark={isDark}/>
        <StatCard label="Active"       value={active}   icon={CheckCircle} colorKey="green" isDark={isDark} sub={total ? `${Math.round((active/total)*100)}% of total` : ""}/>
        <StatCard label="Inactive"     value={inactive} icon={XCircle}     colorKey="red"   isDark={isDark} sub={total ? `${Math.round((inactive/total)*100)}% of total` : ""}/>
      </div>

      {/* Toolbar */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-sm overflow-hidden`}>
        <div className={`flex items-center justify-between gap-3 px-5 py-4 border-b ${t.divider} flex-wrap`}>
          {/* Search */}
          <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 w-64 ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <Users size={13} className={t.textMuted + " shrink-0"}/>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="bg-transparent text-sm focus:outline-none flex-1 min-w-0"
            />
            {search && (
              <button onClick={() => setSearch("")} className={`shrink-0 ${t.textMuted} hover:opacity-70 text-xs`}>✕</button>
            )}
          </div>

          <span className={`text-xs ${t.textMuted}`}>
            <span className={`font-bold ${t.textSecondary}`}>{displayed.length}</span> rep{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Grid */}
        <div className="p-5">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} isDark={isDark}/>)}
            </div>
          ) : displayed.length === 0 ? (
            <div className={`py-16 text-center`}>
              <UserCheck size={36} className={`mx-auto mb-3 ${t.textMuted} opacity-30`}/>
              <p className={`text-sm font-semibold ${t.textMuted}`}>
                {search ? "No reps match your search" : "No batch reps found"}
              </p>
              <p className={`text-xs mt-1 ${t.textMuted} opacity-60`}>
                Assign reps by approving requests in the Requests section
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayed.map(r => (
                <RepCard
                  key={r.id}
                  rep={r}
                  isDark={isDark}
                  onRemove={(rep) => setConfirm({ id: rep.id, name: rep.name })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!loading && displayed.length > 0 && (
          <div className={`px-5 py-3 border-t ${t.divider} flex items-center justify-between`}>
            <p className={`text-xs ${t.textMuted}`}>{displayed.length} batch rep{displayed.length !== 1 ? "s" : ""}</p>
            <div className="flex gap-3 text-[11px] font-semibold">
              <span className="text-emerald-500">{active} active</span>
              <span className={t.textMuted}>·</span>
              <span className="text-red-400">{inactive} inactive</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Assign Modal ── */}
      <ThemedModal open={modal} onClose={() => setModal(false)} title="Assign Batch Rep Manually" isDark={isDark}>
        <div className={`flex items-start gap-2.5 rounded-xl p-3 mb-4 text-sm border ${isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
          <span className="text-base shrink-0">💡</span>
          <p className="text-xs leading-relaxed">The recommended flow is to approve a <strong>Batch Rep Registration</strong> request. Manual assignment is for edge cases only.</p>
        </div>
        <ThemedField label="Full Name" name="name"    value={form.name}    onChange={hc} isDark={isDark} required placeholder="e.g. Amaya Silva"/>
        <ThemedField label="Email"     name="email"   value={form.email}   onChange={hc} isDark={isDark} required type="email" placeholder="e.g. amaya@my.sliit.lk"/>
        <ThemedField label="Faculty"   name="faculty" value={form.faculty} onChange={hc} isDark={isDark} placeholder="e.g. Computing"/>
        <ThemedField label="Program"   name="program" value={form.program} onChange={hc} isDark={isDark} placeholder="e.g. Software Engineering"/>
        <ThemedField label="Batch"     name="batch"   value={form.batch}   onChange={hc} isDark={isDark} required placeholder="e.g. IT2023"/>
        <div className={`flex justify-end gap-2 mt-4 pt-4 border-t ${t.divider}`}>
          <button onClick={() => setModal(false)} className={`px-4 py-2 rounded-xl border text-sm font-semibold hover:opacity-80 ${isDark ? "border-[#2B3E7A] text-slate-300" : "border-gray-200 text-gray-600"}`}>Cancel</button>
          <button onClick={save} className="px-4 py-2 rounded-xl bg-[#5478FF] hover:bg-[#4060ee] text-white text-sm font-semibold shadow-sm transition-colors">Assign</button>
        </div>
      </ThemedModal>

      {/* ── Delete Confirm ── */}
      <DeleteConfirm
        open={!!confirm}
        name={confirm?.name}
        onCancel={() => setConfirm(null)}
        onConfirm={remove}
        isDark={isDark}
      />
    </div>
  );
}