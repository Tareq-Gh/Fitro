import { useState } from 'react';
import { User, Ruler } from 'lucide-react';
import { submitUserInfo } from '../services/api';
import { calculateSizes } from '../utils/sizeCalculator';

const btnGradient = 'bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4]';

const fields = [
  { key: 'name', label: 'Full Name', type: 'text' },
  { key: 'height', label: 'Height (cm)', type: 'number' },
  { key: 'weight', label: 'Weight (kg)', type: 'number' },
  { key: 'shoulder', label: 'Shoulder (cm)', type: 'number' },
  { key: 'chest', label: 'Chest (cm)', type: 'number' },
  { key: 'waist', label: 'Waist (cm)', type: 'number' },
  { key: 'shoeSize', label: 'Shoe Size (EU)', type: 'number' },
  { key: 'skinTone', label: 'Skin Tone', type: 'text' },
];

export function UserInfoPage() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await submitUserInfo(form);
      setResult(calculateSizes(form));
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="bg-white rounded-[45px] shadow-2xl p-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-500 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Ruler className="text-white" size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Sizes</h2>
        <p className="text-gray-400 text-sm mb-8">Based on your measurements</p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Shirt', value: result.shirt },
            { label: 'Pants', value: result.pants },
            { label: 'Shoes', value: result.shoes },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
              <p className="text-2xl font-bold text-[#1e4e79]">{value}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => { setResult(null); setForm({}); }}
          className={`w-full py-3 rounded-full ${btnGradient} text-white font-bold`}
        >
          New Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[45px] shadow-2xl p-10 w-full max-w-[400px] animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-[#1e293b] rounded-full flex items-center justify-center mb-4 shadow-xl">
          <User className="text-white" size={30} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Measurements</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        {fields.map(({ key, label, type }) => (
          <div key={key} className="relative">
            <Ruler className="absolute left-4 top-3 text-gray-300" size={16} />
            <input
              type={type}
              placeholder={label}
              value={form[key] ?? ''}
              onChange={(e) => handleChange(key, e.target.value)}
              required={key === 'name' || key === 'height' || key === 'weight'}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        ))}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-4 py-3.5 rounded-full ${btnGradient} text-white font-bold shadow-lg hover:opacity-90 transition disabled:opacity-60`}
        >
          {loading ? 'Analyzing...' : 'Get My Size'}
        </button>
      </form>
    </div>
  );
}
