import { Shirt } from "lucide-react";

const LINKS = {
  Product: ["Fit Analysis", "How It Works", "Size Guide"],
  Support: ["FAQ", "Contact", "Privacy Policy"],
};

export function Footer() {
  const year = new Date().getFullYear();

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
            Know your exact fit before you buy. No more returns, no more
            guessing.
          </p>
        </div>

        {/* Links */}
        {Object.entries(LINKS).map(([section, items]) => (
          <div key={section}>
            <h4 className="text-xs uppercase tracking-[0.25em] text-white/40 mb-4">
              {section}
            </h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}>
                  <span className="text-white/60 text-sm hover:text-cyan-400 transition-colors cursor-default">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-white/30 text-xs max-w-6xl mx-auto w-full">
        <span>© {year} FITRO. All rights reserved.</span>
        <span>Built with precision for perfect fit.</span>
      </div>
    </footer>
  );
}
