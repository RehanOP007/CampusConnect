import {
  ArrowLeft, Users, BookOpen, Search, Trash2, FileText,
  X, ChevronLeft, ChevronRight, Plus, Link2, ExternalLink,
  Pencil, Loader2, AlertTriangle, CheckCircle,
} from "lucide-react";

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
export default function ResourceModal({ open, onClose, mode, form, setForm, onSave, saving, t }) {
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