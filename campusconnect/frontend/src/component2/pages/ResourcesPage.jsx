import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { T } from "../../component1/pages/StudentPortal/StudentData";
import {
  FileText, Download, Trash2, Upload, Search,
  ChevronDown, X, BookOpen, CheckCircle, AlertTriangle,
  Pencil, Plus, ExternalLink, Link2, Loader2, RefreshCw,
} from "lucide-react";
import {
  getResourcesBySubject,
  createResource,
  updateResource,
  deleteResource,
  getSubjectsBySemester,
} from "../utils/C2api";

// ─── Toast ────────────────────────────────────────────────────────
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  const styles = { success:"bg-emerald-600", error:"bg-red-500", info:"bg-[#5478FF]", warning:"bg-amber-500" };
  const icons  = { success:<CheckCircle size={15}/>, error:<AlertTriangle size={15}/>, info:<CheckCircle size={15}/>, warning:<AlertTriangle size={15}/> };
  return (
    <div className={`fixed top-5 right-5 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${styles[toast.type]}`}>
      {icons[toast.type]}{toast.msg}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={13}/></button>
    </div>
  );
};

// ─── File URL pill — clickable ─────────────────────────────────────
const UrlPill = ({ url }) => {
  const short = url.split("/").pop()?.slice(0, 30) ?? url;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#5478FF]/30 bg-[#5478FF]/10 text-[#53CBF3] text-[11px] font-semibold hover:bg-[#5478FF]/25 hover:border-[#5478FF]/60 transition-colors max-w-full">
      <ExternalLink size={10} className="shrink-0"/>
      <span className="truncate">{short}</span>
    </a>
  );
};

