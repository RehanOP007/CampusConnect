import { useState, useEffect, useCallback } from "react";
import {
  getResourcesBySubject, createResource, updateResource, deleteResource,
  createOrUpdateRating, getRatingsByEntity, deleteRating, getRatingSummary
} from "../utils/C2api";
import {
  ArrowLeft, BookOpen, Search, Trash2, FileText, X, Plus,
  ExternalLink, Pencil, Star, MessageSquare, ChevronDown,
  AlertTriangle, CheckCircle,
} from "lucide-react";
import ResourceModal from "../components/ResourceModal";

/* ── Toast ── */
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

/* ── Delete Confirm ── */
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
            <button onClick={onCancel} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary}`}>Cancel</button>
            <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold">Yes, Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ── Star Rating Input ── */
const StarInput = ({ value, onChange, size = 18 }) => (
  <div className="flex items-center gap-1">
    {[1,2,3,4,5].map(s => (
      <button key={s} type="button" onClick={() => onChange(s)}
        className="transition-transform hover:scale-110">
        <Star size={size}
          className={s <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}/>
      </button>
    ))}
  </div>
);

/* ── Star Display ── */
const StarDisplay = ({ value, size = 12 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size}
        className={s <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}/>
    ))}
  </div>
);

/* ── Average Stars ── */
const AvgStars = ({ ratings, size = 11 }) => {
  if (!ratings?.length) return null;
  const avg = ratings.reduce((a, r) => a + r.ratingValue, 0) / ratings.length;
  return (
    <div className="flex items-center gap-1">
      <StarDisplay value={Math.round(avg)} size={size}/>
      <span className="text-[10px] text-yellow-400 font-bold">{avg.toFixed(1)}</span>
      <span className="text-[10px] text-gray-500">({ratings.length})</span>
    </div>
  );
};

/* ── Rating Panel for a resource ── */
const RatingPanel = ({ resourceId, userId, t, isDark }) => {
  const [ratings,     setRatings]     = useState([]);
  const [loadingR,    setLoadingR]    = useState(true);
  const [showForm,    setShowForm]    = useState(false);
  const [ratingVal,   setRatingVal]   = useState(0);
  const [comment,     setComment]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [expanded,    setExpanded]    = useState(false);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalRatings: 0
    });

  const loadSummary = useCallback(() => {
    getRatingSummary("RESOURCE", resourceId)
        .then(res => setSummary(res.data))
        .catch(() => setSummary({ averageRating: 0, totalRatings: 0 }));
    }, [resourceId]);

  const myRating = ratings.find(r => r.userId === userId);

  const loadRatings = useCallback(() => {
    setLoadingR(true);
    getRatingsByEntity("RESOURCE", resourceId)
      .then(res => setRatings(res?.data ?? []))
      .catch(() => setRatings([]))
      .finally(() => setLoadingR(false));
  }, [resourceId]);

  useEffect(() => { loadRatings(); loadSummary(); }, [loadRatings], [loadSummary]);

  // Pre-fill form if user already rated
  useEffect(() => {
    if (myRating) {
      setRatingVal(myRating.ratingValue);
      setComment(myRating.comment ?? "");
    } else {
      setRatingVal(0); setComment("");
    }
  }, [myRating]);

  const handleSubmit = async () => {
    if (!ratingVal) return;
    setSubmitting(true);
    try {
        
      await createOrUpdateRating({
        userId, entityType: "RESOURCE", entityId: resourceId,
        ratingValue: ratingVal, comment: comment.trim(),
      });
     
      setShowForm(false);
      loadRatings();
    } catch(e) {
        console.error("Failed to submit rating", e);
     }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!myRating) return;
    try {
      await deleteRating(myRating.ratingId);
      setShowForm(false);
      loadRatings();
    } catch { /* silent */ }
  };

  return (
    <div className={`border-t ${t.divider} px-4 py-3`}>

      {/* Summary row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3">
          {loadingR ? (
            <span className={`text-[10px] ${t.textMuted}`}>Loading ratings…</span>
          ) : (
            <AvgStars ratings={ratings}/>
          )}
          {!loadingR && ratings.length === 0 && (
            <span className={`text-[10px] ${t.textMuted}`}>No ratings yet</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Show all ratings toggle */}
          {ratings.length > 0 && (
            <button onClick={() => setExpanded(p => !p)}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#53CBF3] hover:opacity-80">
              <MessageSquare size={11}/>
              {expanded ? "Hide" : `${ratings.length} rating${ratings.length !== 1 ? "s" : ""}`}
              <ChevronDown size={11} className={`transition-transform ${expanded ? "rotate-180" : ""}`}/>
            </button>
          )}

          {/* Rate / Edit button */}
          <button
            onClick={() => setShowForm(p => !p)}
            className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors
              ${myRating
                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                : "border-[#5478FF]/40 bg-[#5478FF]/10 text-[#53CBF3] hover:bg-[#5478FF]/20"}`}>
            <Star size={10} className={myRating ? "fill-yellow-400" : ""}/>
            {myRating ? "Edit Rating" : "Rate"}
          </button>
        </div>
      </div>

      {/* All ratings — only ratingValue stars, no comments */}
      {expanded && ratings.length > 0 && (
        <div className={`mt-3 pt-3 border-t ${t.divider} grid grid-cols-5 sm:grid-cols-8 gap-1.5`}>
          {ratings.map(r => (
            <div key={r.ratingId}
              className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg ${t.innerBg}`}>
              <StarDisplay value={r.ratingValue} size={10}/>
              <span className="text-[9px] font-bold text-yellow-400">{r.ratingValue}/5</span>
              <span className="text-[10px] font-semibold text-gray-400">{r.comment}</span>
            </div>
          ))}
        </div>
      )}

      {/* Rating form */}
      {showForm && (
        <div className={`mt-3 pt-3 border-t ${t.divider} space-y-3`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs font-bold ${t.textPrimary}`}>
              {myRating ? "Update your rating" : "Rate this resource"}
            </p>
            {myRating && (
              <button onClick={handleDelete}
                className="text-[10px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1">
                <Trash2 size={10}/> Remove rating
              </button>
            )}
          </div>

          <StarInput value={ratingVal} onChange={setRatingVal}/>

          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment (optional)…"
            rows={2}
            className={`w-full px-3 py-2 rounded-xl border text-xs resize-none outline-none focus:ring-2 focus:ring-[#5478FF]/30 focus:border-[#5478FF]
              ${t.inputBg}`}
          />

          <div className="flex items-center justify-end gap-2">
            <button onClick={() => setShowForm(false)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${t.cardBorder} ${t.textSecondary}`}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!ratingVal || submitting}
              className="px-3 py-1.5 rounded-lg bg-[#5478FF] text-white text-xs font-bold disabled:opacity-50 hover:bg-[#4060ee] transition-colors">
              {submitting ? "Saving…" : myRating ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   RESOURCES PAGE
════════════════════════════════════════════ */
export default function ResourcesPage({ subject, onBack, t, isDark, userId }) {
  const [resources,  setResources]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [modal,      setModal]      = useState(null);
  const [form,       setForm]       = useState({ name:"", fileUrls:[""] });
  const [saving,     setSaving]     = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [toast,      setToast]      = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const load = useCallback(() => {
    setLoading(true);
    getResourcesBySubject(subject.id)
      .then(res => setResources(res?.data ?? []))
      .catch(() => showToast("Failed to load resources", "error"))
      .finally(() => setLoading(false));
  }, [subject.id]);

  useEffect(() => { load(); }, [load]);

  const filtered = resources.filter(r =>
    !search || r.name?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setForm({ name:"", fileUrls:[""] }); setModal({ mode:"add" }); };
  const openEdit = (r) => { setForm({ name:r.name, fileUrls:r.fileUrls?.length ? r.fileUrls : [""] }); setModal({ mode:"edit", resource:r }); };

  const handleSave = async () => {
    const cleanUrls = form.fileUrls.filter(u => u.trim() !== "");
    setSaving(true);
    try {
      if (modal.mode === "add") {
        await createResource({ name:form.name.trim(), subjectId:subject.id, createdByUserId:userId, fileUrls:cleanUrls });
        showToast("Resource created!");
      } else {
        await updateResource(modal.resource.resourceId, { name:form.name.trim(), updatedByUserId:userId, fileUrls:cleanUrls });
        showToast("Resource updated!");
      }
      setModal(null); load();
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Failed to save resource.", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      showToast("Resource deleted.");
      setResources(p => p.filter(r => r.resourceId !== id));
    } catch (e) {
      showToast(e?.response?.data?.message ?? "Failed to delete.", "error");
    } finally { setConfirmDel(null); }
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
        <div className="flex-1 min-w-0">
          <h2 className={`font-black text-lg ${t.textPrimary}`}>{subject.name}</h2>
          <p className={`text-sm ${t.textSecondary}`}>
            {subject.code} · {filtered.length} resource{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5478FF] text-white rounded-xl text-sm font-bold hover:bg-[#4060ee] shadow-sm shadow-[#5478FF]/30 transition-colors shrink-0">
          <Plus size={13}/> Add Resource
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 max-w-xs ${t.inputBg}`}>
          <Search size={13} className={`${t.textMuted} shrink-0`}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="bg-transparent text-sm focus:outline-none flex-1"/>
          {search && <button onClick={() => setSearch("")}><X size={11} className={t.textMuted}/></button>}
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
          <p className={`text-sm font-semibold ${t.textMuted}`}>
            {search ? "No resources match your search" : "No resources yet"}
          </p>
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

                  {/* Owner actions */}
                  {isOwner && (
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(r)}
                        className="p-1.5 rounded-lg text-sky-400 hover:bg-sky-500/10 transition-colors">
                        <Pencil size={13}/>
                      </button>
                      <button onClick={() => setConfirmDel(r.resourceId)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={13}/>
                      </button>
                    </div>
                  )}
                </div>

                {/* File links */}
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

                {/* ── Rating panel ── */}
                <RatingPanel
                  resourceId={r.resourceId}
                  userId={userId}
                  t={t}
                  isDark={isDark}
                />
              </div>
            );
          })}
        </div>
      )}

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