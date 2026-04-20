import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { AdminPage } from "./pages/AdminPage";
import { LangProvider } from "./context/LangContext";
import { useLang } from "./context/useLang";
import { lookupByEmail } from "./services/api";
import { Mail, X } from "lucide-react";

const btnGradient = "bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4]";

function AnalyzeModal({ onClose, onDone }) {
  const { t } = useLang();
  const [email, setEmail] = useState(
    () => localStorage.getItem("fitro_email") ?? "",
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await lookupByEmail(email);
      localStorage.setItem("fitro_email", email);
      if (data.found) {
        const u = data.user;
        localStorage.setItem(
          "fitro_body",
          JSON.stringify({
            name: u.name ?? "",
            gender: u.gender ?? "",
            height_cm: u.height?.toString() ?? "",
            weight_kg: u.weight?.toString() ?? "",
            chest_cm: u.chest?.toString() ?? "",
            waist_cm: u.waist?.toString() ?? "",
            hips_cm: u.hips?.toString() ?? "",
          }),
        );
        onDone("mode", { name: u.name });
      } else {
        onDone("body", null);
      }
    } catch {
      onDone("body", null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[400px]"
        style={{ animation: "scale-in 0.25s ease both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition"
        >
          <X size={18} />
        </button>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center mb-3">
            <Mail className="text-cyan-400" size={20} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("userInfo.emailGateTitle")}
          </h2>
          <p className="text-gray-400 text-xs mt-1 text-center px-4">
            {t("userInfo.emailGateSub")}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-300" size={16} />
            <input
              type="email"
              placeholder={t("userInfo.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-full ${btnGradient} text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60`}
          >
            {loading ? (
              <span className="flex gap-1.5">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </span>
            ) : (
              t("userInfo.emailGateBtn")
            )}
          </button>
        </form>
        <button
          onClick={() => {
            localStorage.removeItem("fitro_email");
            onDone("body", null);
          }}
          className="w-full mt-4 text-gray-400 text-xs hover:text-gray-600 transition text-center"
        >
          {t("userInfo.emailGateGuest")}
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const { dir, lang } = useLang();

  const getInitialPage = () => {
    if (window.location.pathname === "/admin") return "login";
    return "landing";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [token, setToken] = useState(
    () => localStorage.getItem("fitro_token") ?? "",
  );
  const [showModal, setShowModal] = useState(false);
  const [userInfoPhase, setUserInfoPhase] = useState("email");
  const [userInfoWelcome, setUserInfoWelcome] = useState(null);

  function openAnalyze() {
    setShowModal(true);
  }

  function handleModalDone(phase, welcome) {
    setShowModal(false);
    setUserInfoPhase(phase);
    setUserInfoWelcome(welcome);
    navigate("userInfo");
  }

  function navigate(page) {
    setCurrentPage(page);
    if (page === "admin" || page === "login") {
      window.history.pushState(null, "", "/admin");
    } else {
      window.history.pushState(null, "", "/");
    }
  }

  function handleLogin(newToken) {
    localStorage.setItem("fitro_token", newToken);
    setToken(newToken);
    navigate("admin");
  }

  function handleLogout() {
    localStorage.removeItem("fitro_token");
    setToken("");
    navigate("landing");
  }

  useEffect(() => {
    if (currentPage === "admin" && !token) {
      navigate("login");
    }
  }, [currentPage, token]);

  const isLanding = currentPage === "landing";

  return (
    <div
      dir={dir}
      className={`min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#16203a] to-[#2d3a5a] text-white flex flex-col relative overflow-hidden ${
        lang === "ar" ? "font-arabic" : "font-sans"
      }`}
    >
      <Navbar
        onNavigate={navigate}
        currentPage={currentPage}
        token={token}
        onLogout={handleLogout}
        onAnalyze={openAnalyze}
      />
      <div
        className={`flex-grow flex pt-20 ${
          isLanding ? "flex-col" : "items-center justify-center"
        }`}
      >
        {currentPage === "landing" && (
          <LandingPage onNavigate={navigate} onAnalyze={openAnalyze} />
        )}
        {currentPage === "login" && <LoginPage onLogin={handleLogin} />}
        {currentPage === "userInfo" && (
          <UserInfoPage
            initialPhase={userInfoPhase}
            initialWelcome={userInfoWelcome}
          />
        )}
        {currentPage === "admin" && token && <AdminPage token={token} />}
      </div>
      {isLanding && <Footer onNavigate={navigate} />}
      {showModal && (
        <AnalyzeModal
          onClose={() => setShowModal(false)}
          onDone={handleModalDone}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppContent />
    </LangProvider>
  );
}
