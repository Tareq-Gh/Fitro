import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { UserInfoPage } from "./pages/UserInfoPage";
import { AdminPage } from "./pages/AdminPage";
import { LangProvider } from "./context/LangContext"
import { useLang } from "./context/useLang";

function AppContent() {
  const { dir, lang } = useLang();
  const [currentPage, setCurrentPage] = useState("landing");
  const [token, setToken] = useState(
    () => localStorage.getItem("fitro_token") ?? "",
  );

  function handleLogin(newToken) {
    localStorage.setItem("fitro_token", newToken);
    setToken(newToken);
    setCurrentPage("admin");
  }

  function handleLogout() {
    localStorage.removeItem("fitro_token");
    setToken("");
    setCurrentPage("landing");
  }

  useEffect(() => {
    if (currentPage === "admin" && !token) {
      setCurrentPage("login");
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
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        token={token}
        onLogout={handleLogout}
      />
      <div
        className={`flex-grow flex pt-20 ${
          isLanding ? "flex-col" : "items-center justify-center"
        }`}
      >
        {currentPage === "landing" && (
          <LandingPage onNavigate={setCurrentPage} />
        )}
        {currentPage === "login" && <LoginPage onLogin={handleLogin} />}
        {currentPage === "userInfo" && <UserInfoPage />}
        {currentPage === "admin" && token && <AdminPage token={token} />}
      </div>
      {isLanding && <Footer onNavigate={setCurrentPage} />}
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
