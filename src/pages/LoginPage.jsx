import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "../services/api";
import { useLang } from "../context/useLang";
import { btnGradient } from "../constants";

export function LoginPage({ onLogin }) {
  const { t } = useLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await login(username, password);
      onLogin(data.token);
    } catch {
      setError(t("login.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="bg-white rounded-[45px] shadow-2xl p-10 w-full max-w-[380px]"
      style={{ animation: "scale-in 0.35s ease both" }}
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        {t("login.title")}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type="text"
            placeholder={t("login.username")}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            type={showPass ? "text" : "password"}
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-12 pr-12 py-3.5 bg-gray-100 rounded-full text-gray-800 outline-none focus:ring-2 focus:ring-cyan-500 transition"
          />
          <button
            type="button"
            onClick={() => setShowPass((v) => !v)}
            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
            tabIndex={-1}
          >
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-full ${btnGradient} text-white font-bold tracking-widest hover:scale-[1.02] active:scale-95 transition-all uppercase disabled:opacity-60`}
        >
          {loading ? t("login.loggingIn") : t("login.loginBtn")}
        </button>
      </form>
    </div>
  );
}
