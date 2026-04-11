import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../contexts/ColorContext";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, ShieldCheck, ArrowRight } from "lucide-react";

export default function Verify() {
  const [params]   = useSearchParams();
  const navigate   = useNavigate();
  const { isDark } = useTheme();
  const theme      = isDark ? colors.dark : colors.light;

  // "loading" | "success" | "error"
  const [status,  setStatus]  = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("No verification token found. Please check your email link.");
      return;
    }

    axios
      .get(`http://localhost:8080/api/users/verify?token=${token}`)
      .then(() => {
        setStatus("success");
        setMessage("Your account has been verified successfully. You can now sign in.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ?? "This verification link is invalid or has expired."
        );
      });
  }, []);

  // ── Shared card wrapper ──────────────────────────────────────
  const Card = ({ children }) => (
    <div className={`min-h-screen ${theme.background} flex items-center justify-center px-4`}>
      <div className="w-full max-w-sm">
        {/* Top accent */}
        <div className={`h-1 w-full rounded-t-2xl bg-gradient-to-r ${theme.gradientPrimary}`}/>

        <div className={`${theme.cardBg} border ${theme.border} rounded-b-2xl shadow-2xl px-8 py-10 text-center`}>
          {/* Logo mark */}
          <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${theme.gradientPrimary} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <ShieldCheck size={26} className="text-white"/>
          </div>

          <p className={`text-xs font-black uppercase tracking-widest mb-6 ${theme.textSecondary}`}>
            CampusConnect · Account Verification
          </p>

          {children}
        </div>
      </div>
    </div>
  );

  // ── Loading ──────────────────────────────────────────────────
  if (status === "loading") return (
    <Card>
      <div className="flex flex-col items-center gap-4">
        <div className={`h-16 w-16 rounded-full border-4 border-[#5478FF]/20 flex items-center justify-center`}>
          <Loader2 size={30} className="text-[#5478FF] animate-spin"/>
        </div>
        <h2 className={`text-xl font-black ${theme.text}`}>Verifying your account</h2>
        <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>
          Please wait while we confirm your email address…
        </p>
        {/* Animated dots */}
        <div className="flex items-center gap-1.5 mt-1">
          {[0, 1, 2].map(i => (
            <div key={i}
              className="h-2 w-2 rounded-full bg-[#5478FF] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </Card>
  );

  // ── Success ──────────────────────────────────────────────────
  if (status === "success") return (
    <Card>
      <div className="flex flex-col items-center gap-4">
        {/* Animated check */}
        <div className="relative flex items-center justify-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center">
            <CheckCircle size={40} className="text-emerald-400"/>
          </div>
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400/20 animate-ping"/>
        </div>

        <div>
          <h2 className={`text-xl font-black mb-2 ${theme.text}`}>You're all set!</h2>
          <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{message}</p>
        </div>

        {/* Divider */}
        <div className={`w-full h-px my-1 ${isDark ? "bg-[#5478FF]/20" : "bg-gray-100"}`}/>

        {/* Sign in button */}
        <button
          onClick={() => navigate("/campusconnect/login", { replace: true })}
          className={`w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${theme.gradientPrimary} hover:opacity-90 transition-opacity shadow-md shadow-[#5478FF]/25 flex items-center justify-center gap-2`}
        >
          Continue to Sign In <ArrowRight size={15}/>
        </button>

        <p className={`text-[10px] ${theme.textSecondary} opacity-60`}>
          Redirecting you shortly…
        </p>
      </div>

      {/* Auto-redirect */}
      {/* <AutoRedirect onRedirect={() => navigate("/campusconnect/login", { replace: true })}/> */}
    </Card>
  );

  // ── Error ────────────────────────────────────────────────────
  return (
    <Card>
      <div className="flex flex-col items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-red-500/15 border-2 border-red-500/30 flex items-center justify-center">
          <XCircle size={40} className="text-red-400"/>
        </div>

        <div>
          <h2 className={`text-xl font-black mb-2 ${theme.text}`}>Verification Failed</h2>
          <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{message}</p>
        </div>

        <div className={`w-full h-px my-1 ${isDark ? "bg-[#5478FF]/20" : "bg-gray-100"}`}/>

        <div className="flex flex-col gap-2 w-full">
          {/* Retry — re-load the page with the same token */}
          <button
            onClick={() => window.location.reload()}
            className={`w-full py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r ${theme.gradientPrimary} hover:opacity-90 transition-opacity shadow-md shadow-[#5478FF]/25`}
          >
            Try Again
          </button>

          {/* Back to login */}
          <button
            onClick={() => navigate("/campusconnect/login")}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold border ${theme.border} ${theme.textSecondary} hover:opacity-80 transition-opacity`}
          >
            Back to Login
          </button>
        </div>

        <p className={`text-[10px] leading-relaxed ${theme.textSecondary} opacity-60`}>
          If this keeps happening, please contact support or request a new verification email.
        </p>
      </div>
    </Card>
  );
}

// ── Auto-redirect after success ──────────────────────────────────
function AutoRedirect({ onRedirect, delayMs = 4000 }) {
  useEffect(() => {
    const t = setTimeout(onRedirect, delayMs);
    return () => clearTimeout(t);
  }, []);
  return null;
}