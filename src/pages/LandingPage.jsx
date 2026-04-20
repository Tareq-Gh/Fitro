import { Shirt } from 'lucide-react';

export function LandingPage({ onNavigate }) {
  return (
    <div className="text-center px-6 animate-in slide-in-from-bottom duration-700">
      <h1 className="text-5xl md:text-6xl font-light leading-tight">
        Find Your{' '}
        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
          Perfect Fit
        </span>
        <br /> Before You Buy
      </h1>
      <div className="mt-8 border border-white/20 rounded-full py-2 px-6 inline-block bg-white/5 backdrop-blur-sm text-sm tracking-widest uppercase">
        Stop guessing your size
      </div>
      <div className="flex gap-4 justify-center mt-10">
        {['T-shirt', 'Shoes', 'Pants'].map((item) => (
          <button
            key={item}
            className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-all"
          >
            {item}
          </button>
        ))}
      </div>
      <div
        onClick={() => onNavigate('userInfo')}
        className="mt-16 bg-white rounded-[40px] p-12 flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-all group shadow-2xl mx-auto w-fit"
      >
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 group-hover:border-cyan-400 transition-colors">
          <Shirt className="text-gray-300 group-hover:text-cyan-500" size={60} strokeWidth={1} />
        </div>
        <div className="flex gap-3 mt-6 text-gray-500 font-bold text-[10px] uppercase">
          <span className="bg-gray-100 px-4 py-1.5 rounded-full">AI Analysis</span>
          <span className="bg-gray-100 px-4 py-1.5 rounded-full">Secure</span>
        </div>
      </div>
    </div>
  );
}
