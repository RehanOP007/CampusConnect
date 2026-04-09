// ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import { useTheme }    from "../../../contexts/ThemeContext";
import { useAuth }     from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { T }           from "./StudentData";
import { getUserById, updateUser } from "../../utils/C1api"; // TODO: confirm path
import {
  User, Mail, Phone, Calendar, GraduationCap, BookOpen,
  Pencil, Trash2, Key, Sun, Moon, ChevronDown, Save,
  X, Camera, LogOut, ShieldCheck, AlertTriangle,
} from "lucide-react";

export default function ProfilePage() {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout }        = useAuth();
  const navigate                = useNavigate();
  const t                       = T(isDark);
  const photoRef                = useRef(null);

  const [profile,    setProfile]    = useState(null);
  const [draft,      setDraft]      = useState(null);
  const [editing,    setEditing]    = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [photoSrc,   setPhotoSrc]   = useState(null);
  const [modal,      setModal]      = useState(null);
  const [passForm,   setPassForm]   = useState({ current:"", newPass:"", confirm:"" });
  const [toast,      setToast]      = useState(null);

  const inp = `w-full p-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]/30 ${t.inputBg}`;

  /* ── Load user from API ── */
  useEffect(() => {
    if (!user?.userId) return;
    getUserById(user.userId).then(res => {
      const u = res.data;
      const formatted = {
        firstName: u.firstName  ?? "",
        lastName:  u.lastName   ?? "",
        username:  u.username   ?? user.username,
        email:     u.email      ?? user.email,
        phone:     u.phone      ?? "",
        dob:       u.dob        ?? "",
        studentId: u.studentId  ?? user.userId,
        faculty:   u.facultyName  ?? "—",   // TODO: confirm field
        program:   u.programName  ?? "—",   // TODO: confirm field
        batch:     u.batchName    ?? "—",   // TODO: confirm field
      };
      setProfile(formatted);
      setDraft(formatted);
    }).catch(() => showToast("Failed to load profile", "error"));
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
    setSaving(true);
    try {
      await updateUser(user.userId, {   // TODO: confirm payload shape
        firstName: draft.firstName,
        lastName:  draft.lastName,
        phone:     draft.phone,
        dob:       draft.dob,
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
    if (passForm.newPass !== passForm.confirm) { showToast("Passwords do not match", "error"); return; }
    // TODO: call changePassword API
    showToast("Password changed successfully!");
    setModal(null); setPassForm({ current:"", newPass:"", confirm:"" });
  };

  if (!profile) return (
    <div className={`min-h-full ${t.pageBg} flex items-center justify-center`}>
      <p className={`text-sm ${t.textMuted}`}>Loading profile…</p>
    </div>
  );

  const initials = `${profile.firstName[0] ?? ""}${profile.lastName[0] ?? ""}`.toUpperCase() || "ST";

  return (
    <div className={`min-h-full ${t.pageBg} p-6 space-y-6`}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-sm font-semibold ${toast.type==="error"?"bg-red-500":"bg-green-500"}`}>
          {toast.msg}
          <button onClick={()=>setToast(null)}><X size={14}/></button>
        </div>
      )}

      {/* Profile card */}
      <div className={`${t.cardBg} rounded-2xl border ${t.cardBorder} overflow-hidden`}>
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#111FA2] via-[#5478FF] to-[#53CBF3] relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage:"repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)",
            backgroundSize:"16px 16px"
          }}/>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar row */}
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="relative group shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-white border-4 border-[#111640] shadow-xl flex items-center justify-center overflow-hidden">
                {photoSrc
                  ? <img src={photoSrc} alt="Profile" className="h-full w-full object-cover"/>
                  : <div className="h-full w-full bg-gradient-to-br from-[#5478FF] to-[#53CBF3] flex items-center justify-center text-white font-black text-2xl">{initials}</div>
                }
              </div>
              <button onClick={()=>photoRef.current?.click()}
                className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-center"><Camera size={18} className="mx-auto"/><span className="text-[9px] font-bold block mt-0.5">Change</span></div>
              </button>
              <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
            </div>
            <div className="pb-1 flex-1">
              <br></br>
              <br></br>
              <h2 className={`font-black text-lg ${t.textPrimary}`}>{profile.firstName} {profile.lastName}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs font-bold text-[#53CBF3] bg-[#5478FF]/10 px-2 py-0.5 rounded-full border border-[#5478FF]/30">@{profile.username}</span>
                <span className={`text-xs ${t.textSecondary}`}>{profile.studentId}</span>
              </div>
            </div>
            {!editing && (
              <div className="flex gap-2 pb-1">
                <button onClick={()=>{ setDraft({...profile}); setEditing(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[#5478FF]/40 text-[#53CBF3] rounded-xl text-xs font-bold hover:bg-[#5478FF]/10">
                  <Pencil size={12}/> Edit
                </button>
                <button onClick={()=>setModal("delete")}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold hover:bg-red-500/10">
                  <Trash2 size={12}/> Delete
                </button>
              </div>
            )}
          </div>

          {/* View mode */}
          {!editing && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { icon:Mail,          label:"Email",   val: profile.email   },
                { icon:Phone,         label:"Phone",   val: profile.phone   },
                { icon:Calendar,      label:"DOB",     val: profile.dob     },
                { icon:GraduationCap, label:"Faculty", val: profile.faculty },
                { icon:BookOpen,      label:"Program", val: profile.program },
                { icon:User,          label:"Batch",   val: profile.batch   },
              ].map(f => (
                <div key={f.label} className={`${t.innerBg} rounded-xl p-3 border ${t.innerBorder}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <f.icon size={12} className="text-[#53CBF3]"/>
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${t.textMuted}`}>{f.label}</p>
                  </div>
                  <p className={`text-sm font-semibold ${t.textPrimary}`}>{f.val || "—"}</p>
                </div>
              ))}
            </div>
          )}

          {/* Edit mode */}
          {editing && (
            <div className={`${t.innerBg} rounded-2xl border ${t.innerBorder} p-5`}>
              <p className={`text-xs font-black uppercase tracking-wider mb-4 flex items-center gap-1.5 ${t.textMuted}`}>
                <Pencil size={12}/> Editing Profile
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                {[
                  { label:"First Name", name:"firstName" },
                  { label:"Last Name",  name:"lastName"  },
                  { label:"Phone",      name:"phone"     },
                  { label:"Date of Birth", name:"dob", type:"date" },
                ].map(f => (
                  <div key={f.name}>
                    <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>{f.label}</label>
                    <input
                      type={f.type ?? "text"}
                      value={draft[f.name] ?? ""}
                      onChange={e => setDraft(p => ({ ...p, [f.name]: e.target.value }))}
                      className={inp}
                    />
                  </div>
                ))}
                {/* Read-only fields */}
                {[
                  { label:"Email (read-only)",   val: draft.email   },
                  { label:"Username (read-only)", val: draft.username },
                ].map(f => (
                  <div key={f.label}>
                    <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>{f.label}</label>
                    <input readOnly value={f.val} className={`${inp} opacity-50 cursor-not-allowed`}/>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2">
                <button onClick={()=>setEditing(false)} className={`px-4 py-2 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary}`}>Cancel</button>
                <button onClick={saveEdit} disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5478FF] text-white text-sm font-semibold hover:bg-[#4060ee] disabled:opacity-60">
                  <Save size={13}/>{saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon:Key,                  label:"Change Password", sub:"Update your current password",    onClick:()=>setModal("password"), color:"text-blue-400 bg-blue-500/10 border-blue-500/20"    },
          { icon:ShieldCheck,          label:"Set Password",    sub:"Add a password to your account",  onClick:()=>setModal("addpass"),  color:"text-purple-400 bg-purple-500/10 border-purple-500/20"},
          { icon:isDark ? Sun : Moon,  label:isDark?"Light Mode":"Dark Mode", sub:"Toggle theme",      onClick:toggleTheme,              color:"text-amber-400 bg-amber-500/10 border-amber-500/20"  },
          { icon:LogOut,               label:"Logout",          sub:"Sign out of the portal",          onClick:()=>{ logout(); navigate("/admin/login", { replace:true }); }, color:"text-red-400 bg-red-500/10 border-red-500/20" },
        ].map((a,i) => (
          <button key={i} onClick={a.onClick}
            className={`${t.cardBg} rounded-2xl border ${t.cardBorder} p-4 flex items-start gap-3 hover:border-[#5478FF]/40 hover:shadow-sm transition-all text-left group cursor-pointer`}>
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${a.color}`}>
              <a.icon size={16} className={a.color.split(" ")[0]}/>
            </div>
            <div>
              <p className={`text-sm font-semibold ${t.textPrimary}`}>{a.label}</p>
              <p className={`text-[10px] mt-0.5 ${t.textMuted}`}>{a.sub}</p>
            </div>
            <ChevronDown size={13} className={`${t.textMuted} ml-auto mt-0.5 -rotate-90`}/>
          </button>
        ))}
      </div>

      {/* Delete modal */}
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
                <p className={`text-sm mt-1 ${t.textSecondary}`}>This cannot be undone.</p>
              </div>
              <div className="px-6 pb-6 flex gap-3">
                <button onClick={()=>setModal(null)} className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary}`}>Cancel</button>
                <button onClick={()=>{ logout(); navigate("/admin/login",{replace:true}); }} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600">Delete</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Change password modal */}
      {(modal === "password" || modal === "addpass") && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={()=>setModal(null)}/>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className={`pointer-events-auto w-full max-w-sm ${t.cardBg} rounded-2xl border ${t.cardBorder} shadow-2xl`}>
              <div className={`flex items-center justify-between px-5 py-4 border-b ${t.divider}`}>
                <p className={`font-bold text-sm ${t.textPrimary}`}>{modal==="password" ? "Change Password" : "Set Password"}</p>
                <button onClick={()=>setModal(null)} className={`p-1 rounded-lg ${t.modalClose}`}><X size={15}/></button>
              </div>
              <div className="px-5 py-4 space-y-3">
                {(modal==="password"
                  ? [{label:"Current Password",name:"current"},{label:"New Password",name:"newPass"},{label:"Confirm",name:"confirm"}]
                  : [{label:"New Password",name:"newPass"},{label:"Confirm",name:"confirm"}]
                ).map(f => (
                  <div key={f.name}>
                    <label className={`block text-xs font-semibold mb-1.5 ${t.textSecondary}`}>{f.label}</label>
                    <input type="password" value={passForm[f.name]} onChange={e=>setPassForm(p=>({...p,[f.name]:e.target.value}))} className={inp} placeholder="••••••••"/>
                  </div>
                ))}
                <div className="flex justify-end gap-2 pt-1">
                  <button onClick={()=>setModal(null)} className={`px-4 py-2 rounded-xl border text-sm font-semibold ${t.cardBorder} ${t.textSecondary}`}>Cancel</button>
                  <button onClick={handleChangePass} className="px-4 py-2 rounded-xl bg-[#5478FF] text-white text-sm font-semibold hover:bg-[#4060ee]">
                    {modal==="password" ? "Change" : "Set Password"}
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