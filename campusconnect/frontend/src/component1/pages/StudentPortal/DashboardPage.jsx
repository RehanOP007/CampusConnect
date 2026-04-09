import { useState, useEffect } from "react";
import { useTheme }  from "../../../contexts/ThemeContext";
import { useAuth }   from "../../../contexts/AuthContext";
import { T, loadStudentData } from "./StudentData";
import {
  getResourcesBySubject,
  createResource,
  updateResource,
  deleteResource,
} from "../../../component2/utils/C2api";
import {
  ArrowLeft, Users, BookOpen, Search, Trash2, FileText,
  X, ChevronLeft, ChevronRight, Plus, Link2, ExternalLink,
  Pencil, Loader2, AlertTriangle, CheckCircle,
} from "lucide-react";
import { data } from "react-router-dom";

// ─── Toast ────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return (
    <div className={`fixed top-5 right-5 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold
      ${toast.type === "error" ? "bg-red-500" : "bg-emerald-600"}`}>
      {toast.type === "error" ? <AlertTriangle size={15}/> : <CheckCircle size={15}/>}
      {toast.msg}
      <button onClick={onClose}><X size={13}/></button>
    </div>
  );
};

// ─── Subject card ─────────────────────────────────────────────────
const COLORS = [
  "from-[#5478FF] to-[#7C3AED]", "from-[#0EA5E9] to-[#6366F1]",
  "from-[#10B981] to-[#3B82F6]", "from-[#F59E0B] to-[#EF4444]",
  "from-[#EC4899] to-[#8B5CF6]", "from-[#14B8A6] to-[#06B6D4]",
];

const SubjectCard = ({ subject, index, onClick, t }) => (
  <div onClick={onClick}
    className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-200 hover:shadow-2xl hover:shadow-black/30">
    <div className={`h-28 relative bg-gradient-to-br ${COLORS[index % COLORS.length]}`}>
      <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={`p${subject.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="5" y="5" width="30" height="30" rx="2" fill="none" stroke="white" strokeWidth="1.5"/>
            <rect x="12" y="12" width="16" height="16" rx="1" fill="white" fillOpacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#p${subject.id})`}/>
      </svg>
      <div className="absolute bottom-2 left-3 bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
        {subject.credits} credits
      </div>
    </div>
    <div className={`px-4 py-3 border border-t-0 rounded-b-2xl ${t.cardBg} ${t.cardBorder}`}>
      <p className={`font-black text-sm truncate ${t.textPrimary}`}>{subject.name}</p>
      <p className={`text-xs mt-0.5 ${t.textSecondary}`}>{subject.code}</p>
    </div>
  </div>
);

