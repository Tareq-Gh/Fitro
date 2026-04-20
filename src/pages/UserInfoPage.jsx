import { useState } from "react";
import {
  User,
  Ruler,
  Shirt,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronLeft,
  Mail,
  FileText,
  Sparkles,
} from "lucide-react";
import { submitUserInfo, lookupByEmail } from "../services/api";
import { analyzeFit } from "../utils/fitAnalyzer";
import { useLang } from "../context/useLang";

const btnGradient = "bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4]";

const parseNum = (v) => (v !== undefined && v !== "" ? Number(v) : undefined);

const FIT_COLORS = {
  Tight: {
    badge: "bg-red-100 text-red-700",
    icon: AlertTriangle,
    iconColor: "text-red-500",
  },
  "Slightly Tight": {
    badge: "bg-orange-100 text-orange-700",
    icon: AlertTriangle,
    iconColor: "text-orange-400",
  },
  "Perfect Fit": {
    badge: "bg-green-100 text-green-700",
    icon: CheckCircle2,
    iconColor: "text-green-500",
  },
  Comfortable: {
    badge: "bg-cyan-100 text-cyan-700",
    icon: CheckCircle2,
    iconColor: "text-cyan-500",
  },
  Loose: {
    badge: "bg-blue-100 text-blue-700",
    icon: Info,
    iconColor: "text-blue-400",
  },
  Oversized: {
    badge: "bg-purple-100 text-purple-700",
    icon: Info,
    iconColor: "text-purple-400",
  },
};

const CONFIDENCE_COLORS = {
  High: "bg-green-50 text-green-600",
  Medium: "bg-yellow-50 text-yellow-600",
  Low: "bg-red-50 text-red-600",
};

function Field({ label, type = "text", value, onChange, required }) {
  return (
    <div className="relative">
      <Ruler className="absolute left-4 top-3 text-gray-300" size={16} />
      <input
        type={type}
        placeholder={label}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={type === "number" ? "0" : undefined}
        className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
      />
    </div>
  );
}

