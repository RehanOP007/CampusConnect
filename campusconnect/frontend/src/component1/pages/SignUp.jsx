import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../contexts/ColorContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Loading from "../../components/Loading";
import NotificationBanner from "../../components/NotificationBanner";
import { createUser } from "../../component1/utils/C1api";
import {
  getFacultyByCampus,
  getProgramsByFaculty,
  getCurriculumByProgram,
  getBatchByCurriculum,
  getSemesterByBatch,
} from "../../component2/utils/C2api";

// ── Constants ────────────────────────────────────────────────────
const CAMPUS_ID = 1;
const CAMPUS_LABEL = "SLIIT Malabe";
const EMAIL_DOMAIN = "@my.sliit.lk";

const ROLES = [
  { id: 3, label: "Student" },
  { id: 2, label: "Batch Representative" },
];

// ── Helpers ──────────────────────────────────────────────────────
const spin = "h-3.5 w-3.5 rounded-full border-2 border-[#5478FF] border-t-transparent animate-spin";

const normalizeId = (id) => id?.toUpperCase().trim();

// ── Sub-components ───────────────────────────────────────────────
const FieldWrap = ({ label, required, error, children, colSpan }) => (
  <div className={colSpan === 2 ? "col-span-2" : ""}>
    <label className="block text-xs font-semibold mb-1.5 opacity-70">
      {label}{required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">
      <span>⚠</span>{error}
    </p>}
  </div>
);

