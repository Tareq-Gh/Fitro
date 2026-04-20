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
} from "lucide-react";
import { submitUserInfo } from "../services/api";
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

function Select({ label, value, onChange, options, required }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="w-full px-4 py-2.5 bg-gray-50 rounded-full text-gray-800 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
    >
      <option value="" disabled>
        {label}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function UserInfoPage() {
  const { t, lang } = useLang();
  const [step, setStep] = useState(1);
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

  function setBodyField(key, val) {
    setBody((p) => ({ ...p, [key]: val }));
  }
  function setProductField(key, val) {
    setProduct((p) => ({ ...p, [key]: val }));
  }
  function setGarmentField(key, val) {
    setGarment((p) => ({ ...p, [key]: val }));
  }

  async function handleAnalyze(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitUserInfo({
        name: body.name,
        height: Number(body.height_cm),
        weight: Number(body.weight_kg),
        gender: body.gender,
        chest: parseNum(body.chest_cm),
        waist: parseNum(body.waist_cm),
        hips: parseNum(body.hips_cm),
      });
      localStorage.setItem("fitro_body", JSON.stringify(body));
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
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 transition-transform ${
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
          className="border border-cyan-100 bg-cyan-50 rounded-2xl p-4 mb-6"
          style={{ animation: "fade-up 0.4s 0.22s ease both" }}
        >
          <p className="text-xs text-cyan-500 uppercase tracking-wider mb-2 font-semibold">
            {t("userInfo.adviceLabel")}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            {result.advice}
          </p>
        </div>

        <button
          onClick={() => {
            setResult(null);
            setStep(1);
            setBody({});
            setProduct({});
            setGarment({});
          }}
          className={`w-full py-3 rounded-full ${btnGradient} text-white font-bold`}
        >
          {t("userInfo.newAnalysis")}
        </button>
      </div>
    );
  }

  const BackIcon = lang === "ar" ? ChevronRight : ChevronLeft;
  const NextIcon = lang === "ar" ? ChevronLeft : ChevronRight;

  return (
    <div
      className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[440px] mx-4"
      style={{ animation: "scale-in 0.35s ease both" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-1.5 w-10 rounded-full transition-all ${
                step >= s ? "bg-cyan-500" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          {t("userInfo.stepLabel")} {step} {t("userInfo.stepOf")} 2
        </span>
      </div>

      {step === 1 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
          className="space-y-3"
        >
          <div className="flex flex-col items-center mb-4">
            <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow-xl">
              <User className="text-white" size={26} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("userInfo.step1Title")}
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {t("userInfo.step1Sub")}
            </p>
          </div>

          <Field
            label={t("userInfo.name")}
            value={body.name}
            onChange={(v) => setBodyField("name", v)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t("userInfo.gender")}
              value={body.gender}
              onChange={(v) => setBodyField("gender", v)}
              required
              options={[
                { value: "male", label: t("userInfo.male") },
                { value: "female", label: t("userInfo.female") },
              ]}
            />
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
            {t("userInfo.next")} <NextIcon size={18} />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleAnalyze} className="space-y-3">
          <div className="flex flex-col items-center mb-4">
            <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow-xl">
              <Shirt className="text-white" size={26} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {t("userInfo.step2Title")}
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              {t("userInfo.step2Sub")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t("userInfo.category")}
              value={product.category}
              onChange={(v) => setProductField("category", v)}
              required
              options={[
                { value: "tshirt", label: t("userInfo.tshirt") },
                { value: "shirt", label: t("userInfo.shirt") },
                { value: "pants", label: t("userInfo.pants") },
              ]}
            />
            <Select
              label={t("userInfo.region")}
              value={product.region}
              onChange={(v) => setProductField("region", v)}
              required
              options={[
                { value: "EU", label: "EU" },
                { value: "US", label: "US" },
                { value: "IT", label: "IT" },
                { value: "TU", label: "TU" },
                { value: "CH", label: "CH" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label={t("userInfo.fitType")}
              value={product.fit_type}
              onChange={(v) => setProductField("fit_type", v)}
              required
              options={[
                { value: "slim", label: t("userInfo.slim") },
                { value: "regular", label: t("userInfo.regular") },
                { value: "oversized", label: t("userInfo.oversized") },
              ]}
            />
            <Select
              label={t("userInfo.material")}
              value={product.material}
              onChange={(v) => setProductField("material", v)}
              required
              options={[
                { value: "cotton", label: t("userInfo.cotton") },
                { value: "polyester", label: t("userInfo.polyester") },
                { value: "denim", label: t("userInfo.denim") },
                { value: "mixed", label: t("userInfo.mixed") },
              ]}
            />
          </div>
          <Field
            label={t("userInfo.sizeLabel")}
            value={product.size_label}
            onChange={(v) => setProductField("size_label", v)}
          />

          <p className="text-xs text-gray-400 uppercase tracking-wider pt-2 font-semibold">
            {t("userInfo.garmentMeasurements")}
          </p>
          {product.category !== "pants" && (
            <Field
              label={t("userInfo.garmentChest")}
              type="number"
              value={garment.chest_cm}
              onChange={(v) => setGarmentField("chest_cm", v)}
              required
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

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
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
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </span>
              ) : (
                t("userInfo.analyze")
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
