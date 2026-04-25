import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { createFeedback, updateFeedback } from "../utils/C1api"; 

// Mapping for both directions (val <-> type)
const RATING_TO_TYPE = { 1: "NEGATIVE", 2: "NEGATIVE", 3: "NEUTRAL", 4: "POSITIVE", 5: "POSITIVE" };
const TYPE_TO_RATING = { "NEGATIVE": 2, "NEUTRAL": 3, "POSITIVE": 5 };

const EMOJIS = [
  { val: 1, emoji: "😢", title: "Very bad" },
  { val: 2, emoji: "😕", title: "Bad" },
  { val: 3, emoji: "😐", title: "Neutral" },
  { val: 4, emoji: "🙂", title: "Good" },
  { val: 5, emoji: "😄", title: "Great" },
];

const CATEGORIES = [
  { key: "Suggestion", label: "Suggestion" },
  { key: "Issue", label: "Something's not right" },
  { key: "Compliment", label: "Compliment" },
];

const MAX_CHARS = 500;

/**
 * Props:
 * existingFeedback {object} - Optional. If present, form enters "Update" mode.
 * sessionId {number}        - ID of the session.
 */
export default function FeedbackForm({ open, onClose, isDark, userId, sessionId, existingFeedback }) {
  const [rating, setRating] = useState(null);
  const [category, setCategory] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Logic to populate form for Create vs Update
  useEffect(() => {
    if (open) {
      if (existingFeedback) {
        // UPDATE MODE: Pre-fill data
        setRating(TYPE_TO_RATING[existingFeedback.feedbackType] || 3);
        setText(existingFeedback.message || "");
        // If your API doesn't return category, you might need to infer it or keep it null
        setCategory(existingFeedback.category || null); 
      } else {
        // CREATE MODE: Reset
        setRating(null);
        setCategory(null);
        setText("");
      }
      setError("");
      setSubmitted(false);
      setLoading(false);
    }
  }, [open, existingFeedback]);

  const handleSubmit = async () => {
    if (!rating) { setError("Please select a rating."); return; }
    if (!text.trim()) { setError("Please write your feedback."); return; }
    setError("");

    const payload = {
      feedbackType: RATING_TO_TYPE[rating],
      message: text.trim(),
      status: "ACTIVE",
      userId: userId,
      sessionId: sessionId,
      // category: category // Include if your backend supports a category field
    };

    try {
      setLoading(true);

      if (existingFeedback?.feedbackId) {
        // UPDATE
        await updateFeedback(existingFeedback.feedbackId, payload);
      } else {
        // CREATE
        await createFeedback(payload);
      }

      setSubmitted(true);
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // --- Theme UI styles (keeping your existing variables) ---
  const card = isDark ? "bg-[#111B3D] border-[#2B3E7A]" : "bg-white border-gray-200";
  const divider = isDark ? "border-[#2B3E7A]" : "border-gray-100";
  const txtPrim = isDark ? "text-white" : "text-gray-900";
  const txtSec = isDark ? "text-slate-300" : "text-gray-600";
  const inputBg = isDark ? "bg-[#0B1230] border-[#2B3E7A] text-white focus:border-[#5478FF]" : "bg-slate-50 border-gray-200 text-gray-900 focus:border-[#5478FF]";
  const catActive = "border-[#5478FF] bg-[#5478FF]/10 text-[#5478FF] font-semibold";
  const catBase = isDark ? "border-[#2B3E7A] bg-[#0B1230] text-slate-300" : "border-gray-200 bg-slate-50 text-gray-600";

  return (
    <>
      <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[80] flex items-start justify-center pt-8 px-4 pointer-events-none">
        <div className={`pointer-events-auto w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${card}`} onClick={(e) => e.stopPropagation()}>
          
          <div className={`flex items-center justify-between px-5 py-4 border-b ${divider}`}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5478FF]" />
              <p className={`font-bold text-sm ${txtPrim}`}>
                {existingFeedback ? "Update your feedback" : "Your feedback"}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white transition-colors"><X size={15} /></button>
          </div>

          {submitted ? (
            <div className="px-6 py-10 text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className={`font-bold text-base mb-1 ${txtPrim}`}>Success!</p>
              <p className={`text-sm ${txtSec}`}>Feedback has been {existingFeedback ? "updated" : "submitted"}.</p>
              <button onClick={onClose} className="mt-6 px-6 py-2.5 rounded-xl bg-[#5478FF] text-white text-sm font-semibold hover:bg-[#4060EE]">Close</button>
            </div>
          ) : (
            <div className="px-5 py-5 space-y-5">
              {/* Rating Section */}
              <div className="flex justify-center gap-3">
                {EMOJIS.map(({ val, emoji, title }) => (
                  <button
                    key={val}
                    onClick={() => setRating(val)}
                    className="transition-all duration-150"
                    style={{
                      fontSize: 28,
                      opacity: rating === val ? 1 : 0.4,
                      filter: rating === val ? "grayscale(0)" : "grayscale(0.8)",
                      transform: rating === val ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Category Section (Optional based on payload) */}
              <div>
                <p className={`text-xs font-semibold mb-2 ${txtSec}`}>Category</p>
                <div className="flex gap-2">
                  {CATEGORIES.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      className={`flex-1 py-2 text-xs rounded-xl border transition-all ${category === key ? catActive : catBase}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Section */}
              <textarea
                value={text}
                onChange={(e) => e.target.value.length <= MAX_CHARS && setText(e.target.value)}
                placeholder="Tell us what you think…"
                rows={4}
                className={`w-full p-3 border rounded-xl text-sm outline-none resize-none ${inputBg}`}
              />

              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

              <div className="flex gap-2.5">
                <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold ${isDark ? "border-[#2B3E7A] text-slate-300" : "border-gray-200 text-gray-600"}`}>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#5478FF] hover:bg-[#4060EE] text-white text-sm font-semibold disabled:opacity-50"
                >
                  {loading ? "Processing..." : existingFeedback ? "Update" : "Send"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}