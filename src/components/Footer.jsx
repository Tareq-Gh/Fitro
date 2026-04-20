import { Shirt } from "lucide-react";
import { useLang } from "../context/useLang";

export function Footer({ onNavigate }) {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const LINK_SECTIONS = [
    {
      titleKey: "footer.product",
      links: [
        { key: "footer.fitAnalysis", action: () => onNavigate("userInfo") },
        {
          key: "footer.howItWorks",
          action: () =>
            document
              .getElementById("how-it-works")
              ?.scrollIntoView({ behavior: "smooth" }),
        },
        {
          key: "footer.sizeGuide",
          action: () =>
            document
              .getElementById("features")
              ?.scrollIntoView({ behavior: "smooth" }),
        },
      ],
    },
    {
      titleKey: "footer.support",
      links: [
        {
          key: "footer.faq",
          action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        {
          key: "footer.contact",
          action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
        {
          key: "footer.privacy",
          action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
        },
      ],
    },
  ];

  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shirt className="text-cyan-400" size={20} strokeWidth={1.5} />
            <span className="font-bold tracking-widest text-lg">FITRO</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed max-w-[220px]">
            {t("footer.tagline")}
          </p>
        </div>

        {/* Links */}
        {LINK_SECTIONS.map(({ titleKey, links }) => (
          <div key={titleKey}>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">
              {t(titleKey)}
            </h4>
            <ul className="space-y-2">
              {links.map(({ key, action }) => (
                <li key={key}>
                  <button
                    onClick={action}
                    className="text-white/60 text-sm hover:text-cyan-400 transition-colors bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t(key)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-white/30 text-xs max-w-6xl mx-auto w-full">
        <span>{t("footer.copyright").replace("{year}", year)}</span>
        <span>{t("footer.builtWith")}</span>
      </div>
    </footer>
  );
}
