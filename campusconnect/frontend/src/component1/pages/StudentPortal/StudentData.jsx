// studentData.js
import { getUserById }            from "../../utils/C1api";
import { getBatch, getSemesterByBatch, getSubjectsBySemester, getResourcesBySubject } from "../../../component2/utils/C2api";

export { getResourcesBySubject }; // re-export for ResourcesPage

// ── Theme tokens ─────────────────────────────────────────────────
export const T = (isDark) => ({
  // ── Page & cards
  pageBg:        isDark ? "bg-[#0A0F2C]"              : "bg-[#F0F4FF]",
  cardBg:        isDark ? "bg-[#111640]"              : "bg-white",
  cardBorder:    isDark ? "border-[#5478FF]/20"       : "border-gray-200",
  innerBg:       isDark ? "bg-[#0D1235]"              : "bg-gray-50",
  innerBorder:   isDark ? "border-[#5478FF]/15"       : "border-gray-100",
  rowHover:      isDark ? "hover:bg-[#5478FF]/10"     : "hover:bg-blue-50/40",
  divider:       isDark ? "border-[#5478FF]/15"       : "border-gray-100",

  // ── Text
  textPrimary:   isDark ? "text-white"                : "text-[#111FA2]",
  textSecondary: isDark ? "text-white/60"             : "text-gray-500",
  textMuted:     isDark ? "text-white/30"             : "text-gray-400",
  textAccent:    isDark ? "text-[#53CBF3]"            : "text-[#5478FF]",

  // ── Inputs
  inputBg:       isDark
    ? "bg-[#0D1235] border-[#5478FF]/40 text-white placeholder-white/30"
    : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400",
  selectBg:      isDark
    ? "bg-[#0D1235] border-[#5478FF]/40 text-white"
    : "bg-white border-gray-200 text-gray-700",

  // ── Modal
  modalBg:       isDark ? "bg-[#111640] border-[#5478FF]/20" : "bg-white border-gray-200",
  modalHeader:   isDark ? "border-[#5478FF]/15"       : "border-gray-100",
  modalClose:    isDark
    ? "text-[#53CBF3] hover:text-white hover:bg-white/10"
    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100",

  // ── Sidebar
  sidebarBg:     isDark ? "bg-[#0D1235]"              : "bg-white",
  sidebarBorder: isDark ? "border-[#5478FF]/20"       : "border-gray-200",
  sidebarGroup:  isDark ? "text-white/25"             : "text-gray-400",
  sidebarItem:   isDark
    ? "text-white/60 hover:text-white hover:bg-[#5478FF]/15"
    : "text-gray-600 hover:text-[#111FA2] hover:bg-[#5478FF]/8",
  sidebarActive: isDark
    ? "bg-[#5478FF]/20 text-[#53CBF3] font-semibold"
    : "bg-[#5478FF]/10 text-[#111FA2] font-semibold",

  // ── Header
  headerBg:      isDark ? "bg-[#0D1235]/95"           : "bg-white/95",
  headerBorder:  isDark ? "border-[#5478FF]/20"       : "border-gray-200",
});

// ── Subject colors ────────────────────────────────────────────────
export const SUBJECT_COLORS = [
  "from-[#5478FF] to-[#7C3AED]",
  "from-[#0EA5E9] to-[#6366F1]",
  "from-[#10B981] to-[#3B82F6]",
  "from-[#F59E0B] to-[#EF4444]",
  "from-[#EC4899] to-[#8B5CF6]",
  "from-[#14B8A6] to-[#06B6D4]",
  "from-[#F97316] to-[#EAB308]",
  "from-[#6366F1] to-[#EC4899]",
];

// ── Helper: safely read a field trying multiple possible names ────
const pick = (obj, ...keys) => {
  for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null) return obj[k];
  return null;
};

// ── Main data loader ──────────────────────────────────────────────
export const loadStudentData = async (user) => {
  const { userId, batchId, semesterId } = user;

  // 1. User profile
  const userRes     = await getUserById(userId);
  const u           = userRes.data;

  // 2. Batch info
  const batchRes    = await getBatch(batchId);
  const batch       = batchRes.data;

  if (import.meta.env.DEV) {
    console.log("[StudentData] raw user:", u);
    console.log("[StudentData] raw batch:", batch);
  }

  // 3. All semesters for this batch
  const semRes       = await getSemesterByBatch(batchId);
  const rawSemesters = semRes.data ?? [];

  if (import.meta.env.DEV) {
    console.log("[StudentData] raw semesters:", rawSemesters);
    console.log("[StudentData] first semester:", rawSemesters[0]);
  }

  // 4. Normalize each semester
  const semesters = await Promise.all(
    rawSemesters.map(async (sem, idx) => {
      const id = pick(sem, "semesterId", "id", "semester_id");

      const year = pick(sem,
        "yearNumber", "year", "yearNo", "year_number", "academicYear"
      ) ?? idx + 1;

      const number = pick(sem,
        "semesterNumber", "semester", "semNo", "semesterNo",
        "semester_number", "semNum"
      ) ?? (idx + 1);

      const rawLabel = pick(sem, "semesterName", "name", "label", "title");
      const label    = rawLabel ?? `Year ${year} · Semester ${number}`;

      const statusVal = pick(sem, "status", "isActive", "active", "isCurrent", "current");
      const isActive  =
        statusVal === true     ||
        statusVal === "ACTIVE" ||
        statusVal === "active" ||
        id === semesterId;

      let subjects = [];
      try {
        const subRes = await getSubjectsBySemester(id);
        subjects = (subRes.data ?? []).map((sub, i) => ({
          id:      sub.subjectId,
          name:    sub.subjectName,
          code:    sub.subjectCode,
          credits: sub.credits ?? 0,
          color:   SUBJECT_COLORS[i % SUBJECT_COLORS.length],
        }));
      } catch (e) {
        console.warn(`[StudentData] failed to load subjects for semester ${id}`, e);
      }

      return { id, year, number, label, isCurrent: isActive, subjects };
    })
  );

  semesters.sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.number - b.number
  );

  // 5. User profile
  const userProfile = {
    firstName: pick(u, "firstName", "first_name", "fname") ?? "",
    lastName:  pick(u, "lastName",  "last_name",  "lname") ?? "",
    username:  pick(u, "username",  "userName")            ?? user.username,
    email:     pick(u, "email")                            ?? user.email,
    phone:     pick(u, "phone", "phoneNumber", "mobile")   ?? "",
    dob:       pick(u, "dob", "dateOfBirth", "birthDate")  ?? "",
    studentId: pick(u, "studentId", "student_id")          ?? userId,
    faculty:   pick(u, "facultyName",  "faculty",  "facultyId")  ?? user.facultyId ?? "—",
    program:   pick(u, "programName",  "program",  "programId")  ?? user.programId ?? "—",
    batch:     pick(batch, "batchName", "name", "batch", "batchId") ?? batchId,
  };

  return { userProfile, semesters, currentSemesterId: semesterId };
};