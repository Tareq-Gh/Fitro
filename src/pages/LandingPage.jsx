import { Shirt, Ruler, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import { useLang } from "../context/useLang";

const FEATURE_ICONS = [Ruler, Zap, ShieldCheck, TrendingUp];

export function LandingPage({ onAnalyze }) {
  const { t } = useLang();

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

        {/* CTA Card */}
        <div
          onClick={onAnalyze}
          className="mt-14 bg-white rounded-[40px] p-10 md:p-14 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-all group shadow-2xl mx-auto w-fit"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 rounded-2xl blur-xl group-hover:bg-cyan-400/30 transition-all" />
            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 group-hover:border-cyan-400 transition-colors">
              <Shirt
                className="text-gray-300 group-hover:text-cyan-500 transition-colors"
                size={64}
                strokeWidth={1}
              />
            </div>
          </div>
          <p className="mt-5 text-gray-700 font-semibold text-sm">
            {t("landing.ctaLabel")}
          </p>
          <div className="flex gap-2 mt-3">
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
            onClick={onAnalyze}
            className="bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4] text-white font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform"
          >
            {t("landing.ctaBandBtn")}
          </button>
        </div>
      </section>
    </div>
  );
}
