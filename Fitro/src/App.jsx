import React, { useState } from 'react';
import { 
  User, Lock, Shirt, Ruler, CheckCircle2, 
  Users, Activity, ShoppingBag, ArrowUpRight, Search, LayoutDashboard, LogOut 
} from 'lucide-react';

// --- المكونات الفرعية (لجعل الكود منظماً) ---

const Navbar = ({ onNavigate, currentPage }) => (
  <nav className="fixed top-0 w-full flex justify-between items-center p-8 text-white/80 z-50">
    <div className="font-bold tracking-widest text-2xl cursor-pointer" onClick={() => onNavigate('landing')}>FITRO</div>
    <div className="hidden md:flex gap-10 text-xs uppercase tracking-[0.2em] items-center">
      <button onClick={() => onNavigate('landing')} className={`hover:text-cyan-400 transition ${currentPage === 'landing' ? 'text-cyan-400' : ''}`}>Home</button>
      <button onClick={() => onNavigate('admin')} className={`hover:text-cyan-400 transition ${currentPage === 'admin' ? 'text-cyan-400' : ''}`}>Dashboard</button>
      <button onClick={() => onNavigate('login')} className={`hover:text-cyan-400 transition ${currentPage === 'login' ? 'text-cyan-400' : ''}`}>Login</button>
    </div>
  </nav>
);

// --- صفحة لوحة تحكم الأدمن ---
const AdminPage = () => {
  const usersData = [
    { id: 1, name: "أحمد محمد", height: "175", weight: "70", chest: "100", date: "2026-04-10" },
    { id: 2, name: "سارة خالد", height: "162", weight: "55", chest: "90", date: "2026-04-11" },
    { id: 3, name: "فهد العتيبي", height: "180", weight: "85", chest: "110", date: "2026-04-12" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-right">
        <div className="order-2 md:order-1 relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="بحث..." className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-cyan-500 transition" />
        </div>
        <div className="order-1 md:order-2">
          <h1 className="text-3xl font-bold text-white">لوحة الإدارة</h1>
          <p className="text-cyan-400 text-sm">إدارة مستخدمي FITRO</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'إجمالي المستخدمين', value: '1,284', icon: Users, color: 'text-blue-400' },
          { label: 'تحليلات اليوم', value: '+42', icon: Activity, color: 'text-cyan-400' },
          { label: 'متوسط الطول', value: '172 cm', icon: Ruler, color: 'text-purple-400' },
          { label: 'طلبات القياس', value: '856', icon: ShoppingBag, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[30px] border border-white/10 hover:border-cyan-500/50 transition-all">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
            <h3 className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-[35px] border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-5">اسم المستخدم</th>
                <th className="p-5">الطول</th>
                <th className="p-5">الوزن</th>
                <th className="p-5">التاريخ</th>
                <th className="p-5 text-center">الإجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usersData.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors text-sm">
                  <td className="p-5 font-medium">{user.name}</td>
                  <td className="p-5 text-gray-300">{user.height} cm</td>
                  <td className="p-5 text-gray-300">{user.weight} kg</td>
                  <td className="p-5 text-gray-400">{user.date}</td>
                  <td className="p-5 text-center">
                    <button className="text-cyan-400 hover:underline">التفاصيل</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const bgGradient = "bg-[#0f172a] bg-gradient-to-br from-[#0a0f1e] via-[#16203a] to-[#2d3a5a]";
  const btnGradient = "bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4]";

  return (
    <div className={`min-h-screen ${bgGradient} text-white flex flex-col relative overflow-hidden font-sans`}>
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* محتوى الصفحات */}
      <div className="flex-grow flex items-center justify-center pt-20">
        
        {/* 1. واجهة تسجيل الدخول */}
        {currentPage === 'login' && (
          <div className="bg-white rounded-[45px] shadow-2xl p-10 w-full max-w-[380px] animate-in fade-in zoom-in duration-500">
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Login</h2>
            <div className="space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input type="text" placeholder="Username" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-500 transition" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-500 transition" />
              </div>
              <div className="flex items-center gap-2 px-2 py-2">
                <CheckCircle2 size={18} className="text-cyan-600" />
                <span className="text-sm text-gray-600">Remember Me</span>
              </div>
              <button onClick={() => setCurrentPage('admin')} className={`w-full py-4 rounded-full ${btnGradient} text-white font-bold tracking-widest hover:scale-[1.02] active:scale-95 transition-all uppercase`}>
                LOG IN
              </button>
            </div>
          </div>
        )}

        {/* 2. الصفحة الرئيسية (Hero) */}
        {currentPage === 'landing' && (
          <div className="text-center px-6 animate-in slide-in-from-bottom duration-700">
            <h1 className="text-5xl md:text-6xl font-light leading-tight">
              Find Your <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">Perfect Fit</span>
              <br /> Before You Buy
            </h1>
            <div className="mt-8 border border-white/20 rounded-full py-2 px-6 inline-block bg-white/5 backdrop-blur-sm text-sm tracking-widest uppercase">
              Stop guessing your size
            </div>
            <div className="flex gap-4 justify-center mt-10">
              {['T-shirt', 'Shoes', 'pants'].map((item) => (
                <button key={item} className="px-6 py-2 border border-white/20 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-all">
                  {item}
                </button>
              ))}
            </div>
            {/* صندوق الرفع (Upload Box) */}
            <div 
              onClick={() => setCurrentPage('userInfo')}
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
        )}

        {/* 3. واجهة معلومات المستخدم */}
        {currentPage === 'userInfo' && (
          <div className="bg-white rounded-[45px] shadow-2xl p-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-500">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center mb-4 shadow-xl">
                <User className="text-white" size={30} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">User Info</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {['Height', 'Weight', 'Shoulder', 'Chest', 'Waist', 'Shoes size', 'Skin'].map((label) => (
                <div key={label} className="relative">
                  <Ruler className="absolute left-4 top-3 text-gray-300" size={16} />
                  <input type="text" placeholder={label} className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400" />
                </div>
              ))}
              <button onClick={() => setCurrentPage('landing')} className={`w-full mt-4 py-3.5 rounded-full ${btnGradient} text-white font-bold shadow-lg hover:opacity-90 transition`}>
                ADD INFO
              </button>
            </div>
          </div>
        )}

        {/* 4. واجهة الأدمن (تم دمجها هنا) */}
        {currentPage === 'admin' && <AdminPage />}

      </div>
    </div>
  );
}