const SectionDivider = ({ label, theme }) => (
  <div className="col-span-2 flex items-center gap-3 mt-3 mb-1">
    <p className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${theme.textSecondary}`}>{label}</p>
    <div className={`flex-1 h-px border-t ${theme.border}`}/>
  </div>
);

// ═══════════════════════════════════════════════════════════════════
export default function SignUp() {
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? colors.dark : colors.light;
  const navigate = useNavigate();

  // ── Form ───────────────────────────────────────────────────────
  const EMPTY = {
    firstName:"", lastName:"", studentId:"",
    email:"", username:"", password:"", confirmPassword:"",
    roleId:"", campusId: CAMPUS_ID,
    facultyId:"", programId:"", curriculumId:"", batchId:"", semesterId:"",
  };
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});

  // ── Cascade data ───────────────────────────────────────────────
  const [faculties,  setFaculties]  = useState([]);
  const [programs,   setPrograms]   = useState([]);
  const [curricula,  setCurricula]  = useState([]);
  const [batches,    setBatches]    = useState([]);
  const [semesters,  setSemesters]  = useState([]);

  // ── Cascade loading ────────────────────────────────────────────
  const [lFac, setLFac] = useState(false);
  const [lProg,setLProg]= useState(false);
  const [lCur, setLCur] = useState(false);
  const [lBat, setLBat] = useState(false);
  const [lSem, setLSem] = useState(false);

  // ── Submit ─────────────────────────────────────────────────────
  const [loading,      setLoading]      = useState(false);
  const [notification, setNotification] = useState({ show:false, type:"", message:"" });

  // ── Load faculties on mount ────────────────────────────────────
  useEffect(() => { loadFaculties(); }, []);

  const loadFaculties = async () => {
    setLFac(true);
    try { const r = await getFacultyByCampus(CAMPUS_ID); setFaculties(r?.data ?? []); }
    catch { setNotification({ show:true, type:"error", message:"Failed to load faculties." }); }
    finally { setLFac(false); }
  };

  const loadPrograms = async (facultyId) => {
    setLProg(true); setPrograms([]); setCurricula([]); setBatches([]); setSemesters([]);
    setForm(p => ({ ...p, programId:"", curriculumId:"", batchId:"", semesterId:"" }));
    try { const r = await getProgramsByFaculty(facultyId); setPrograms(r?.data ?? []); }
    catch { setNotification({ show:true, type:"error", message:"Failed to load programs." }); }
    finally { setLProg(false); }
  };

  const loadCurricula = async (programId) => {
    setLCur(true); setCurricula([]); setBatches([]); setSemesters([]);
    setForm(p => ({ ...p, curriculumId:"", batchId:"", semesterId:"" }));
    try { const r = await getCurriculumByProgram(programId); setCurricula(r?.data ?? []); }
    catch { setNotification({ show:true, type:"error", message:"Failed to load curricula." }); }
    finally { setLCur(false); }
  };

  const loadBatches = async (curriculumId) => {
    setLBat(true); setBatches([]); setSemesters([]);
    setForm(p => ({ ...p, batchId:"", semesterId:"" }));
    try { const r = await getBatchByCurriculum(curriculumId); setBatches(r?.data ?? []); }
    catch { setNotification({ show:true, type:"error", message:"Failed to load batches." }); }
    finally { setLBat(false); }
  };

  const loadSemesters = async (batchId) => {
    setLSem(true); setSemesters([]);
    setForm(p => ({ ...p, semesterId:"" }));
    try { const r = await getSemesterByBatch(batchId); setSemesters(r?.data ?? []); }
    catch { setNotification({ show:true, type:"error", message:"Failed to load semesters." }); }
    finally { setLSem(false); }
  };

  // ── Change handler ─────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    setErrors(p => ({ ...p, [name]:"" }));

    if (name === "facultyId"  && value) loadPrograms(value);
    if (name === "programId"  && value) loadCurricula(value);
    if (name === "curriculumId" && value) loadBatches(value);
    if (name === "batchId"    && value) loadSemesters(value);

    // Auto-fill email from studentId
    if (name === "studentId") {
      const upper = value.toUpperCase().trim();
      if (upper.length === 10) {
        setForm(p => ({ ...p, studentId: value, email: upper + EMAIL_DOMAIN }));
        setErrors(p => ({ ...p, email:"" }));
      } else {
        setForm(p => ({ ...p, studentId: value }));
      }
    }
  };

  // ── Validation ─────────────────────────────────────────────────
  const isBatchRep = Number(form.roleId) === 2;
  const isStudent  = Number(form.roleId) === 3;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";

    // Student ID — 10 chars, starts with 2 letters then 8 digits
    const sid = normalizeId(form.studentId);
    if (!sid) {
      e.studentId = "Student ID is required";
    } else if (sid.length !== 10) {
      e.studentId = "Student ID must be exactly 10 characters (e.g. IT21234567)";
    } else if (!/^[A-Z]{2}\d{8}$/.test(sid)) {
      e.studentId = "Format: 2 letters + 8 digits (e.g. IT21234567)";
    }

    // Email — must match campus domain AND student ID
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!form.email.toLowerCase().endsWith(EMAIL_DOMAIN)) {
      e.email = `Email must end with ${EMAIL_DOMAIN}`;
    } else if (sid && sid.length === 10) {
      const prefix = form.email.split("@")[0].toUpperCase();
      if (prefix !== sid) {
        e.email = `Email prefix must match your Student ID (${sid}${EMAIL_DOMAIN})`;
      }
    }

    if (!form.username.trim()) e.username = "Username is required";

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 6) {
      e.password = "Minimum 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (!form.roleId) e.roleId = "Select a role";

    // Faculty always required
    if (!form.facultyId) e.facultyId = "Select a faculty";

    if (isStudent) {
      // Students must fill everything
      if (!form.programId)    e.programId    = "Select a program";
      if (!form.curriculumId) e.curriculumId = "Select a curriculum";
      if (!form.batchId)      e.batchId      = "Select a batch";
      if (!form.semesterId)   e.semesterId   = "Select a semester";
    } else if (isBatchRep) {
      // Batch reps only need batch; rest optional
      if (!form.batchId) e.batchId = "Batch is required for Batch Representatives";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const formattedSemesters = semesters.map(s => ({
  ...s,
  label: `Year ${s.yearNumber} - Semester ${s.semesterNumber}`
}));

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setNotification({ show:false, type:"", message:"" });
    setLoading(true);
    try {
      await createUser({
        firstName:   form.firstName,
        lastName:    form.lastName,
        studentId:   normalizeId(form.studentId),
        email:       form.email.toLowerCase(),
        username:    form.username,
        password:    form.password,
        roleId:      Number(form.roleId),
        campusId:    CAMPUS_ID,
        facultyId:   form.facultyId   ? Number(form.facultyId)   : undefined,
        programId:   form.programId   ? Number(form.programId)   : undefined,
        curriculumId:form.curriculumId? Number(form.curriculumId): undefined,
        batchId:     form.batchId     ? Number(form.batchId)     : undefined,
        semesterId:  form.semesterId  ? Number(form.semesterId)  : undefined,
      });
      setLoading(false);
      setNotification({ show:true, type:"success", message:"Account created! Redirecting to login…" });
      setTimeout(() => navigate("/admin/login", { replace:true }), 1800);
    } catch (error) {
      setLoading(false);
      setNotification({
        show:true, type:"error",
        message: error?.response?.data?.error ?? "Sign up failed. Please try again.",
      });
    }
  };

  // ── Style helpers ──────────────────────────────────────────────
  const inp = (err) => `w-full p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-colors
    ${theme.inputBg} ${theme.text}
    ${err ? "border-red-400 focus:ring-red-400/40" : `${theme.border} focus:ring-[#5478FF]/40`}`;

  const sel = (err, disabled) => `${inp(err)} appearance-none
    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`;

  // ── Dropdown with spinner ──────────────────────────────────────
  const DD = ({ name, label, value, options, labelKey, valueKey, placeholder, loading: ld, disabled, required, error, colSpan }) => (
    <FieldWrap label={label} required={required} error={error} colSpan={colSpan}>
      <div className="relative">
        <select name={name} value={value} onChange={handleChange}
          disabled={disabled || ld} required={required}
          className={sel(!!error, disabled || ld)}>
          <option value="">{ld ? "Loading…" : (disabled ? `Select ${label.split(" ").slice(-1)[0].toLowerCase()} first` : placeholder)}</option>
          {options.map(o => <option key={o[valueKey]} value={o[valueKey]}>{o[labelKey]}</option>)}
        </select>
        {ld && <div className="absolute right-3 top-1/2 -translate-y-1/2"><div className={spin}/></div>}
      </div>
    </FieldWrap>
  );

  // ──────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${theme.background}`}>
      {loading && <Loading loading={loading} message="Creating your account…"/>}

      <NavBar isDark={isDark} toggleTheme={toggleTheme} activeSection={null} setActiveSection={() => {}}/>

      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
        <div className={`w-full max-w-2xl ${theme.cardBg} rounded-2xl shadow-lg border ${theme.border} overflow-hidden`}>

          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#5478FF] via-[#53CBF3] to-[#FFDE42]"/>

          <div className="p-8">
            {/* Title */}
            <div className="text-center mb-7">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5478FF] to-[#53CBF3] flex items-center justify-center mx-auto mb-3 shadow-md shadow-[#5478FF]/30">
                <span className="text-white font-black text-lg">Cc</span>
              </div>
              <h2 className={`text-2xl font-black ${theme.text}`}>Create Account</h2>
              <p className={`text-sm mt-1 ${theme.textSecondary}`}>Students &amp; Batch Representatives only</p>
            </div>
            {notification && <NotificationBanner
              show={notification.show} type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ show:false, type:"", message:"" })}
            />}
      

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4">

                {/* ── Personal ── */}
                <SectionDivider label="Personal Info" theme={theme}/>

                <FieldWrap label="First Name" required error={errors.firstName}>
                  <input name="firstName" type="text" placeholder="Rehan" value={form.firstName} onChange={handleChange} className={inp(!!errors.firstName)}/>
                </FieldWrap>

                <FieldWrap label="Last Name" required error={errors.lastName}>
                  <input name="lastName" type="text" placeholder="Peter" value={form.lastName} onChange={handleChange} className={inp(!!errors.lastName)}/>
                </FieldWrap>

                {/* Student ID — auto-fills email */}
                <FieldWrap label="Student ID" required error={errors.studentId}>
                  <input name="studentId" type="text" placeholder="IT21234567 (10 chars)" value={form.studentId}
                    onChange={handleChange} maxLength={10}
                    className={inp(!!errors.studentId)}/>
                  <p className={`text-[10px] mt-1 ${theme.textSecondary}`}>2 letters + 8 digits · auto-fills your email</p>
                </FieldWrap>

                {/* Email — auto-filled, editable */}
                <FieldWrap label="Email" required error={errors.email}>
                  <input name="email" type="email"
                    placeholder={`ITXXXXXXXX${EMAIL_DOMAIN}`}
                    value={form.email} onChange={handleChange}
                    className={inp(!!errors.email)}/>
                  <p className={`text-[10px] mt-1 ${theme.textSecondary}`}>Must be {EMAIL_DOMAIN}</p>
                </FieldWrap>

                {/* ── Account ── */}
                <SectionDivider label="Account" theme={theme}/>

                <FieldWrap label="Username" required error={errors.username}>
                  <input name="username" type="text" placeholder="rehan_p" value={form.username} onChange={handleChange} className={inp(!!errors.username)}/>
                </FieldWrap>

                {/* Role */}
                <FieldWrap label="Role" required error={errors.roleId}>
                  <div className="relative">
                    <select name="roleId" value={form.roleId} onChange={handleChange} required className={sel(!!errors.roleId, false)}>
                      <option value="">Select a role</option>
                      {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                    </select>
                  </div>
                </FieldWrap>

                <FieldWrap label="Password" required error={errors.password}>
                  <input name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} className={inp(!!errors.password)}/>
                </FieldWrap>

                <FieldWrap label="Confirm Password" required error={errors.confirmPassword}>
                  <input name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} className={inp(!!errors.confirmPassword)}/>
                </FieldWrap>

                {/* ── Academic ── */}
                <SectionDivider label="Academic" theme={theme}/>

                {/* Role-aware hint */}
                {form.roleId && (
                  <div className={`col-span-2 flex items-start gap-2.5 rounded-xl p-3 text-xs border
                    ${isBatchRep
                      ? isDark ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-800"
                      : isDark ? "bg-sky-500/10 border-sky-500/30 text-sky-300" : "bg-sky-50 border-sky-200 text-sky-800"
                    }`}>
                    <span className="shrink-0 mt-0.5">{isBatchRep ? "📋" : "🎓"}</span>
                    <p>
                      {isBatchRep
                        ? <><strong>Batch Rep:</strong> Faculty is required. Program, Curriculum, and Semester are optional but recommended.</>
                        : <><strong>Student:</strong> All academic fields are required.</>}
                    </p>
                  </div>
                )}

                {/* Campus — fixed */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5 opacity-70">Campus</label>
                  <div className={`w-full p-3 border rounded-xl text-sm flex items-center gap-2 opacity-60 ${theme.inputBg} ${theme.border}`}>
                    <span className="h-2 w-2 rounded-full bg-[#5478FF] shrink-0"/>
                    <span className={theme.text}>{CAMPUS_LABEL}</span>
                    <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${theme.border} ${theme.textSecondary}`}>Fixed</span>
                  </div>
                </div>

                {/* Faculty */}
                <DD name="facultyId" label="Faculty" required value={form.facultyId}
                  options={faculties} labelKey="facultyName" valueKey="facultyId"
                  placeholder="Select a faculty" loading={lFac} disabled={false} error={errors.facultyId}/>

                {/* Program — required for Students */}
                <DD name="programId" label={`Program${isStudent ? "" : " (optional)"}`}
                  required={isStudent} value={form.programId}
                  options={programs} labelKey="programName" valueKey="programId"
                  placeholder="Select a program" loading={lProg}
                  disabled={!form.facultyId} error={errors.programId}/>

                {/* Curriculum */}
                <DD name="curriculumId" label={`Curriculum${isStudent ? "" : " (optional)"}`}
                  required={isStudent} value={form.curriculumId}
                  options={curricula} labelKey="curriculumName" valueKey="curriculumId"
                  placeholder="Select curriculum" loading={lCur}
                  disabled={!form.programId} error={errors.curriculumId}/>

                {/* Batch — required for both */}
                <DD name="batchId" label="Batch" required value={form.batchId}
                  options={batches} labelKey="batchName" valueKey="batchId"
                  placeholder="Select a batch" loading={lBat}
                  disabled={isBatchRep ? !form.facultyId : !form.curriculumId}
                  error={errors.batchId}/>

                {/* Semester */}
                <DD
                  name="semesterId"
                  label={`Semester${isStudent ? "" : " (optional)"}`}
                  required={isStudent}
                  value={form.semesterId}
                  options={formattedSemesters}
                  labelKey="label"   // ✅ use custom label
                  valueKey="semesterId"
                  placeholder="Select a semester"
                  loading={lSem}
                  disabled={!form.batchId}
                  error={errors.semesterId}
                />
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className={`w-full mt-7 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${theme.gradientPrimary} hover:opacity-90 disabled:opacity-60 transition-opacity shadow-md shadow-[#5478FF]/25`}>
                Create Account
              </button>

              {/* Footer links */}
              <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
                <p className={`text-xs ${theme.textSecondary}`}>
                  Already have an account?{" "}
                  <button type="button" onClick={() => navigate("/admin/login")}
                    className={`font-bold underline underline-offset-2 ${theme.link}`}>
                    Sign in
                  </button>
                </p>
                {/* Complaint link — wired later */}
                <button type="button"
                  onClick={() => navigate("/complaint")}
                  className={`text-xs font-semibold underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity ${theme.link}`}>
                  Having issues? Report to admin →
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}