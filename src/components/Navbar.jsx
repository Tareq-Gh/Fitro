import { Shirt, LayoutDashboard, LogOut } from "lucide-react";
import { useLang } from "../context/useLang";

export function Navbar({ onNavigate, currentPage, token, onLogout }) {
  const { t, lang, setLang } = useLang();

  return (
    <nav className="fixed top-0 w-full flex justify-between items-center px-8 py-6 text-white/80 z-50 backdrop-blur-sm">
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => onNavigate("landing")}
      >
        <Shirt
          className="text-cyan-400 group-hover:scale-110 transition-transform"
          size={22}
          strokeWidth={1.5}
        />
        <span className="font-bold tracking-widest text-xl">FITRO</span>
      </div>
      <div className="hidden md:flex gap-10 text-xs uppercase tracking-[0.2em] items-center">
        <button
          onClick={() => onNavigate("landing")}
          className={`hover:text-cyan-400 transition ${
            currentPage === "landing" ? "text-cyan-400" : ""
          }`}
        >
          {t("nav.home")}
        </button>
        {token ? (
          <>
            <button
              onClick={() => onNavigate("admin")}
              className={`flex items-center gap-1 hover:text-cyan-400 transition ${
                currentPage === "admin" ? "text-cyan-400" : ""
              }`}
            >
              <LayoutDashboard size={14} />
              {t("nav.dashboard")}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 hover:text-red-400 transition"
            >
              <LogOut size={14} />
              {t("nav.logout")}
            </button>
          </>
        ) : null}
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="hover:text-cyan-400 transition font-bold normal-case tracking-normal border border-white/20 rounded-full px-3 py-1 text-xs"
          title="Switch language"
        >
          {lang === "en" ? "ع" : "EN"}
        </button>
      </div>
    </nav>
  );
}
