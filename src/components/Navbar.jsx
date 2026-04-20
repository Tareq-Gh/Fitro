import { useState } from "react";
import {
  Shirt,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useLang } from "../context/useLang";

export function Navbar({ onNavigate, currentPage, token, onLogout }) {
  const { t, lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);

  function nav(page) {
    setMenuOpen(false);
    onNavigate(page);
  }

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center px-6 md:px-8 py-4 md:py-6 text-white/80 z-50 backdrop-blur-sm">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => nav("landing")}
        >
          <Shirt
            className="text-cyan-400 group-hover:scale-110 transition-transform"
            size={20}
            strokeWidth={1.5}
          />
          <span className="font-bold tracking-widest text-lg md:text-xl">
            FITRO
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] items-center">
          <button
            onClick={() => nav("landing")}
            className={`hover:text-cyan-400 transition ${
              currentPage === "landing" ? "text-cyan-400" : ""
            }`}
          >
            {t("nav.home")}
          </button>
          <button
            onClick={() => {
              nav("landing");
              setTimeout(
                () =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" }),
                100,
              );
            }}
            className="hover:text-cyan-400 transition"
          >
            {t("nav.howItWorks")}
          </button>
          <button
            onClick={() => {
              nav("landing");
              setTimeout(
                () =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" }),
                100,
              );
            }}
            className="hover:text-cyan-400 transition"
          >
            {t("nav.features")}
          </button>
          <button
            onClick={() => nav("userInfo")}
            className={`hover:text-cyan-400 transition ${
              currentPage === "userInfo" ? "text-cyan-400" : ""
            }`}
          >
            {t("landing.ctaLabel")}
          </button>
          {token ? (
            <>
              <button
                onClick={() => nav("admin")}
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

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="text-white/60 border border-white/20 rounded-full px-2.5 py-1 text-xs font-bold"
          >
            {lang === "en" ? "ع" : "EN"}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="text-white/80 hover:text-white transition p-1"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 z-50 bg-[#0d1b2e] border-l border-white/10 flex flex-col pt-20 pb-8 px-6 transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-5 right-5 text-white/50 hover:text-white transition"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-1.5">
          <MobileNavItem
            label={t("nav.home")}
            active={currentPage === "landing"}
            onClick={() => nav("landing")}
          />
          <MobileNavItem
            label={t("nav.howItWorks")}
            onClick={() => {
              nav("landing");
              setTimeout(
                () =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" }),
                100,
              );
            }}
          />
          <MobileNavItem
            label={t("nav.features")}
            onClick={() => {
              nav("landing");
              setTimeout(
                () =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" }),
                100,
              );
            }}
          />
          <MobileNavItem
            label={t("landing.ctaLabel")}
            active={currentPage === "userInfo"}
            onClick={() => nav("userInfo")}
            highlight
          />
          {token ? (
            <>
              <MobileNavItem
                label={t("nav.dashboard")}
                active={currentPage === "admin"}
                onClick={() => nav("admin")}
                icon={<LayoutDashboard size={16} />}
              />
              <MobileNavItem
                label={t("nav.logout")}
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
                danger
                icon={<LogOut size={16} />}
              />
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

function MobileNavItem({ label, active, onClick, icon, highlight, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
        highlight
          ? "bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4] text-white"
          : danger
          ? "text-red-400 hover:bg-red-500/10"
          : active
          ? "bg-white/10 text-cyan-400"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      {!danger && !highlight && (
        <ChevronRight size={14} className="text-white/30" />
      )}
    </button>
  );
}