// ─── URL input list ────────────────────────────────────────────────
const UrlInputList = ({ urls, onChange, isDark, t }) => {
  const add    = () => onChange([...urls, ""]);
  const remove = (i) => onChange(urls.filter((_, idx) => idx !== i));
  const edit   = (i, v) => onChange(urls.map((u, idx) => idx === i ? v : u));
  return (
    <div className="space-y-2">
      {urls.map((u, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 flex-1 border rounded-xl px-3 py-2 ${t.inputBg}`}>
            <Link2 size={12} className={t.textMuted + " shrink-0"}/>
            <input value={u} onChange={e => edit(i, e.target.value)} placeholder="https://files.example.com/file.pdf"
              className="bg-transparent text-sm focus:outline-none flex-1 min-w-0"/>
          </div>
          <button onClick={() => remove(i)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors shrink-0">
            <X size={13}/>
          </button>
        </div>
      ))}
      <button onClick={add}
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${isDark ? "border-[#2B3E7A] text-slate-400 hover:text-white hover:bg-[#1C2C5A]" : "border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
        <Plus size={12}/>Add URL
      </button>
    </div>
  );
};

// ─── Resource modal (create / edit) ───────────────────────────────
const ResourceModal = ({ open, onClose, mode, form, setForm, subjects, onSave, saving, isDark }) => {
  const t = T(isDark);
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className={`pointer-events-auto w-full max-w-lg ${isDark ? "bg-[#111B3D] border-[#2B3E7A]" : "bg-white border-gray-200"} rounded-2xl border shadow-2xl overflow-hidden`}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-[#2B3E7A]" : "border-gray-100"}`}>
            <p className={`font-bold text-sm ${t.textPrimary}`}>{mode === "add" ? "Add Resource" : "Edit Resource"}</p>
            <button onClick={onClose} className={`p-1 rounded-lg ${t.modalClose}`}><X size={15}/></button>
          </div>
          <div className="px-5 py-4 space-y-4 max-h-[75vh] overflow-y-auto">

            {/* Name */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>Resource Name <span className="text-red-400">*</span></label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. OOP Lecture Notes – Week 1"
                className={`w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]/40 ${t.inputBg}`}/>
            </div>

            {/* Subject — only for add */}
            {mode === "add" && (
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>Subject <span className="text-red-400">*</span></label>
                <select value={form.subjectId} onChange={e => setForm(p => ({ ...p, subjectId: e.target.value }))}
                  className={`w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]/40 appearance-none ${t.inputBg}`}>
                  <option value="">Select subject…</option>
                  {subjects.map(s => <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} — {s.subjectName}</option>)}
                </select>
              </div>
            )}

            {/* File URLs */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>File URLs</label>
              <p className={`text-[10px] mb-2 ${t.textMuted}`}>Paste publicly accessible links to your PDF/image files.</p>
              <UrlInputList urls={form.fileUrls} onChange={v => setForm(p => ({ ...p, fileUrls: v }))} isDark={isDark} t={t}/>
            </div>

            <div className={`flex justify-end gap-2 pt-2 border-t ${isDark ? "border-[#2B3E7A]" : "border-gray-100"}`}>
              <button onClick={onClose} disabled={saving}
                className={`px-4 py-2 rounded-xl border text-sm font-semibold hover:opacity-80 disabled:opacity-40 ${isDark ? "border-[#2B3E7A] text-slate-300" : "border-gray-200 text-gray-600"}`}>
                Cancel
              </button>
              <button onClick={onSave} disabled={saving || !form.name.trim() || (mode === "add" && !form.subjectId)}
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
const DeleteConfirm = ({ open, onCancel, onConfirm, isDark }) => {
  const t = T(isDark);
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={onCancel}/>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className={`w-full max-w-sm ${isDark ? "bg-[#111B3D] border-[#2B3E7A]" : "bg-white border-gray-200"} rounded-2xl border shadow-2xl overflow-hidden`}>
          <div className="px-6 pt-6 pb-4 text-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} className="text-red-500"/>
            </div>
            <h3 className={`font-bold text-base ${t.textPrimary}`}>Delete Resource?</h3>
            <p className={`text-sm mt-1 ${t.textSecondary}`}>This will permanently remove the resource and all its file links.</p>
          </div>
          <div className="px-6 pb-6 flex gap-3">
            <button onClick={onCancel} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold hover:opacity-80 ${isDark ? "border-[#2B3E7A] text-slate-300" : "border-gray-200 text-gray-600"}`}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors">Yes, Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────
const Skeleton = ({ isDark }) => (
  <div className={`rounded-2xl border p-4 animate-pulse ${isDark ? "bg-[#111B3D] border-[#2B3E7A]" : "bg-white border-gray-200"}`}>
    <div className="flex items-center gap-3 mb-3">
      <div className={`h-10 w-10 rounded-xl ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
      <div className="flex-1 space-y-1.5">
        <div className={`h-3.5 w-3/5 rounded-full ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
        <div className={`h-2.5 w-2/5 rounded-full ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
      </div>
    </div>
    <div className="flex gap-2">
      <div className={`h-5 w-24 rounded-lg ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
      <div className={`h-5 w-20 rounded-lg ${isDark ? "bg-[#1C2C5A]" : "bg-gray-100"}`}/>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
export default function ResourcesPage({ subjectContext = null, setSubjectContext }) {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const t = T(isDark);
  console.log(user)

  const semesterId = user?.semesterId;
  const userId     = user?.userId ?? user?.id;

  // ── Data state ────────────────────────────────────────────────
  const [subjects,   setSubjects]   = useState([]);
  const [resources,  setResources]  = useState([]);   // flat: { ...resource, subjectId, subjectName, subjectCode }
  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingRes, setLoadingRes] = useState(false);

  // ── UI state ──────────────────────────────────────────────────
  const [selSubject, setSelSubject] = useState(subjectContext?.subjectId ?? "all");
  const [search,     setSearch]     = useState("");
  const [sortBy,     setSortBy]     = useState("date");
  const [modal,      setModal]      = useState(null);   // null | { mode:"add"|"edit", resource? }
  const [form,       setForm]       = useState({ name:"", subjectId:"", fileUrls:[""] });
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);  // resourceId
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  // ── Load subjects on mount ────────────────────────────────────
  useEffect(() => {
    if (!semesterId) return;
    loadSubjects();
  }, [semesterId]);

  const loadSubjects = async () => {
    setLoadingSub(true);
    try {
      const res = await getSubjectsBySemester(semesterId);
      setSubjects(res?.data ?? []);
    } catch {
      showToast("Failed to load subjects.", "error");
    } finally {
      setLoadingSub(false);
    }
  };

  // ── Load resources whenever subjects change ───────────────────
  useEffect(() => {
    if (subjects.length === 0) return;
    loadAllResources();
  }, [subjects]);

  const loadAllResources = async () => {
    setLoadingRes(true);
    try {
      const results = await Promise.all(
        subjects.map(s =>
          getResourcesBySubject(s.subjectId)
            .then(r => (r?.data ?? []).map(res => ({
              ...res,
              subjectId:   s.subjectId,
              subjectName: s.subjectName,
              subjectCode: s.subjectCode,
            })))
            .catch(() => [])
        )
      );
      setResources(results.flat());
    } catch {
      showToast("Failed to load resources.", "error");
    } finally {
      setLoadingRes(false);
    }
  };

  // ── Filter + sort ─────────────────────────────────────────────
  const filtered = resources
    .filter(r =>
      (selSubject === "all" || String(r.subjectId) === String(selSubject)) &&
      (!search || r.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) =>
      sortBy === "date"
        ? new Date(b.createdDate ?? 0) - new Date(a.createdDate ?? 0)
        : a.name.localeCompare(b.name)
    );

  // ── Stats ─────────────────────────────────────────────────────
  const totalFiles = resources.reduce((acc, r) => acc + (r.fileUrls?.length ?? 0), 0);
  const subjectsCovered = new Set(resources.map(r => r.subjectId)).size;

  // ── Open add modal ────────────────────────────────────────────
  const openAdd = () => {
    setForm({ name:"", subjectId: selSubject !== "all" ? selSubject : "", fileUrls:[""] });
    setModal({ mode:"add" });
  };

  // ── Open edit modal ───────────────────────────────────────────
  const openEdit = (resource) => {
    setForm({
      name:      resource.name,
      subjectId: resource.subjectId,
      fileUrls:  resource.fileUrls?.length ? resource.fileUrls : [""],
    });
    setModal({ mode:"edit", resource });
  };

  // ── Save (create or update) ───────────────────────────────────
  const handleSave = async () => {
    const cleanUrls = form.fileUrls.filter(u => u.trim() !== "");
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await createResource({
          name:           form.name.trim(),
          subjectId:      Number(form.subjectId),
          createdByUserId: userId,
          fileUrls:       cleanUrls,
        });
        showToast("Resource created successfully!");
      } else {
        await updateResource(modal.resource.resourceId, {
          name:           form.name.trim(),
          updatedByUserId: userId,
          fileUrls:       cleanUrls,
        });
        showToast("Resource updated successfully!");
      }
      setModal(null);
      loadAllResources();
    } catch (e) {
      console.log(e);
      showToast(e?.response?.data?.message ?? "Failed to save resource.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────
  const loading = loadingSub || loadingRes;

  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      <Toast toast={toast} onClose={() => setToast(null)}/>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className={`text-xl font-black flex items-center gap-2 ${t.textPrimary}`}>
            <div className="h-8 w-8 rounded-xl bg-[#5478FF]/15 border border-[#5478FF]/30 flex items-center justify-center">
              <BookOpen size={16} className="text-[#5478FF]"/>
            </div>
            Resources
          </h2>
          <p className={`text-xs mt-0.5 ml-10 ${t.textMuted}`}>
            {semesterId ? `Semester ${semesterId} · ${subjects.length} subjects` : "No semester found in your profile"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadAllResources} disabled={loading}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${isDark ? "border-[#2B3E7A] text-slate-400 hover:text-white hover:bg-[#1C2C5A]" : "border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
            <RefreshCw size={12} className={loading ? "animate-spin" : ""}/>Refresh
          </button>
          <button onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#5478FF] text-white rounded-xl text-sm font-bold hover:bg-[#4060ee] shadow-sm shadow-[#5478FF]/30 transition-colors">
            <Plus size={14}/>Add Resource
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:"Total Resources", value: resources.length, color:"border-blue-500/30 bg-blue-500/10 text-blue-400" },
          { label:"Total Files",     value: totalFiles,        color:"border-green-500/30 bg-green-500/10 text-green-400" },
          { label:"Subjects",        value: subjectsCovered,   color:"border-purple-500/30 bg-purple-500/10 text-purple-400" },
        ].map(s => (
          <div key={s.label} className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-4 flex items-center gap-3`}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border text-xl font-black ${s.color}`}>{s.value}</div>
            <p className={`text-xs font-medium ${t.textSecondary}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        {/* Search */}
        <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-[160px] max-w-xs ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-white" : "bg-white border-gray-200 text-gray-900"}`}>
          <Search size={13} className={t.textMuted + " shrink-0"}/>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search resources…"
            className="bg-transparent text-sm focus:outline-none flex-1"/>
          {search && <button onClick={() => setSearch("")} className={`${t.textMuted} hover:opacity-70`}><X size={11}/></button>}
        </div>

        {/* Subject filter */}
        <div className="relative">
          <select value={selSubject} onChange={e => { setSelSubject(e.target.value); setSubjectContext?.(null); }}
            className={`appearance-none border rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:outline-none cursor-pointer ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <option value="all">All Subjects</option>
            {subjects.map(s => <option key={s.subjectId} value={s.subjectId}>{s.subjectCode} — {s.subjectName}</option>)}
          </select>
          <ChevronDown size={12} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`}/>
        </div>

        {/* Sort */}
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className={`appearance-none border rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:outline-none cursor-pointer ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-white" : "bg-white border-gray-200 text-gray-900"}`}>
            <option value="date">Newest first</option>
            <option value="name">Name A–Z</option>
          </select>
          <ChevronDown size={12} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`}/>
        </div>

        {/* Count */}
        <span className={`text-xs ${t.textMuted} ml-auto`}>
          <span className={`font-bold ${t.textSecondary}`}>{filtered.length}</span> resource{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Resource list */}
      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} isDark={isDark}/>)}</div>
      ) : filtered.length === 0 ? (
        <div className={`${t.cardBg} border ${t.cardBorder} rounded-2xl py-16 text-center`}>
          <BookOpen size={36} className={`mx-auto mb-3 ${t.textMuted} opacity-30`}/>
          <p className={`font-bold text-sm ${t.textPrimary}`}>{search ? "No resources match your search" : "No resources yet"}</p>
          <p className={`text-xs mt-1 ${t.textSecondary}`}>Click "Add Resource" to create one</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(r => (
            <div key={r.resourceId}
              className={`${t.cardBg} rounded-2xl border ${t.cardBorder} hover:border-[#5478FF]/40 transition-colors group`}>

              {/* Top row */}
              <div className="flex items-start gap-4 p-4">
                <div className="h-10 w-10 rounded-xl bg-[#5478FF]/15 border border-[#5478FF]/30 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-[#5478FF]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`font-bold text-sm ${t.textPrimary}`}>{r.name}</p>
                      <div className="flex items-center gap-2 flex-wrap mt-0.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${isDark ? "bg-[#0B1230] border-[#2B3E7A] text-sky-300" : "bg-sky-50 border-sky-200 text-sky-700"}`}>
                          {r.subjectCode}
                        </span>
                        <span className={`text-[10px] ${t.textMuted}`}>{r.subjectName}</span>
                        <span className={`text-[10px] ${t.textMuted}`}>v{r.version}</span>
                        {r.createdDate && (
                          <span className={`text-[10px] ${t.textMuted}`}>
                            {new Date(r.createdDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions — show on hover */}
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg text-sky-500 hover:bg-sky-500/10 transition-colors" title="Edit">
                        <Pencil size={13}/>
                      </button>
                      <button onClick={() => setConfirmDel(r.resourceId)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File URLs */}
              {r.fileUrls?.length > 0 && (
                <div className={`px-4 pb-4 pt-0 flex flex-wrap gap-1.5 border-t ${isDark ? "border-[#1D2D68]" : "border-gray-100"} pt-3`}>
                  <span className={`text-[10px] font-bold uppercase tracking-wider mr-1 self-center ${t.textMuted}`}>Files:</span>
                  {r.fileUrls.map((url, i) => <UrlPill key={i} url={url}/>)}
                </div>
              )}
              {(!r.fileUrls || r.fileUrls.length === 0) && (
                <div className={`px-4 pb-3 pt-0 border-t ${isDark ? "border-[#1D2D68]" : "border-gray-100"} pt-3`}>
                  <span className={`text-[10px] ${t.textMuted} italic`}>No files attached · click Edit to add URLs</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ResourceModal
        open={!!modal} onClose={() => setModal(null)}
        mode={modal?.mode} form={form} setForm={setForm}
        subjects={subjects} onSave={handleSave}
        saving={saving} isDark={isDark}
      />
      <DeleteConfirm
        open={!!confirmDel}
        onCancel={() => setConfirmDel(null)}
        onConfirm={() => handleDelete(confirmDel)}
        isDark={isDark}
      />
    </div>
  );
}