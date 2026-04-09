import { useState, useEffect, useRef } from "react";
import { useTheme }    from "../../../contexts/ThemeContext";
import { useAuth }     from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { T }           from "./StudentData";
import { getUserById, updateUser } from "../../utils/C1api";
import {
  User, Mail, Hash, Calendar, Building2, BookOpen,
  Pencil, Trash2, Key, Sun, Moon, ChevronDown, Save,
  X, Camera, LogOut, ShieldCheck, AlertTriangle,
  Layers, GraduationCap, CheckCircle,
} from "lucide-react";

// ─── Status pill ────────────────────────────────────────────────
const StatusPill = ({ status }) => (
  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border
    ${status === "ACTIVE"
      ? "bg-emerald-100 text-emerald-700 border-emerald-300"
      : "bg-red-100 text-red-700 border-red-300"}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${status === "ACTIVE" ? "bg-emerald-500" : "bg-red-400"}`}/>
    {status}
  </span>
);

// ─── Info tile ───────────────────────────────────────────────────
const InfoTile = ({ icon: Icon, label, value, accent = "text-[#53CBF3]", t }) => (
  <div className={`${t.innerBg} rounded-xl p-3 border ${t.innerBorder}`}>
    <div className="flex items-center gap-1.5 mb-1">
      <Icon size={12} className={accent}/>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>{label}</p>
    </div>
    <p className={`text-sm font-semibold ${t.textPrimary}`}>{value || "—"}</p>
  </div>
);

export default function ProfilePage() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();
  const t                       = T(isDark);
  const photoRef                = useRef(null);

  const [profile,  setProfile]  = useState(null);
  const [draft,    setDraft]    = useState(null);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [photoSrc, setPhotoSrc] = useState(null);
  const [modal,    setModal]    = useState(null);
  const [passForm, setPassForm] = useState({ current:"", newPass:"", confirm:"" });
  const [toast,    setToast]    = useState(null);

  const inp = `w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]/30 ${t.inputBg}`;

  // ── Load profile ──────────────────────────────────────────────
  useEffect(() => {
    if (!user?.userId) return;
    getUserById(user.userId)
      .then(res => {
        const u = res.data;
        const formatted = {
          // Identity
          userId:     u.userId,
          firstName:  u.firstName  ?? "",
          lastName:   u.lastName   ?? "",
          username:   u.username   ?? "",
          studentId:  u.studentId  ?? "",
          email:      u.email      ?? "",
          status:     u.status     ?? "ACTIVE",
          // IDs — shown as-is since API returns no names
          roleId:     u.roleId     ?? "",
          batchId:    u.batchId    ?? "",
          campusId:   u.campusId   ?? "",
          programId:  u.programId  ?? "",
          facultyId:  u.facultyId  ?? "",
          semesterId: u.semesterId ?? "",
          // Timestamps
          createdAt:  u.createdAt  ?? "",
        };
        setProfile(formatted);
        setDraft(formatted);
      })
      .catch(() => showToast("Failed to load profile", "error"));
  }, [user]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhotoSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const saveEdit = async () => {
    if (!draft.firstName.trim() || !draft.lastName.trim()) {
      showToast("First and last name are required", "error");
      return;
    }
    setSaving(true);
    try {
      await updateUser(user.userId, {
        firstName: draft.firstName,
        lastName:  draft.lastName,
      });
      setProfile({ ...draft });
      setEditing(false);
      showToast("Profile updated successfully!");
    } catch {
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePass = () => {
    if (!passForm.newPass) { showToast("New password is required", "error"); return; }
    if (passForm.newPass.length < 6) { showToast("Password must be at least 6 characters", "error"); return; }
    if (passForm.newPass !== passForm.confirm) { showToast("Passwords do not match", "error"); return; }
    // TODO: call changePassword API
    showToast("Password changed successfully!");
    setModal(null);
    setPassForm({ current:"", newPass:"", confirm:"" });
  };

  if (!profile) return (
    <div className={`min-h-full ${t.pageBg} flex items-center justify-center`}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-[#5478FF] border-t-transparent animate-spin"/>
        <p className={`text-sm ${t.textMuted}`}>Loading profile…</p>
      </div>
    </div>
  );

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase() || "ST";
  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" })
    : "—";

  return (
    <div className={`min-h-full ${t.pageBg} p-6 space-y-6`}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold
          ${toast.type === "error" ? "bg-red-500" : "bg-emerald-600"}`}>
          {toast.type === "error" ? <AlertTriangle size={15}/> : <CheckCircle size={15}/>}
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={13}/></button>
        </div>
      )}

      {/* ── Profile card ── */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} overflow-hidden`}>
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#111FA2] via-[#5478FF] to-[#53CBF3] relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
            backgroundSize:"16px 16px",
          }}/>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar + name row */}
          <div className="flex items-end gap-4 -mt-10 mb-6">
            {/* Avatar */}
            <div className="relative group shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-white border-4 border-[#111640] shadow-xl flex items-center justify-center overflow-hidden">
                {photoSrc
                  ? <img src={photoSrc} alt="Profile" className="h-full w-full object-cover"/>
                  : <div className="h-full w-full bg-gradient-to-br from-[#5478FF] to-[#53CBF3] flex items-center justify-center text-white font-black text-2xl">{initials}</div>
                }
              </div>
              <button onClick={() => photoRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center"><Camera size={18} className="mx-auto"/><span className="text-[9px] font-bold block mt-0.5">Change</span></div>
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
            </div>

            {/* Name block */}
            <div className="flex-1 pb-1 pt-12">
              <h2 className={`font-black text-lg leading-tight ${t.textPrimary}`}>
                {profile.firstName} {profile.lastName}
              </h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs font-bold text-[#53CBF3] bg-[#5478FF]/10 px-2.5 py-0.5 rounded-full border border-[#5478FF]/30">
                  @{profile.username}
                </span>
                <span className={`text-xs font-mono ${t.textSecondary}`}>{profile.studentId}</span>
                <StatusPill status={profile.status}/>
              </div>
              <p className={`text-[10px] mt-1 ${t.textMuted}`}>Member since {joinedDate}</p>
            </div>

            {/* Edit / Delete buttons */}
            {!editing && (
              <div className="flex gap-2 pb-1 shrink-0">
                <button onClick={() => { setDraft({ ...profile }); setEditing(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#5478FF]/40 text-[#53CBF3] rounded-xl text-xs font-bold hover:bg-[#5478FF]/10 transition-colors">
                  <Pencil size={12}/> Edit
                </button>
                <button onClick={() => setModal("delete")}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/10 transition-colors">
                  <Trash2 size={12}/> Delete
                </button>
              </div>
            )}
          </div>

          {/* ── View mode ── */}
          {!editing && (
            <div className="space-y-4">
              {/* Personal */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${t.textMuted}`}>Personal</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoTile icon={Mail}  label="Email"      value={profile.email}     t={t}/>
                  <InfoTile icon={Hash}  label="Student ID" value={profile.studentId} t={t} accent="text-purple-400"/>
                  <InfoTile icon={User}  label="Username"   value={`@${profile.username}`} t={t} accent="text-amber-400"/>
                </div>
              </div>

              {/* Academic IDs */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${t.textMuted}`}>Academic</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { icon:Building2,    label:"Campus",   value:`Campus #${profile.campusId}`,   accent:"text-sky-400"    },
                    { icon:GraduationCap,label:"Faculty",  value:`Faculty #${profile.facultyId}`,  accent:"text-amber-400"  },
                    { icon:BookOpen,     label:"Program",  value:`Program #${profile.programId}`,  accent:"text-purple-400" },
                    { icon:Layers,       label:"Batch",    value:`Batch #${profile.batchId}`,      accent:"text-teal-400"   },
                    { icon:Calendar,     label:"Semester", value:`Semester #${profile.semesterId}`,accent:"text-[#53CBF3]"  },
                  ].map(f => <InfoTile key={f.label} icon={f.icon} label={f.label} value={f.value} accent={f.accent} t={t}/>)}
                </div>
              </div>

              {/* System */}
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${t.textMuted}`}>System</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <InfoTile icon={Hash}  label="User ID"  value={`#${profile.userId}`}  t={t} accent="text-slate-400"/>
                  <InfoTile icon={ShieldCheck} label="Role ID" value={`Role #${profile.roleId}`} t={t} accent="text-indigo-400"/>
                  <InfoTile icon={Calendar} label="Joined" value={joinedDate} t={t} accent="text-emerald-400"/>
                </div>
              </div>
            </div>
          )}

          {/* ── Edit mode — only editable fields ── */}
          {editing && (
            <div className={`${t.innerBg} rounded-2xl border ${t.innerBorder} p-5`}>
              <p className={`text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-1.5 ${t.textMuted}`}>
                <Pencil size={12}/> Editing Profile
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {/* Editable */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>First Name <span className="text-red-400">*</span></label>
                  <input value={draft.firstName} onChange={e => setDraft(p => ({ ...p, firstName: e.target.value }))} className={inp} placeholder="Rehan"/>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>Last Name <span className="text-red-400">*</span></label>
                  <input value={draft.lastName} onChange={e => setDraft(p => ({ ...p, lastName: e.target.value }))} className={inp} placeholder="Peter"/>
                </div>

                {/* Read-only */}
                {[
                  { label:"Email (read-only)",      val: draft.email      },
                  { label:"Username (read-only)",   val: draft.username   },
                  { label:"Student ID (read-only)", val: draft.studentId  },
                  { label:"Status (read-only)",     val: draft.status     },
                ].map(f => (
                  <div key={f.label}>
                    <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>{f.label}</label>
                    <input readOnly value={f.val} className={`${inp} opacity-50 cursor-not-allowed`}/>
                  </div>
                ))}
              </div>

              <p className={`text-[10px] ${t.textMuted} mb-4`}>
                Only your name can be updated. Contact an admin to change other details.
              </p>

              <div className="flex items-center justify-end gap-2">
                <button onClick={() => setEditing(false)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary} hover:opacity-80`}>
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5478FF] text-white text-sm font-semibold hover:bg-[#4060ee] disabled:opacity-60 transition-colors">
                  <Save size={13}/>{saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick actions ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon:Key,                 label:"Change Password", sub:"Update your password",        onClick:()=>setModal("password"), color:"text-blue-400 bg-blue-500/10 border-blue-500/20"      },
          { icon:ShieldCheck,         label:"Set Password",    sub:"Add a new password",          onClick:()=>setModal("addpass"),  color:"text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { icon:isDark ? Sun : Moon, label:isDark?"Light Mode":"Dark Mode", sub:"Toggle theme",  onClick:toggleTheme,              color:"text-amber-400 bg-amber-500/10 border-amber-500/20"    },
          { icon:LogOut,              label:"Logout",          sub:"Sign out of the portal",      onClick:()=>{ logout(); navigate("/admin/login",{replace:true}); }, color:"text-red-400 bg-red-500/10 border-red-500/20" },
        ].map((a, i) => (
          <button key={i} onClick={a.onClick}
            className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-4 flex items-start gap-3 hover:border-[#5478FF]/40 hover:shadow-sm transition-all text-left`}>
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${a.color}`}>
              <a.icon size={16} className={a.color.split(" ")[0]}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${t.textPrimary}`}>{a.label}</p>
              <p className={`text-[10px] mt-0.5 ${t.textMuted}`}>{a.sub}</p>
            </div>
            <ChevronDown size={13} className={`${t.textMuted} shrink-0 mt-0.5 -rotate-90`}/>
          </button>
        ))}
      </div>

      {/* ── Delete modal ── */}
      {modal === "delete" && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"/>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className={`w-full max-w-sm ${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl`}>
              <div className="px-6 pt-6 pb-4 text-center">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={22} className="text-red-400"/>
                </div>
                <h3 className={`font-bold text-base ${t.textPrimary}`}>Delete Account?</h3>
                <p className={`text-sm mt-1 ${t.textSecondary}`}>This will permanently remove your account and cannot be undone.</p>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={() => setModal(null)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary} hover:opacity-80`}>Cancel</button>
                <button onClick={() => { logout(); navigate("/admin/login",{replace:true}); }}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Password modal ── */}
      {(modal === "password" || modal === "addpass") && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setModal(null)}/>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className={`pointer-events-auto w-full max-w-sm ${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${t.divider}`}>
                <p className={`font-bold text-sm ${t.textPrimary}`}>{modal === "password" ? "Change Password" : "Set Password"}</p>
                <button onClick={() => setModal(null)} className={`p-1 rounded-lg ${t.modalClose}`}><X size={15}/></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                {(modal === "password"
                  ? [{ label:"Current Password", name:"current" }, { label:"New Password", name:"newPass" }, { label:"Confirm New Password", name:"confirm" }]
                  : [{ label:"New Password", name:"newPass" }, { label:"Confirm Password", name:"confirm" }]
                ).map(f => (
                  <div key={f.name}>
                    <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>{f.label}</label>
                    <input type="password" value={passForm[f.name]}
                      onChange={e => setPassForm(p => ({ ...p, [f.name]: e.target.value }))}
                      className={inp} placeholder="••••••••"/>
                  </div>
                ))}
                <p className={`text-[10px] ${t.textMuted}`}>Minimum 6 characters required.</p>
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={() => setModal(null)} className={`px-4 py-2 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary} hover:opacity-80`}>Cancel</button>
                  <button onClick={handleChangePass} className="px-4 py-2 rounded-xl bg-[#5478FF] text-white text-sm font-semibold hover:bg-[#4060ee] transition-colors">
                    {modal === "password" ? "Update Password" : "Set Password"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}