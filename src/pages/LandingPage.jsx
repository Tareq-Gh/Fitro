import { useEffect, useState } from "react";
import { Shirt, Ruler, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { useLang } from "../context/useLang";

const FEATURE_ICONS = [Ruler, Zap, ShieldCheck, TrendingUp];

function normalizeGender(val) {
  return val === "male" || val === "female" ? val : "";
}

export function LandingPage({ prefilledGender = "", onAnalyze }) {
  const { t } = useLang();
  const [pickedGender, setPickedGender] = useState(() =>
    normalizeGender(prefilledGender),
  );
  const [genderError, setGenderError] = useState("");

  useEffect(() => {
    if (normalizeGender(prefilledGender)) {
      setPickedGender(prefilledGender);
    }
  }, [prefilledGender]);

  function resolveEffectiveGender() {
    const stored = normalizeGender(prefilledGender);
    if (stored) return stored;
    return normalizeGender(pickedGender);
  }

  function validatedGenderOrNull() {
    const g = resolveEffectiveGender();
    if (!g) {
      setGenderError(t("landing.chooseGender"));
      return null;
    }
    setGenderError("");
    return g;
  }

  function startAnalyzeFlow() {
    const g = validatedGenderOrNull();
    if (!g) return;
    onAnalyze?.({ gender: g });
  }

  const categories = t("landing.categories");
  const steps = t("landing.steps");
  const features = t("landing.features");

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="text-center px-4 md:px-6 pt-8 pb-16 md:pb-20 animate-in slide-in-from-bottom duration-700">
        <div className="inline-flex items-center gap-2 border border-white/20 rounded-full py-1.5 px-5 bg-white/5 backdrop-blur-sm text-xs tracking-widest uppercase text-white/60 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          {t("landing.badge")}
        </div>

        <h1 className="text-4xl md:text-7xl font-light leading-[1.15] md:leading-[1.1] tracking-tight">
          {t("landing.heroTitle1")}{" "}
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t("landing.heroTitle2")}
          </span>
          <br />
          <span className="text-white/50">{t("landing.heroTitle3")}</span>
        </h1>

        <p className="mt-4 md:mt-6 text-white/50 text-sm md:text-lg max-w-md mx-auto leading-relaxed px-2">
          {t("landing.heroSub")}
        </p>

        <div className="flex flex-wrap gap-3 justify-center mt-8">
          {categories.map((item) => (
            <span
              key={item}
              className="px-5 py-1.5 border border-white/15 rounded-full text-[11px] uppercase tracking-widest text-white/60"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Comparison / Analyze card */}
        <div className="mt-14 bg-white rounded-[40px] p-8 md:p-12 flex flex-col items-center shadow-2xl mx-auto w-full max-w-md">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-cyan-400/15 rounded-2xl blur-xl" />
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8">
              <Shirt className="text-gray-300" size={64} strokeWidth={1} />
            </div>
          </div>
          <p className="text-gray-700 font-semibold text-sm mb-2 text-center">
            {t("landing.comparisonTitle")}
          </p>
          <p className="text-gray-400 text-xs text-center mb-4 px-2">
            {t("landing.comparisonSub")}
          </p>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold mb-2 w-full text-start">
            {t("landing.comparisonGenderLabel")}
          </p>
          <div className="flex gap-2 w-full mb-1">
            {["male", "female"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setPickedGender(g);
                  setGenderError("");
                }}
                className={`flex-1 py-2.5 rounded-full text-sm font-semibold border transition ${
                  resolveEffectiveGender() === g
                    ? "bg-[#1e4e79] text-white border-transparent"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-cyan-400"
                }`}
              >
                {g === "male" ? t("userInfo.male") : t("userInfo.female")}
              </button>
            ))}
          </div>
          {genderError ? (
            <p className="text-red-500 text-xs text-center mb-3 w-full">
              {genderError}
            </p>
          ) : (
            <p className="text-[10px] text-gray-400 text-center mb-3 min-h-[1rem]" />
          )}
          <button
            type="button"
            onClick={startAnalyzeFlow}
            className="w-full bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4] text-white font-bold py-3.5 rounded-full hover:opacity-95 transition-opacity"
          >
            {t("landing.ctaLabel")}
          </button>
          <div className="flex gap-2 mt-4 flex-wrap justify-center">
            {t("landing.ctaTags").map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="px-4 md:px-6 py-14 md:py-20 max-w-4xl mx-auto"
      >
        <p className="text-center text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">
          {t("landing.howTitle")}
        </p>
        <h2 className="text-center text-2xl md:text-4xl font-bold mb-10 md:mb-14">
          {t("landing.howSubtitle")}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map(({ num, title, desc }) => (
            <div
              key={num}
              className="bg-white/5 border border-white/10 rounded-[28px] p-7 hover:border-cyan-500/40 transition-all"
            >
              <span className="text-4xl font-black text-white/10">{num}</span>
              <h3 className="text-white font-semibold mt-3 mb-2">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="px-4 md:px-6 py-14 md:py-20 max-w-5xl mx-auto"
      >
        <p className="text-center text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">
          {t("landing.whyTitle")}
        </p>
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-14">
          {t("landing.whySubtitle")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(({ title, desc }, idx) => {
            const FeatureIcon = FEATURE_ICONS[idx];
            return (
              <div
                key={title}
                className="bg-white/5 border border-white/10 rounded-[28px] p-6 hover:border-cyan-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                  <FeatureIcon className="text-cyan-400" size={20} />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">
                  {title}
                </h3>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Band */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-[36px] p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {t("landing.ctaBandTitle")}
          </h2>
          <p className="text-white/50 text-sm mb-7">
            {t("landing.ctaBandSub")}
          </p>
          <button
            type="button"
            onClick={() => startAnalyzeFlow()}
            className="bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4] text-white font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform"
          >
            {t("landing.ctaBandBtn")}
          </button>
        </div>
      </section>
    </div>
  );
}
