import { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { colors } from "../../contexts/ColorContext";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { getDefaultRoute } from "../../utils/getDefaultRoutes";
import Loading from "../../components/Loading";
import NotificationBanner from "../../components/NotificationBanner";

// ── Role IDs ─────────────────────────────────────────────────────
const ROLE_BATCH_REP = 2;

export default function Login() {
  const { isDark, toggleTheme } = useTheme();
  const theme = isDark ? colors.dark : colors.light;

  const navigate    = useNavigate();
  const { login, logout } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [notification, setNotification] = useState({ show: false, type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ show: false, type: "", message: "" });
    setLoading(true);

    try {
      const user = await login(username, password);

      // ── Block pending Batch Rep ──
      if (user?.role === "BATCHREP" && user?.status === "PENDING_APPROVAL") {
        setLoading(false);
        setNotification({
          show: true,
          type: "error",
          message: "Your Batch Representative request is still pending. Please wait for an admin to approve.",
        });
        // Delay logout so the notification renders before any state wipe
        setTimeout(() => logout(), 100);
        return;
      }

      // ── Success: show briefly then navigate ──
      setLoading(false);
      setNotification({
          show: true,
          type: "success",
          message: "Login successful!",
        });
      const route = user?.role ? getDefaultRoute(user.role) : "/";
      setTimeout(() => navigate(route, { replace: true }), 800);

    } catch (error) {
      console.error(error);
      setLoading(false);
      setNotification({
        show: true,
        type: "error",
        message: error?.response?.data?.message ?? "Login failed. Please check your credentials.",
      });
    }
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>

      {loading && <Loading loading={loading} message="Loading..."/>}

      <NavBar
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeSection={null}
        setActiveSection={() => {}}
      />

      <div className="flex items-center justify-center min-h-screen pt-16">
        
        <form
          onSubmit={handleSubmit}
          className={`${theme.cardBg} p-8 rounded-2xl shadow-md w-80 border ${theme.border}`}
        >
          <NotificationBanner
            show={notification.show}
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ show: false, type: "", message: "" })}
          />
          <h2 className={`text-2xl font-bold mb-1 text-center ${theme.text}`}>
            Welcome back
          </h2>
          <p className={`text-sm text-center mb-6 ${theme.textSecondary}`}>
            Sign in to your account
          </p>

          <div className="mb-4">
            <label className={`block text-xs font-medium mb-1.5 ${theme.textSecondary}`}>
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]
                ${theme.inputBg} ${theme.border} ${theme.text}`}
            />
          </div>

          <div className="mb-6">
            <label className={`block text-xs font-medium mb-1.5 ${theme.textSecondary}`}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full p-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5478FF]
                ${theme.inputBg} ${theme.border} ${theme.text}`}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-gradient-to-r ${theme.gradientPrimary} text-white py-3 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-opacity`}
          >
            Login
          </button>

          <p className={`text-xs text-center mt-4 ${theme.textSecondary}`}>
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/campusconnect/signup")}
              className={`font-semibold underline ${theme.link}`}
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}