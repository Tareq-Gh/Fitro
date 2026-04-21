import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { AdminPage } from "./pages/AdminPage";
import { LangProvider } from "./context/LangContext";
import { useLang } from "./context/useLang";
import { lookupByEmail, registerUser } from "./services/api";
import { Mail, User, X } from "lucide-react";
import { btnGradient } from "./constants";
import { LoadingDots } from "./components/LoadingDots";

function AnalyzeModal({ onClose, onDone }) {
  const { t } = useLang();
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("fitro_email") ?? "",
  );
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  function switchTab(next) {
    setTab(next);
    setError("");
    setNotFound(false);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setNotFound(false);
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError(t("userInfo.emailRequired"));
      return;
    }
    setLoading(true);
    try {
      const response = await lookupByEmail(trimmedEmail);
      const { data } = response;
      console.log("Login response:", { status: response.status, data });
      if (data.found) {
        const u = data.user;
        const bodyData = {
          name: u.name ?? "",
          gender: u.gender ?? "",
          height_cm: u.height?.toString() ?? "",
          weight_kg: u.weight?.toString() ?? "",
          chest_cm: u.chest?.toString() ?? "",
          waist_cm: u.waist?.toString() ?? "",
          hips_cm: u.hips?.toString() ?? "",
        };
        const hasMeasurements = !!(u.height && u.weight);
        onDone(hasMeasurements ? "mode" : "loginNoBody", {
          name: u.name,
          email: trimmedEmail,
          body: bodyData,
          hasMeasurements,
        });
      } else if (data.offline) {
        setError(t("userInfo.serverError"));
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(t("userInfo.serverError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !name.trim()) {
      setError(t("userInfo.fieldsRequired"));
      return;
    }
    if (!gender) {
      setError(t("userInfo.genderRequired"));
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser({
        email: trimmedEmail,
        name: name.trim(),
        gender,
      });
      console.log("Register response:", {
        status: response.status,
        data: response.data,
      });
      onDone("registered", { email: trimmedEmail, name, gender });
    } catch (err) {
      console.error("Register error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      if (err?.response?.status === 409) {
        setError(t("userInfo.emailTaken"));
      } else {
        setError(t("userInfo.serverError"));
      }
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
        className="relative bg-white rounded-[40px] shadow-2xl p-8 w-full max-w-[400px]"
        style={{ animation: "scale-in 0.25s ease both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-300 hover:text-gray-500 transition"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-12 h-12 bg-[#1e293b] rounded-full flex items-center justify-center mb-3">
            <Mail className="text-cyan-400" size={20} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-6">
          {["login", "register"].map((t_) => (
            <button
              key={t_}
              onClick={() => switchTab(t_)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${
                tab === t_
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab === t_ || t_ === "login"
                ? t_ === "login"
                  ? t("userInfo.loginTab")
                  : t("userInfo.registerTab")
                : t("userInfo.registerTab")}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-xs text-center mb-3 px-2">{error}</p>
        )}

        {/* Not Found Banner */}
        {notFound && tab === "login" && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 text-center">
            <p className="text-amber-700 text-xs mb-2">
              {t("userInfo.emailNotFound")}
            </p>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className="text-xs font-semibold text-cyan-600 hover:underline"
            >
              {t("userInfo.registerBtn")}
            </button>
          </div>
        )}

        {tab === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
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
              className={`w-full py-3.5 rounded-full ${btnGradient} text-white font-bold disabled:opacity-60`}
            >
              {loading ? <LoadingDots /> : t("userInfo.loginContinueBtn")}
            </button>
            <p className="text-center text-xs text-gray-400 mt-1">
              {t("userInfo.registerTab")}?{" "}
              <button
                type="button"
                onClick={() => switchTab("register")}
                className="text-cyan-500 hover:underline"
              >
                {t("userInfo.registerBtn")}
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-3 text-gray-300" size={16} />
              <input
                type="email"
                placeholder={t("userInfo.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-3 text-gray-300" size={16} />
              <input
                type="text"
                placeholder={t("userInfo.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
              />
            </div>
            <div className="flex gap-2">
              {["male", "female"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2.5 rounded-full text-sm font-semibold border transition ${
                    gender === g
                      ? "bg-[#1e4e79] text-white border-transparent"
                      : "bg-gray-50 text-gray-500 border-gray-200 hover:border-cyan-400"
                  }`}
                >
                  {g === "male"
                    ? t("userInfo.genderMale")
                    : t("userInfo.genderFemale")}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-full ${btnGradient} text-white font-bold disabled:opacity-60`}
            >
              {loading ? <LoadingDots /> : t("userInfo.registerBtn")}
            </button>
            <p className="text-center text-xs text-gray-400 mt-1">
              {t("userInfo.loginTab")}?{" "}
              <button
                type="button"
                onClick={() => switchTab("login")}
                className="text-cyan-500 hover:underline"
              >
                {t("userInfo.loginContinueBtn")}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const { dir, lang, t } = useLang();

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
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const raw = sessionStorage.getItem("fitro_profile");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [userNotice, setUserNotice] = useState("");

  // On mount: restore session from DB using stored email.
  useEffect(() => {
    const savedEmail = sessionStorage.getItem("fitro_email");
    if (!savedEmail) return;
    lookupByEmail(savedEmail)
      .then(({ data }) => {
        if (data.found) {
          const u = data.user;
          setUserProfile({
            email: savedEmail,
            name: u.name ?? "",
            body: {
              name: u.name ?? "",
              gender: u.gender ?? "",
              height_cm: u.height?.toString() ?? "",
              weight_kg: u.weight?.toString() ?? "",
              chest_cm: u.chest?.toString() ?? "",
              waist_cm: u.waist?.toString() ?? "",
              hips_cm: u.hips?.toString() ?? "",
            },
            hasMeasurements: !!(u.height && u.weight),
          });
        } else {
          // Email in session but no DB record — clear stale session key.
          sessionStorage.removeItem("fitro_email");
        }
      })
      .catch(() => {
        // API unreachable — keep cached sessionStorage profile, do nothing.
      });
  }, []);

  // Helper: keep sessionStorage in sync whenever profile changes.
  function applyProfile(profile) {
    if (profile) {
      sessionStorage.setItem("fitro_email", profile.email);
      sessionStorage.setItem("fitro_profile", JSON.stringify(profile));
    } else {
      sessionStorage.removeItem("fitro_email");
      sessionStorage.removeItem("fitro_profile");
    }
    setUserProfile(profile);
  }

  function openAnalyze() {
    if (userProfile?.hasMeasurements) {
      // already identified — skip modal, go straight to mode selection
      setUserInfoPhase("mode");
      setUserInfoWelcome({ name: userProfile.name || "User" });
      navigate("userInfo");
    } else if (userProfile && !userProfile.hasMeasurements) {
      setUserInfoPhase("body");
      setUserInfoWelcome(null);
      navigate("userInfo");
    } else {
      setShowModal(true);
    }
  }

  function openProfileForm() {
    setUserInfoPhase("body");
    setUserInfoWelcome(null);
    navigate("userInfo");
  }

  function handleModalDone(phase, payload) {
    setShowModal(false);
    if (phase === "mode" && payload) {
      // Returning user with saved measurements — go straight to mode selection.
      const p = {
        name: payload.name ?? "",
        email: payload.email ?? sessionStorage.getItem("fitro_email") ?? "",
        body: payload.body ?? {},
        hasMeasurements: true,
      };
      applyProfile(p);
      setUserInfoPhase("mode");
      setUserInfoWelcome({ name: payload.name ?? "User" });
      navigate("userInfo");
    } else if (phase === "loginNoBody" && payload) {
      // Logged in but no measurements yet — go to body form.
      applyProfile({
        name: payload.name ?? "",
        email: payload.email,
        body: payload.body ?? {},
        hasMeasurements: false,
      });
      setUserNotice(t("userInfo.welcomeBackNotice"));
      setTimeout(() => setUserNotice(""), 2600);
      setUserInfoPhase("body");
      setUserInfoWelcome(null);
      navigate("userInfo");
    } else if (phase === "registered" && payload) {
      // New account created — save email to session, go to body form.
      applyProfile({
        name: payload.name ?? "",
        email: payload.email,
        body: { name: payload.name ?? "", gender: payload.gender ?? "" },
        hasMeasurements: false,
      });
      setUserNotice(t("userInfo.accountCreatedNotice"));
      setTimeout(() => setUserNotice(""), 2600);
      setUserInfoPhase("body");
      setUserInfoWelcome(null);
      navigate("userInfo");
    } else {
      setUserInfoPhase(phase);
      setUserInfoWelcome(payload ?? null);
      navigate("userInfo");
    }
  }

  function handleUserLogout() {
    applyProfile(null);
    setUserNotice(t("userInfo.loggedOut"));
    setTimeout(() => setUserNotice(""), 1500);
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
        onUserLogin={() => setShowModal(true)}
        userProfile={userProfile}
        onOpenProfileForm={openProfileForm}
        onUserLogout={handleUserLogout}
      />
      {userNotice && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[55] bg-green-500/90 text-white text-sm px-4 py-2 rounded-full shadow-lg">
          {userNotice}
        </div>
      )}
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
            initialBody={userProfile?.body ?? {}}
            onProfileSaved={(profile) => {
              const p = {
                name: profile.name,
                email: profile.email,
                body: profile.body,
                hasMeasurements: true,
              };
              applyProfile(p);
              setUserNotice("Saved successfully");
              setTimeout(() => setUserNotice(""), 2000);
              navigate("landing");
            }}
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
