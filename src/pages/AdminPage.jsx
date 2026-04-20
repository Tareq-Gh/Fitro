import { useState, useEffect } from 'react';
import { Users, Activity, Ruler, ShoppingBag, Search } from 'lucide-react';
import { getUsers } from '../services/api';
import { useLang } from '../context/useLang';

export function AdminPage({ token }) {
  const { t } = useLang();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers(token)
      .then(({ data }) => setUsers(data))
      .catch(() => setError(t('admin.loadError')))
      .finally(() => setLoading(false));
  }, [token, t]);

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const avgHeight = users.length
    ? Math.round(users.reduce((s, u) => s + u.height, 0) / users.length)
    : 0;

  const stats = [
    { label: t('admin.totalUsers'), value: users.length, icon: Users, color: 'text-blue-400' },
    {
      label: t('admin.todayAnalyses'),
      value: users.filter(
        (u) => new Date(u.createdAt).toDateString() === new Date().toDateString()
      ).length,
      icon: Activity,
      color: 'text-cyan-400',
    },
    { label: t('admin.avgHeight'), value: avgHeight ? `${avgHeight} cm` : '—', icon: Ruler, color: 'text-purple-400' },
    { label: t('admin.measurements'), value: users.length, icon: ShoppingBag, color: 'text-emerald-400' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-8 mt-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 text-right">
        <div className="order-2 md:order-1 relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={t('admin.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 outline-none focus:border-cyan-500 transition"
          />
        </div>
        <div className="order-1 md:order-2">
          <h1 className="text-3xl font-bold text-white">{t('admin.title')}</h1>
          <p className="text-cyan-400 text-sm">{t('admin.subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md p-6 rounded-[30px] border border-white/10 hover:border-cyan-500/50 transition-all">
            <stat.icon className={`w-6 h-6 ${stat.color} mb-4`} />
            <h3 className="text-gray-400 text-xs uppercase tracking-wider">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/5 backdrop-blur-md rounded-[35px] border border-white/10 overflow-hidden">
        {loading && (
          <p className="text-center text-gray-400 py-12">{t('admin.loading')}</p>
        )}
        {error && (
          <p className="text-center text-red-400 py-12">{error}</p>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                <tr>
                  <th className="p-5">{t('admin.colName')}</th>
                  <th className="p-5">{t('admin.colHeight')}</th>
                  <th className="p-5">{t('admin.colWeight')}</th>
                  <th className="p-5">{t('admin.colChest')}</th>
                  <th className="p-5">{t('admin.colDate')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">
                      {t('admin.noUsers')}
                    </td>
                  </tr>
                ) : (
                  filtered.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors text-sm">
                      <td className="p-5 font-medium">{user.name}</td>
                      <td className="p-5 text-gray-300">{user.height} cm</td>
                      <td className="p-5 text-gray-300">{user.weight} kg</td>
                      <td className="p-5 text-gray-300">{user.chest ?? '—'} cm</td>
                      <td className="p-5 text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