function BtnGroup({ label, options, value, onChange }) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              value === o.value
                ? "bg-cyan-500 border-cyan-500 text-white"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-600"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function UserInfoPage({
  initialPhase = "email",
  initialWelcome = null,
}) {
  const { t, lang } = useLang();
  const [phase, setPhase] = useState(initialPhase);
  const [mode, setMode] = useState(null);
  const [email, setEmail] = useState(
    () => localStorage.getItem("fitro_email") ?? "",
  );
  const [welcomeBack, setWelcomeBack] = useState(initialWelcome);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [body, setBody] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("fitro_body") ?? "{}");
    } catch {
      return {};
    }
  });
  const [product, setProduct] = useState({});
  const [garment, setGarment] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setBodyField = (k, v) => setBody((p) => ({ ...p, [k]: v }));
  const setProductField = (k, v) => setProduct((p) => ({ ...p, [k]: v }));
  const setGarmentField = (k, v) => setGarment((p) => ({ ...p, [k]: v }));

  const BackIcon = lang === "ar" ? ChevronRight : ChevronLeft;

  async function handleEmailLookup(e) {
    e.preventDefault();
    setLookupLoading(true);
    try {
      const { data } = await lookupByEmail(email);
      localStorage.setItem("fitro_email", email);
      if (data.found) {
        const u = data.user;
        setBody({
          name: u.name ?? "",
          gender: u.gender ?? "",
          height_cm: u.height?.toString() ?? "",
          weight_kg: u.weight?.toString() ?? "",
          chest_cm: u.chest?.toString() ?? "",
          waist_cm: u.waist?.toString() ?? "",
          hips_cm: u.hips?.toString() ?? "",
        });
        setWelcomeBack({ name: u.name });
        setPhase("mode"); // profile loaded — skip body form
      } else {
        setWelcomeBack(null);
        setPhase("body"); // new user — collect measurements first
      }
    } catch {
      setPhase("body");
    } finally {
      setLookupLoading(false);
    }
  }

  async function handleAnalyze(e) {
    e.preventDefault();
    if (
      !product.category ||
      !product.region ||
      !product.fit_type ||
      !product.material
    ) {
      setError(t("userInfo.selectAll"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await submitUserInfo({
        email: email || undefined,
        name: body.name,
        height: Number(body.height_cm),
        weight: Number(body.weight_kg),
        gender: body.gender,
        chest: parseNum(body.chest_cm),
        waist: parseNum(body.waist_cm),
        hips: parseNum(body.hips_cm),
      });
      localStorage.setItem("fitro_body", JSON.stringify(body));
      if (email) localStorage.setItem("fitro_email", email);
      setResult(
        analyzeFit({
          user: {
            gender: body.gender,
            height_cm: Number(body.height_cm),
            weight_kg: Number(body.weight_kg),
            chest_cm: Number(body.chest_cm),
            waist_cm: Number(body.waist_cm),
            hips_cm: Number(body.hips_cm),
          },
          product: {
            category: product.category,
            size_label: product.size_label,
            region: product.region,
            fit_type: product.fit_type,
            material: product.material,
          },
          garment_measurements: {
            chest_cm: Number(garment.chest_cm),
            waist_cm: Number(garment.waist_cm),
            hips_cm: Number(garment.hips_cm),
            length_cm: Number(garment.length_cm),
            thigh_cm: Number(garment.thigh_cm),
          },
        }),
      );
    } catch {
      setError(t("userInfo.error"));
    } finally {
      setLoading(false);
    }
  }

  // ── EMAIL GATE ──────────────────────────────────────────────────────────────
  if (phase === "email") {
    return (
      <div
        className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[440px] mx-4"
        style={{ animation: "scale-in 0.35s ease both" }}
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow-xl">
            <User className="text-white" size={26} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("userInfo.emailGateTitle")}
          </h2>
          <p className="text-gray-400 text-xs mt-1 text-center px-4">
            {t("userInfo.emailGateSub")}
          </p>
        </div>
        <form onSubmit={handleEmailLookup} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-3 text-gray-300" size={16} />
            <input
              type="email"
              placeholder={t("userInfo.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={lookupLoading}
            className={`w-full py-3.5 rounded-full ${btnGradient} text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60`}
          >
            {lookupLoading ? (
              <span className="flex gap-1.5">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </span>
            ) : (
              t("userInfo.emailGateBtn")
            )}
          </button>
        </form>
        <button
          onClick={() => {
            setEmail("");
            setPhase("body");
          }}
          className="w-full mt-4 text-gray-400 text-xs hover:text-gray-600 transition text-center"
        >
          {t("userInfo.emailGateGuest")}
        </button>
      </div>
    );
  }

  // ── BODY MEASUREMENTS ───────────────────────────────────────────────────────
  if (phase === "body") {
    return (
      <div
        className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[440px] mx-4"
        style={{ animation: "scale-in 0.35s ease both" }}
      >
        <div className="flex flex-col items-center mb-4">
          <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow-xl">
            <User className="text-white" size={26} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            {t("userInfo.step1Title")}
          </h2>
          <p className="text-gray-400 text-xs mt-1">{t("userInfo.step1Sub")}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPhase("mode");
          }}
          className="space-y-3"
        >
          <Field
            label={t("userInfo.name")}
            value={body.name}
            onChange={(v) => setBodyField("name", v)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={body.gender ?? ""}
              onChange={(e) => setBodyField("gender", e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
            >
              <option value="" disabled>
                {t("userInfo.gender")}
              </option>
              <option value="male">{t("userInfo.male")}</option>
              <option value="female">{t("userInfo.female")}</option>
            </select>
            <Field
              label={t("userInfo.height")}
              type="number"
              value={body.height_cm}
              onChange={(v) => setBodyField("height_cm", v)}
              required
            />
          </div>
          <Field
            label={t("userInfo.weight")}
            type="number"
            value={body.weight_kg}
            onChange={(v) => setBodyField("weight_kg", v)}
            required
          />
          <Field
            label={t("userInfo.chest")}
            type="number"
            value={body.chest_cm}
            onChange={(v) => setBodyField("chest_cm", v)}
          />
          <Field
            label={t("userInfo.waist")}
            type="number"
            value={body.waist_cm}
            onChange={(v) => setBodyField("waist_cm", v)}
          />
          <Field
            label={t("userInfo.hips")}
            type="number"
            value={body.hips_cm}
            onChange={(v) => setBodyField("hips_cm", v)}
          />
          <button
            type="submit"
            className={`w-full mt-2 py-3.5 rounded-full ${btnGradient} text-white font-bold flex items-center justify-center gap-2`}
          >
            {t("userInfo.next")} <ChevronRight size={18} />
          </button>
        </form>
      </div>
    );
  }

  // ── MODE SELECTION ──────────────────────────────────────────────────────────
  if (phase === "mode") {
    return (
      <div
        className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[440px] mx-4"
        style={{ animation: "scale-in 0.35s ease both" }}
      >
        {welcomeBack && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-2xl px-4 py-3 mb-5">
            <CheckCircle2 size={15} className="text-green-500 flex-shrink-0" />
            <p className="text-green-700 text-xs">
              {t("userInfo.welcomeBack").replace("{name}", welcomeBack.name)}
            </p>
          </div>
        )}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {t("userInfo.modeTitle")}
          </h2>
          <p className="text-gray-400 text-xs mt-1">{t("userInfo.modeSub")}</p>
        </div>
        <div className="space-y-3">
          <button
            onClick={() => {
              setMode("REPORT_ONLY");
              setPhase("garment");
            }}
            className="w-full text-left border-2 border-gray-100 hover:border-cyan-400 rounded-3xl p-5 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-cyan-50 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-100 transition-colors">
                <FileText size={20} className="text-cyan-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-gray-800 text-sm">
                    {t("userInfo.modeReport")}
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                    {t("userInfo.modeReportBadge")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  {t("userInfo.modeReportDesc")}
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => {
              setMode("IMAGE_AND_REPORT");
              setPhase("garment");
            }}
            className="w-full text-left border-2 border-gray-100 hover:border-purple-400 rounded-3xl p-5 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                <Sparkles size={20} className="text-purple-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-gray-800 text-sm">
                    {t("userInfo.modeVisual")}
                  </span>
                  <span className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full font-medium">
                    {t("userInfo.modeVisualBadge")}
                  </span>
                </div>
                <p className="text-gray-400 text-xs">
                  {t("userInfo.modeVisualDesc")}
                </p>
              </div>
            </div>
          </button>
        </div>
        <button
          onClick={() => setPhase(welcomeBack ? "email" : "body")}
          className="w-full mt-5 text-gray-400 text-xs hover:text-gray-600 transition text-center flex items-center justify-center gap-1"
        >
          <BackIcon size={14} /> {t("userInfo.back")}
        </button>
      </div>
    );
  }

  // ── RESULT CARD ─────────────────────────────────────────────────────────────
  if (result) {
    const isPants = product.category === "pants";
    const fitStyle = FIT_COLORS[result.fit_result] ?? FIT_COLORS["Comfortable"];
    const FitIcon = fitStyle.icon;
    const categoryLabel = isPants
      ? t("userInfo.pants")
      : product.category === "tshirt"
      ? t("userInfo.tshirt")
      : t("userInfo.shirt");

    return (
      <div
        className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[480px] mx-4"
        style={{ animation: "scale-in 0.35s ease both" }}
      >
        <div
          className="text-center mb-6"
          style={{ animation: "fade-up 0.4s ease both" }}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              result.fit_result === "Perfect Fit"
                ? "bg-green-100"
                : "bg-gray-100"
            }`}
          >
            <FitIcon className={fitStyle.iconColor} size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {t("userInfo.resultTitle")}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {categoryLabel} · {product.size_label} · {product.region}
          </p>
        </div>

        <div
          className="flex items-center justify-center gap-3 mb-6"
          style={{ animation: "fade-up 0.4s 0.08s ease both" }}
        >
          <span
            className={`px-5 py-2 rounded-full text-sm font-bold ${fitStyle.badge}`}
          >
            {t(`userInfo.${result.fit_result}`)}
          </span>
          <span
            className={`px-3 py-2 rounded-full text-xs font-medium ${
              CONFIDENCE_COLORS[result.confidence]
            }`}
          >
            {t(`userInfo.${result.confidence}`)} {t("userInfo.confidence")}
          </span>
        </div>

        <div
          className="bg-gray-50 rounded-2xl p-4 mb-4"
          style={{ animation: "fade-up 0.4s 0.15s ease both" }}
        >
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
            {t("userInfo.analysisLabel")}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            {result.explanation}
          </p>
        </div>

        <div
          className="border border-cyan-100 bg-cyan-50 rounded-2xl p-4 mb-4"
          style={{ animation: "fade-up 0.4s 0.22s ease both" }}
        >
          <p className="text-xs text-cyan-500 uppercase tracking-wider mb-2 font-semibold">
            {t("userInfo.adviceLabel")}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            {result.advice}
          </p>
        </div>

        {mode === "IMAGE_AND_REPORT" && (
          <div
            className="border-2 border-dashed border-purple-200 rounded-3xl p-5 mb-4"
            style={{ animation: "fade-up 0.4s 0.3s ease both" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={15} className="text-purple-500" />
              <span className="text-sm font-bold text-gray-800">
                {t("userInfo.tryOnTitle")}
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full font-medium">
                {t("userInfo.modeVisualBadge")}
              </span>
            </div>
            <div className="flex flex-col items-center py-3">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-3">
                <Shirt size={36} className="text-purple-300" />
              </div>
              <p className="text-gray-400 text-xs text-center leading-relaxed">
                {t("userInfo.tryOnNote")}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap justify-center">
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {product.fit_type}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {product.material}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {categoryLabel}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setResult(null);
            setProduct({});
            setGarment({});
            setPhase("mode");
          }}
          className={`w-full py-3 rounded-full ${btnGradient} text-white font-bold`}
        >
          {t("userInfo.newAnalysis")}
        </button>
      </div>
    );
  }

  // ── GARMENT DETAILS ─────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleAnalyze}
      className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[440px] mx-4"
      style={{ animation: "scale-in 0.35s ease both" }}
    >
      <div className="flex flex-col items-center mb-5">
        <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow-xl">
          <Shirt className="text-white" size={26} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {t("userInfo.step2Title")}
        </h2>
        <p className="text-gray-400 text-xs mt-1">{t("userInfo.step2Sub")}</p>
      </div>

      <div className="space-y-5">
        <BtnGroup
          label={t("userInfo.category")}
          value={product.category}
          onChange={(v) => setProductField("category", v)}
          options={[
            { value: "tshirt", label: t("userInfo.tshirt") },
            { value: "shirt", label: t("userInfo.shirt") },
            { value: "pants", label: t("userInfo.pants") },
          ]}
        />
        <BtnGroup
          label={t("userInfo.region")}
          value={product.region}
          onChange={(v) => setProductField("region", v)}
          options={["EU", "US", "IT", "TU", "CH"].map((r) => ({
            value: r,
            label: r,
          }))}
        />
        <BtnGroup
          label={t("userInfo.fitType")}
          value={product.fit_type}
          onChange={(v) => setProductField("fit_type", v)}
          options={[
            { value: "slim", label: t("userInfo.slim") },
            { value: "regular", label: t("userInfo.regular") },
            { value: "oversized", label: t("userInfo.oversized") },
          ]}
        />
        <BtnGroup
          label={t("userInfo.material")}
          value={product.material}
          onChange={(v) => setProductField("material", v)}
          options={[
            { value: "cotton", label: t("userInfo.cotton") },
            { value: "polyester", label: t("userInfo.polyester") },
            { value: "denim", label: t("userInfo.denim") },
            { value: "mixed", label: t("userInfo.mixed") },
          ]}
        />
        <Field
          label={t("userInfo.sizeLabel")}
          value={product.size_label}
          onChange={(v) => setProductField("size_label", v)}
        />

        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
          {t("userInfo.garmentMeasurements")}
        </p>
        {product.category !== "pants" && (
          <Field
            label={t("userInfo.garmentChest")}
            type="number"
            value={garment.chest_cm}
            onChange={(v) => setGarmentField("chest_cm", v)}
            required={!!product.category}
          />
        )}
        {product.category === "pants" && (
          <>
            <Field
              label={t("userInfo.garmentWaist")}
              type="number"
              value={garment.waist_cm}
              onChange={(v) => setGarmentField("waist_cm", v)}
              required
            />
            <Field
              label={t("userInfo.garmentHips")}
              type="number"
              value={garment.hips_cm}
              onChange={(v) => setGarmentField("hips_cm", v)}
            />
            <Field
              label={t("userInfo.thigh")}
              type="number"
              value={garment.thigh_cm}
              onChange={(v) => setGarmentField("thigh_cm", v)}
            />
          </>
        )}
        <Field
          label={t("userInfo.length")}
          type="number"
          value={garment.length_cm}
          onChange={(v) => setGarmentField("length_cm", v)}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-3">{error}</p>
      )}

      <div className="flex gap-3 mt-5">
        <button
          type="button"
          onClick={() => setPhase("mode")}
          className="flex-shrink-0 py-3.5 px-5 rounded-full border border-gray-200 text-gray-600 font-bold flex items-center gap-1 hover:bg-gray-50 transition"
        >
          <BackIcon size={18} />
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`flex-1 py-3.5 rounded-full ${btnGradient} text-white font-bold disabled:opacity-60 transition-opacity`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1.5">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </span>
          ) : (
            t("userInfo.analyze")
          )}
        </button>
      </div>
    </form>
  );
}
