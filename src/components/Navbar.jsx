import { useState } from "react";
import {
  Shirt,
  UserCircle2,
  Languages,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useLang } from "../context/useLang";

export function Navbar({
  onNavigate,
  onUserLogin,
  userProfile,
  onOpenProfileForm,
  onUserLogout,
}) {
  const { t, lang, setLang } = useLang();
  const [openUserMenu, setOpenUserMenu] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 text-white/80 backdrop-blur-sm bg-[#0b1530]/55 border-b border-white/10">
        <div className="relative max-w-7xl mx-auto flex justify-between items-center px-6 md:px-8 py-4 md:py-6">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onNavigate("landing")}
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

          {/* Center links */}
          <div className="hidden md:flex items-center gap-8 text-sm tracking-[0.18em] uppercase absolute left-1/2 -translate-x-1/2">
            <button
              onClick={() => onNavigate("landing")}
              className="cursor-pointer hover:text-cyan-300 transition"
            >
              {t("nav.home")}
            </button>
            <button
              onClick={() => {
                onNavigate("landing");
                setTimeout(
                  () =>
                    document
                      .getElementById("how-it-works")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  100,
                );
              }}
              className="cursor-pointer hover:text-cyan-300 transition"
            >
              {t("nav.howItWorks")}
            </button>
            <button
              onClick={() => {
                onNavigate("landing");
                setTimeout(
                  () =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" }),
                  100,
                );
              }}
              className="cursor-pointer hover:text-cyan-300 transition"
            >
              {t("nav.whyFitro")}
            </button>
          </div>

          {/* Header actions */}
          <div className="relative flex items-center gap-3 md:gap-4 text-xs uppercase tracking-[0.12em]">
            {!userProfile ? (
              <button
                onClick={onUserLogin}
                className="cursor-pointer inline-flex items-center gap-2 border border-white/20 rounded-full px-3.5 py-1.5 hover:border-cyan-400/60 hover:text-cyan-300 transition"
              >
                <UserCircle2 size={15} />
                <span>{t("login.loginBtn")}</span>
              </button>
            ) : (
              <button
                onClick={() => setOpenUserMenu((v) => !v)}
                className="cursor-pointer inline-flex items-center gap-2 border border-cyan-400/40 rounded-full px-3.5 py-1.5 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 transition normal-case tracking-normal"
              >
                <UserCircle2 size={16} />
                <span className="max-w-[110px] truncate">
                  {userProfile.name || userProfile.email}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    openUserMenu ? "rotate-180" : ""
                  }`}
                />
              </button>
            )}
            <button
              onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="cursor-pointer inline-flex items-center gap-2 border border-white/20 rounded-full px-3.5 py-1.5 hover:border-cyan-400/60 hover:text-cyan-300 transition normal-case tracking-normal"
            >
              <Languages size={15} />
              <span>{t("nav.langSwitch")}</span>
            </button>

            {userProfile && openUserMenu && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-[#0f1d3a] border border-white/15 rounded-2xl p-4 shadow-2xl text-white/80 normal-case tracking-normal z-[60]">
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-2">
                  {t("nav.userProfile")}
                </p>
                <div className="space-y-1.5 text-sm mb-3">
                  <p>
                    <span className="text-white/45">{t("nav.profileEmail")}:</span>{" "}
                    {userProfile.email || "-"}
                  </p>
                  <p>
                    <span className="text-white/45">{t("nav.profileName")}:</span>{" "}
                    {userProfile.name || "-"}
                  </p>
                  {userProfile.hasMeasurements ? (
                    <>
                      <p>
                        <span className="text-white/45">{t("nav.profileHeight")}:</span>{" "}
                        {userProfile.body?.height_cm || "-"} cm
                      </p>
                      <p>
                        <span className="text-white/45">{t("nav.profileWeight")}:</span>{" "}
                        {userProfile.body?.weight_kg || "-"} kg
                      </p>
                      <p>
                        <span className="text-white/45">
                          {t("nav.profileMeasurements")}:
                        </span>{" "}
                        {userProfile.body?.chest_cm || "-"} /{" "}
                        {userProfile.body?.waist_cm || "-"} /{" "}
                        {userProfile.body?.hips_cm || "-"}
                      </p>
                    </>
                  ) : (
                    <p className="text-amber-300 text-xs">{t("nav.noBodyData")}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {!userProfile.hasMeasurements && (
                    <button
                      onClick={() => {
                        setOpenUserMenu(false);
                        onOpenProfileForm?.();
                      }}
                      className="cursor-pointer flex-1 bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4] text-white text-xs font-bold rounded-full px-3 py-2"
                    >
                      {t("nav.fillUserData")}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setOpenUserMenu(false);
                      onUserLogout?.();
                    }}
                    className="cursor-pointer inline-flex items-center gap-1 border border-red-400/30 text-red-300 text-xs rounded-full px-3 py-2 hover:bg-red-500/10"
                  >
                    <LogOut size={12} /> {t("nav.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