// ─── URL input list ────────────────────────────────────────────────
const UrlInputList = ({ urls, onChange, t }) => {
  const add    = () => onChange([...urls, ""]);
  const remove = (i) => onChange(urls.filter((_, idx) => idx !== i));
  const edit   = (i, v) => onChange(urls.map((u, idx) => idx === i ? v : u));
  return (
    <div className="space-y-2">
      {urls.map((u, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 flex-1 border rounded-xl px-3 py-2 ${t.inputBg}`}>
            <Link2 size={12} className={t.textMuted + " shrink-0"}/>
            <input value={u} onChange={e => edit(i, e.target.value)}
              placeholder="https://files.example.com/file.pdf"
              className="bg-transparent text-sm focus:outline-none flex-1 min-w-0"/>
          </div>
          <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10">
            <X size={13}/>
          </button>
        </div>
      ))}
      <button onClick={add}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${t.cardBorder} ${t.textSecondary} hover:opacity-80`}>
        <Plus size={12}/>Add URL
      </button>
    </div>
  );
};

// ─── Resource modal (add / edit) ──────────────────────────────────
const ResourceModal = ({ open, onClose, mode, form, setForm, onSave, saving, t }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className={`pointer-events-auto w-full max-w-md ${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${t.divider}`}>
            <p className={`font-bold text-sm ${t.textPrimary}`}>{mode === "add" ? "Add Resource" : "Edit Resource"}</p>
            <button onClick={onClose} className={`p-1 rounded-lg ${t.modalClose}`}><X size={15}/></button>
          </div>
          <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">

            {/* Name */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>
                Resource Name <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. OOP Lecture Notes – Week 1"
                className={`w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]/40 ${t.inputBg}`}
              />
            </div>

            {/* File URLs */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>File URLs</label>
              <p className={`text-[10px] mb-2 ${t.textMuted}`}>Paste publicly accessible links to your files.</p>
              <UrlInputList urls={form.fileUrls} onChange={v => setForm(p => ({ ...p, fileUrls: v }))} t={t}/>
            </div>

            <div className={`flex justify-end gap-2 pt-2 border-t ${t.divider}`}>
              <button onClick={onClose} disabled={saving}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold hover:opacity-80 disabled:opacity-40 ${t.cardBorder} ${t.textSecondary}`}>
                Cancel
              </button>
              <button onClick={onSave} disabled={saving || !form.name.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5478FF] hover:bg-[#4060ee] disabled:opacity-40 text-white text-sm font-semibold transition-colors">
                {saving && <Loader2 size={13} className="animate-spin"/>}
                {mode === "add" ? "Create" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Delete confirm ────────────────────────────────────────────────
const DeleteConfirm = ({ open, onCancel, onConfirm, t }) => {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onCancel}/>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className={`w-full max-w-sm ${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl`}>
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} className="text-red-400"/>
            </div>
            <h3 className={`font-bold text-base ${t.textPrimary}`}>Delete Resource?</h3>
            <p className={`text-sm mt-1 ${t.textSecondary}`}>This will permanently remove the resource.</p>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onCancel} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold hover:opacity-80 ${t.cardBorder} ${t.textSecondary}`}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">Yes, Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Resources page ───────────────────────────────────────────────
function ResourcesPage({ subject, onBack, t, isDark, userId }) {
  const [resources,   setResources]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [modal,       setModal]       = useState(null);   // null | { mode, resource? }
  const [form,        setForm]        = useState({ name:"", fileUrls:[""] });
  const [saving,      setSaving]      = useState(false);
  const [confirmDel,  setConfirmDel]  = useState(null);  // resourceId
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = () => {
    setLoading(true);
    getResourcesBySubject(subject.id)
      .then(res => setResources(res?.data ?? []))
      .catch(() => showToast("Failed to load resources", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [subject.id]);

  const filtered = resources.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Open modals ────────────────────────────────────────────────
  const openAdd = () => {
    setForm({ name:"", fileUrls:[""] });
    setModal({ mode:"add" });
  };
  const openEdit = (r) => {
    setForm({ name: r.name, fileUrls: r.fileUrls?.length ? r.fileUrls : [""] });
    setModal({ mode:"edit", resource: r });
  };

  // ── Save ───────────────────────────────────────────────────────
  const handleSave = async () => {
    const cleanUrls = form.fileUrls.filter(u => u.trim() !== "");
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await createResource({
          name:            form.name.trim(),
          subjectId:       subject.id,
          createdByUserId: userId,
          fileUrls:        cleanUrls,
        });
        showToast("Resource created!");
      } else {
        await updateResource(modal.resource.resourceId, {
          name:            form.name.trim(),
          updatedByUserId: userId,
          fileUrls:        cleanUrls,
        });
        showToast("Resource updated!");
      }
      setModal(null);
      load();
    } catch (e) {
      console.log(e);
      console.log(e?.response);
      showToast(e?.response?.data?.message ?? "Failed to save resource.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      showToast("Resource deleted.", "info");
      setResources(p => p.filter(r => r.resourceId !== id));
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Failed to delete.", "error");
    } finally {
      setConfirmDel(null);
    }
  };

  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      <Toast toast={toast} onClose={() => setToast(null)}/>

      {/* Back */}
      <button onClick={onBack}
        className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-[#5478FF]/40 text-[#53CBF3] bg-[#5478FF]/10 hover:bg-[#5478FF]/20 text-sm font-semibold transition-colors">
        <ArrowLeft size={15}/> Back to Subjects
      </button>

      {/* Subject header */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-5 mb-5 flex items-center gap-4`}>
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${subject.color ?? "from-[#5478FF] to-[#7C3AED]"} flex items-center justify-center text-white font-black text-sm shrink-0`}>
          {subject.code?.slice(-2)}
        </div>
        <div className="flex-1">
          <h2 className={`font-black text-lg ${t.textPrimary}`}>{subject.name}</h2>
          <p className={`text-sm ${t.textSecondary}`}>{subject.code} · {filtered.length} resource{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5478FF] text-white rounded-xl text-sm font-bold hover:bg-[#4060ee] shadow-sm shadow-[#5478FF]/30 transition-colors">
          <Plus size={13}/>Add Resource
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 max-w-xs ${t.inputBg}`}>
          <Search size={13} className={t.textMuted + " shrink-0"}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="bg-transparent text-sm focus:outline-none flex-1"/>
          {search && <button onClick={() => setSearch("")} className={`${t.textMuted} hover:opacity-70`}><X size={11}/></button>}
        </div>
      </div>

      {/* Resource list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`rounded-2xl border p-4 animate-pulse ${t.cardBg} ${t.cardBorder}`}>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${t.innerBg}`}/>
                <div className="flex-1 space-y-2">
                  <div className={`h-3 w-3/5 rounded-full ${t.innerBg}`}/>
                  <div className={`h-2.5 w-2/5 rounded-full ${t.innerBg}`}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${t.cardBg} border ${t.cardBorder} rounded-2xl py-16 text-center`}>
          <BookOpen size={36} className={`mx-auto mb-3 ${t.textMuted} opacity-30`}/>
          <p className={`text-sm font-semibold ${t.textMuted}`}>{search ? "No resources match your search" : "No resources yet"}</p>
          <p className={`text-xs mt-1 ${t.textMuted} opacity-60`}>Click "Add Resource" to create one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => {
            const isOwner = r.createdBy === userId;
            return (
              <div key={r.resourceId}
                className={`${t.cardBg} rounded-2xl border ${t.cardBorder} hover:border-[#5478FF]/40 transition-colors overflow-hidden group`}>

                {/* Top row */}
                <div className="flex items-start gap-3 p-4">
                  <div className="h-10 w-10 rounded-xl bg-[#5478FF]/15 border border-[#5478FF]/30 flex items-center justify-center shrink-0">
                    <FileText size={17} className="text-[#5478FF]"/>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${t.textPrimary}`}>{r.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`text-[10px] ${t.textMuted}`}>v{r.version}</span>
                      {r.createdDate && (
                        <span className={`text-[10px] ${t.textMuted}`}>
                          {new Date(r.createdDate).toLocaleDateString()}
                        </span>
                      )}
                      {isOwner && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#5478FF]/15 text-[#53CBF3] border border-[#5478FF]/30">
                          My Upload
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Edit / Delete — only for owner */}
                  {isOwner && (
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors" title="Edit">
                        <Pencil size={13}/>
                      </button>
                      <button onClick={() => setConfirmDel(r.resourceId)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  )}
                </div>

                {/* File URL links */}
                {r.fileUrls?.length > 0 ? (
                  <div className={`px-4 pb-4 border-t ${t.divider} pt-3 flex flex-wrap gap-2`}>
                    <span className={`text-[10px] font-bold uppercase tracking-wider self-center mr-1 ${t.textMuted}`}>Files:</span>
                    {r.fileUrls.map((url, i) => {
                      const filename = url.split("/").pop()?.slice(0, 35) || url;
                      return (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#5478FF]/30 bg-[#5478FF]/10 text-[#53CBF3] text-[11px] font-semibold hover:bg-[#5478FF]/25 hover:border-[#5478FF]/60 transition-colors max-w-xs">
                          <ExternalLink size={10} className="shrink-0"/>
                          <span className="truncate">{filename}</span>
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <div className={`px-4 pb-3 border-t ${t.divider} pt-3`}>
                    <span className={`text-[10px] italic ${t.textMuted}`}>No files attached</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ResourceModal
        open={!!modal} onClose={() => setModal(null)}
        mode={modal?.mode} form={form} setForm={setForm}
        onSave={handleSave} saving={saving} t={t}
      />
      <DeleteConfirm
        open={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel)}
        t={t}
      />
    </div>
  );
}

// ─── Study groups placeholder ─────────────────────────────────────
function StudyGroupsPage({ semester, onBack, t }) {
  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      <button onClick={onBack}
        className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-[#5478FF]/40 text-[#53CBF3] bg-[#5478FF]/10 hover:bg-[#5478FF]/20 text-sm font-semibold">
        <ArrowLeft size={15}/> Back
      </button>
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Users size={64} className={`${t.textMuted} opacity-30`}/>
        <p className={`font-black text-xl ${t.textPrimary} opacity-40`}>Study Groups</p>
        <p className={`text-sm ${t.textMuted} opacity-50`}>Study groups for {semester?.label} — coming soon</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
export default function DashboardPage() {
  const { isDark }   = useTheme();
  const { user }     = useAuth();
  const t            = T(isDark);
  const userId       = user?.userId ?? user?.id;

  const [semesters,   setSemesters]   = useState([]);
  const [semIndex,    setSemIndex]    = useState(0);
  const [loading,     setLoading]     = useState(true);
  const [subPage,     setSubPage]     = useState("main");
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    if (!user) return;
    loadStudentData(user)
      .then(({ semesters: sems, currentSemesterId }) => {
        setSemesters(sems);
        const idx = sems.findIndex(s => s.id === currentSemesterId);
        setSemIndex(idx >= 0 ? idx : 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const semester = semesters[semIndex];
  const goLeft   = () => setSemIndex(i => Math.max(0, i - 1));
  const goRight  = () => setSemIndex(i => Math.min(semesters.length - 1, i + 1));

  if (subPage === "studygroups")
    return <StudyGroupsPage semester={semester} onBack={() => setSubPage("main")} t={t}/>;

  if (subPage === "resources" && selectedSub)
    return (
      <ResourcesPage
        subject={selectedSub}
        onBack={() => setSubPage("main")}
        t={t}
        isDark={isDark}
        userId={userId}
      />
    );

  if (loading) return (
    <div className={`min-h-full ${t.pageBg} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#5478FF] border-t-transparent animate-spin"/>
        <p className={`text-sm ${t.textMuted}`}>Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className={`min-h-full ${t.pageBg} p-6 space-y-6`}>
      {/* Welcome */}
      <div>
        <h1 className={`text-2xl font-black ${t.textPrimary}`}>
          Welcome back, {user?.username ?? "Student"} 👋
        </h1>
        <p className={`text-sm mt-1 ${t.textSecondary}`}>Your academic overview</p>
      </div>

      {/* Semester navigator */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-5`}>

        {/* Arrow row */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={goLeft} disabled={semIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-all
              ${semIndex === 0
                ? `opacity-30 cursor-not-allowed ${t.cardBorder} ${t.textMuted}`
                : `border-[#5478FF]/40 text-[#53CBF3] hover:bg-[#5478FF]/10`}`}>
            <ChevronLeft size={16}/>
            <span className="hidden sm:inline text-xs">{semesters[semIndex - 1]?.label ?? "Previous"}</span>
          </button>

          <div className="text-center flex-1 px-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className={`font-black text-base ${t.textPrimary}`}>{semester?.label ?? "—"}</h2>
              {semester?.isCurrent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">CURRENT</span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${t.textSecondary}`}>
              {semIndex + 1} of {semesters.length} · {semester?.subjects?.length ?? 0} subjects
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              {semesters.map((_, i) => (
                <button key={i} onClick={() => setSemIndex(i)}
                  className={`rounded-full transition-all ${i === semIndex ? "w-4 h-1.5 bg-[#5478FF]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}/>
              ))}
            </div>
          </div>

          <button onClick={goRight} disabled={semIndex === semesters.length - 1}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-all
              ${semIndex === semesters.length - 1
                ? `opacity-30 cursor-not-allowed ${t.cardBorder} ${t.textMuted}`
                : `border-[#5478FF]/40 text-[#53CBF3] hover:bg-[#5478FF]/10`}`}>
            <span className="hidden sm:inline text-xs">{semesters[semIndex + 1]?.label ?? "Next"}</span>
            <ChevronRight size={16}/>
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end mb-5">
          <button onClick={() => setSubPage("studygroups")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5478FF]/10 border border-[#5478FF]/30 text-[#53CBF3] text-xs font-bold hover:bg-[#5478FF]/20 transition-colors">
            <Users size={13}/> Study Groups
          </button>
        </div>

        {/* Subject grid */}
        {!semester?.subjects?.length ? (
          <div className={`text-center py-12 text-sm ${t.textMuted}`}>No subjects found for this semester</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {semester.subjects.map((sub, i) => (
              <SubjectCard key={sub.id} subject={sub} index={i} t={t}
                onClick={() => { setSelectedSub(sub); setSubPage("resources"); }}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}