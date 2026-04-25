import { useState, useEffect } from "react";
import { useTheme }  from "../../../contexts/ThemeContext";
import { useAuth }   from "../../../contexts/AuthContext";
import { T, loadStudentData } from "./StudentData";
import ResourcesPage from "../../../component2/pages/StudentResourcesPage";
import StudyGroups from "../../../component3/pages/StudyGroups";
import {
  getResourcesBySubject,
  createResource,
  updateResource,
  deleteResource,
} from "../../../component2/utils/C2api";
import {
  ArrowLeft, Users, BookOpen, Search, Trash2, FileText,
  X, ChevronLeft, ChevronRight, Plus, Link2, ExternalLink,
  Pencil, Loader2, AlertTriangle, CheckCircle,Star
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

// Add this import at the top of DashboardPage.jsx
import { getRatingsByEntity, createOrUpdateRating, deleteRating } from "../../../component2/utils/C2api";

// ── Star Display (inline, small) ──
const StarRow = ({ ratings }) => {
  if (!ratings?.length) return (
    <p className="text-[9px] text-gray-500 mt-1">No ratings</p>
  );
  const avg = ratings.reduce((a, r) => a + r.ratingValue, 0) / ratings.length;
  return (
    <div className="flex items-center gap-1 mt-1">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={9}
          className={s <= Math.round(avg) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}/>
      ))}
      <span className="text-[9px] text-yellow-400 font-bold">{avg.toFixed(1)}</span>
      <span className="text-[9px] text-gray-500">({ratings.length})</span>
    </div>
  );
};

// ── Updated SubjectCard ──
const SubjectCard = ({ subject, index, onClick, t, userId }) => {
  const [ratings,   setRatings]   = useState([]);
  const [showRate,  setShowRate]  = useState(false);
  const [ratingVal, setRatingVal] = useState(0);
  const [submitting,setSubmitting]= useState(false);

  const myRating = ratings.find(r => r.userId === userId);

  useEffect(() => {
    getRatingsByEntity("SUBJECT", subject.id)
      .then(res => setRatings(res?.data ?? []))
      .catch(() => {});
  }, [subject.id]);

  useEffect(() => {
    if (myRating) setRatingVal(myRating.ratingValue);
  }, [myRating]);

  const handleRate = async (val) => {
    setRatingVal(val);
    setSubmitting(true);
    try {
      await createOrUpdateRating({
        userId, entityType: "SUBJECT", entityId: subject.id,
        ratingValue: val, comment: "",
      });
      const res = await getRatingsByEntity("SUBJECT", subject.id);
      setRatings(res?.data ?? []);
      setShowRate(false);
    } catch { /* silent */ }
    finally { setSubmitting(false); }
  };

  const handleDeleteRating = async (e) => {
    e.stopPropagation();
    if (!myRating) return;
    try {
      await deleteRating(myRating.ratingId);
      const res = await getRatingsByEntity("SUBJECT", subject.id);
      setRatings(res?.data ?? []);
      setShowRate(false);
      setRatingVal(0);
    } catch { /* silent */ }
  };

  return (
    <div className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-200 hover:shadow-2xl hover:shadow-black/30">
      {/* Banner — clickable to open resources */}
      <div onClick={onClick}
        className={`h-28 relative bg-gradient-to-br ${COLORS[index % COLORS.length]}`}>
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
        {/* Rate button on banner */}
        <button
          onClick={e => { e.stopPropagation(); setShowRate(p => !p); }}
          className={`absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold transition-all
            ${myRating
              ? "bg-yellow-400/90 text-gray-900"
              : "bg-black/30 text-white hover:bg-black/50"}`}>
          <Star size={10} className={myRating ? "fill-gray-900" : ""}/>
          {myRating ? myRating.ratingValue : "Rate"}
        </button>
      </div>

      {/* Card body */}
      <div className={`px-4 pt-3 pb-2 border border-t-0 rounded-b-2xl ${t.cardBg} ${t.cardBorder}`}>
        <p onClick={onClick} className={`font-black text-sm truncate ${t.textPrimary}`}>{subject.name}</p>
        <p className={`text-xs mt-0.5 ${t.textSecondary}`}>{subject.code}</p>
        <StarRow ratings={ratings}/>

        {/* Inline star picker */}
        {showRate && (
          <div className={`mt-2 pt-2 border-t ${t.divider}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => handleRate(s)} disabled={submitting}
                  className="transition-transform hover:scale-125">
                  <Star size={16}
                    className={s <= ratingVal ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}/>
                </button>
              ))}
              {submitting && <span className="text-[10px] text-gray-500 ml-1">Saving…</span>}
            </div>
            {myRating && (
              <button onClick={handleDeleteRating}
                className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1">
                <Trash2 size={10}/> Remove my rating
              </button>
            )}
          </div>
        )}
      </div>
    </div>
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


// ─── Study groups placeholder ─────────────────────────────────────


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
    return <StudyGroups onBack={() => setSubPage("main")} semesterId={semester?.id} />;

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
            <SubjectCard
              key={sub.id}
              subject={sub}
              index={i}
              t={t}
              userId={userId}              // ← add this
              onClick={() => { setSelectedSub(sub); setSubPage("resources"); }}
            />
          ))}
          </div>
        )}
      </div>
    </div>
  );
}