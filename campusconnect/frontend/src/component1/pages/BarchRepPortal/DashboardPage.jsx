// DashboardPage.jsx
import { useState, useEffect } from "react";
import { useTheme }  from "../../../contexts/ThemeContext";
import { useAuth }   from "../../../contexts/AuthContext";
import { T, loadStudentData } from "./StudentData";
import { getResourcesBySubject } from "../../../component2/utils/C2api"; // TODO: confirm path
import {
  ArrowLeft, ArrowRight, Users, BookOpen, Search,
  Download, Upload, Trash2, FileText, X, ChevronLeft, ChevronRight,
} from "lucide-react";

/* ── Color dot for subject card ── */
const COLORS = [
  "from-[#5478FF] to-[#7C3AED]",
  "from-[#0EA5E9] to-[#6366F1]",
  "from-[#10B981] to-[#3B82F6]",
  "from-[#F59E0B] to-[#EF4444]",
  "from-[#EC4899] to-[#8B5CF6]",
  "from-[#14B8A6] to-[#06B6D4]",
];

/* ── Subject Card ── */
const SubjectCard = ({ subject, index, onClick, t }) => (
  <div
    onClick={onClick}
    className="rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-200 hover:shadow-2xl hover:shadow-black/30 group"
  >
    <div className={`h-28 relative bg-gradient-to-br ${COLORS[index % COLORS.length]}`}>
      {/* Geometric pattern */}
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

/* ── Resources Page ── */
function ResourcesPage({ subject, onBack, t, isDark }) {
  const [resources, setResources] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [showUpload,setShowUpload]= useState(false);
  const [uploadName,setUploadName]= useState("");
  const [myFiles,   setMyFiles]   = useState([]);

  useEffect(() => {
    getResourcesBySubject(subject.id)           // TODO: confirm API
      .then(res => setResources(res.data ?? []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, [subject.id]);

  const all = [...resources, ...myFiles].filter(f =>
    !search || f.title?.toLowerCase().includes(search.toLowerCase())
  );

  const handleFakeUpload = () => {
    if (!uploadName.trim()) return;
    setMyFiles(p => [...p, {
      id: Date.now(),
      title: uploadName,
      type: "pdf",
      uploadedBy: "student",
      date: new Date().toISOString().slice(0,10),
    }]);
    setUploadName(""); setShowUpload(false);
  };

  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      <button onClick={onBack}
        className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-green-400/40 text-green-400 bg-green-400/10 hover:bg-green-400/20 text-sm font-semibold transition-colors">
        <ArrowLeft size={15}/> Back to Subjects
      </button>

      {/* Subject header */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-5 mb-5 flex items-center gap-4`}>
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${subject.color ?? "from-[#5478FF] to-[#7C3AED]"} flex items-center justify-center text-white font-black text-sm shrink-0`}>
          {subject.code?.slice(-2)}
        </div>
        <div>
          <h2 className={`font-black text-lg ${t.textPrimary}`}>{subject.name}</h2>
          <p className={`text-sm ${t.textSecondary}`}>{subject.code} · {all.length} resources</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className={`flex items-center gap-2 border rounded-xl px-3 py-2 flex-1 min-w-[180px] max-w-xs`}
          style={{ background: isDark?"#0D1235":"white", borderColor: isDark?"rgba(84,120,255,0.3)":"#e5e7eb" }}>
          <Search size={13} className={t.textMuted}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search resources…"
            className="bg-transparent text-sm focus:outline-none flex-1" style={{ color: isDark?"white":"#374151" }}/>
        </div>
        <button onClick={()=>setShowUpload(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#5478FF] text-white rounded-xl text-sm font-bold hover:bg-[#4060ee] transition-colors">
          <Upload size={13}/> Upload PDF
        </button>
      </div>

      {/* Resource list */}
      {loading ? (
        <div className={`text-center py-16 text-sm ${t.textMuted}`}>Loading resources…</div>
      ) : all.length === 0 ? (
        <div className={`text-center py-16 text-sm ${t.textMuted}`}>No resources yet</div>
      ) : (
        <div className="space-y-2">
          {all.map(f => (
            <div key={f.id} className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-4 flex items-center gap-4 hover:border-[#5478FF]/40 transition-colors`}>
              <div className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <FileText size={17} className="text-red-400"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${t.textPrimary}`}>{f.title ?? f.name}</p>
                <p className={`text-xs ${t.textSecondary}`}>
                  {f.date ?? "—"} · {f.uploadedBy === "student" ? "My Upload" : "By Admin"}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={f.url ?? f.fileUrl ?? "#"} download
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#5478FF]/30 bg-[#5478FF]/10 text-[#53CBF3] text-xs font-bold hover:bg-[#5478FF]/20 transition-colors">
                  <Download size={12}/> PDF
                </a>
                {f.uploadedBy === "student" && (
                  <button onClick={()=>setMyFiles(p=>p.filter(x=>x.id!==f.id))}
                    className="p-1.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20">
                    <Trash2 size={13}/>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload modal */}
      {showUpload && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={()=>setShowUpload(false)}/>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className={`pointer-events-auto w-full max-w-sm ${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${t.divider}`}>
                <p className={`font-bold text-sm ${t.textPrimary}`}>Upload PDF Resource</p>
                <button onClick={()=>setShowUpload(false)} className={`p-1 rounded-lg ${t.modalClose}`}><X size={15}/></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                <label className={`block text-xs font-semibold mb-1 ${t.textSecondary}`}>Resource Name</label>
                <input value={uploadName} onChange={e=>setUploadName(e.target.value)}
                  placeholder="e.g. Week 3 Notes"
                  className={`w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]/30 ${t.inputBg}`}/>
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={()=>setShowUpload(false)} className={`px-4 py-2 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary}`}>Cancel</button>
                  <button onClick={handleFakeUpload} className="px-4 py-2 rounded-xl bg-[#5478FF] text-white text-sm font-semibold hover:bg-[#4060ee]">Upload</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Study Groups placeholder ── */
function StudyGroupsPage({ semester, onBack, t }) {
  return (
    <div className={`min-h-full ${t.pageBg} p-6`}>
      <button onClick={onBack}
        className="flex items-center gap-2 mb-5 px-3 py-1.5 rounded-xl border border-green-400/40 text-green-400 bg-green-400/10 hover:bg-green-400/20 text-sm font-semibold">
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

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function DashboardPage() {
  const { isDark } = useTheme();
  const { user }   = useAuth();
  const t          = T(isDark);

  const [semesters,   setSemesters]   = useState([]);
  const [semIndex,    setSemIndex]    = useState(0);   // index into semesters array
  const [loading,     setLoading]     = useState(true);
  const [subPage,     setSubPage]     = useState("main");   // "main"|"resources"|"studygroups"
  const [selectedSub, setSelectedSub] = useState(null);

  /* Load all data on mount */
  useEffect(() => {
    if (!user) return;
    loadStudentData(user)
      .then(({ semesters: sems, currentSemesterId }) => {
        setSemesters(sems);
        // Start at the current semester
        const idx = sems.findIndex(s => s.id === currentSemesterId);
        setSemIndex(idx >= 0 ? idx : 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const semester = semesters[semIndex];

  const goLeft  = () => setSemIndex(i => Math.max(0, i - 1));
  const goRight = () => setSemIndex(i => Math.min(semesters.length - 1, i + 1));

  /* Sub-pages */
  if (subPage === "studygroups")
    return <StudyGroupsPage semester={semester} onBack={() => setSubPage("main")} t={t}/>;
  if (subPage === "resources" && selectedSub)
    return <ResourcesPage subject={selectedSub} onBack={() => setSubPage("main")} t={t} isDark={isDark}/>;

  /* Loading state */
  if (loading) return (
    <div className={`min-h-full ${t.pageBg} flex items-center justify-center`}>
      <p className={`text-sm ${t.textMuted}`}>Loading your dashboard…</p>
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

        {/* Arrow navigation row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goLeft}
            disabled={semIndex === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-all
              ${semIndex === 0
                ? `opacity-30 cursor-not-allowed ${t.cardBorder} ${t.textMuted}`
                : `border-[#5478FF]/40 text-[#53CBF3] hover:bg-[#5478FF]/10`}`}
          >
            <ChevronLeft size={16}/>
            {semesters[semIndex - 1]
              ? <span className="hidden sm:inline text-xs">{semesters[semIndex - 1].label}</span>
              : <span className="hidden sm:inline text-xs">Previous</span>}
          </button>

          {/* Current semester label */}
          <div className="text-center flex-1 px-4">
            <div className="flex items-center justify-center gap-2">
              <h2 className={`font-black text-base ${t.textPrimary}`}>
                {semester?.label ?? "—"}
              </h2>
              {semester?.isCurrent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">
                  CURRENT
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${t.textSecondary}`}>
              {semIndex + 1} of {semesters.length} semesters · {semester?.subjects?.length ?? 0} subjects
            </p>
            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-1 mt-2">
              {semesters.map((_, i) => (
                <button key={i} onClick={() => setSemIndex(i)}
                  className={`rounded-full transition-all ${i === semIndex ? 'w-4 h-1.5 bg-[#5478FF]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={goRight}
            disabled={semIndex === semesters.length - 1}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-all
              ${semIndex === semesters.length - 1
                ? `opacity-30 cursor-not-allowed ${t.cardBorder} ${t.textMuted}`
                : `border-[#5478FF]/40 text-[#53CBF3] hover:bg-[#5478FF]/10`}`}
          >
            {semesters[semIndex + 1]
              ? <span className="hidden sm:inline text-xs">{semesters[semIndex + 1].label}</span>
              : <span className="hidden sm:inline text-xs">Next</span>}
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
          <div className={`text-center py-12 text-sm ${t.textMuted}`}>
            No subjects found for this semester
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {semester.subjects.map((sub, i) => (
              <SubjectCard
                key={sub.id}
                subject={sub}
                index={i}
                t={t}
                onClick={() => { setSelectedSub(sub); setSubPage("resources"); }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}