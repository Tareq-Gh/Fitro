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

const btnGradient = "bg-gradient-to-r from-[#1e4e79] to-[#3eb5d4]";

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
  const [step, setStep] = useState(1);
  const [body, setBody] = useState({});
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
        chest: Number(body.chest_cm),
        waist: Number(body.waist_cm),
        hips: Number(body.hips_cm),
      });
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
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    const isPants = product.category === "pants";
    const fitStyle = FIT_COLORS[result.fit_result] ?? FIT_COLORS["Comfortable"];
    const FitIcon = fitStyle.icon;
    return (
      <div className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[480px] animate-in fade-in zoom-in duration-500 mx-4">
        <div className="text-center mb-6">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${
              result.fit_result === "Perfect Fit"
                ? "bg-green-100"
                : "bg-gray-100"
            }`}
          >
            <FitIcon className={fitStyle.iconColor} size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Fit Analysis</h2>
          <p className="text-gray-400 text-sm mt-1">
            {isPants
              ? "Pants"
              : product.category === "tshirt"
              ? "T-Shirt"
              : "Shirt"}{" "}
            · {product.size_label} · {product.region}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-6">
          <span
            className={`px-5 py-2 rounded-full text-sm font-bold ${fitStyle.badge}`}
          >
            {result.fit_result}
          </span>
          <span
            className={`px-3 py-2 rounded-full text-xs font-medium ${
              CONFIDENCE_COLORS[result.confidence]
            }`}
          >
            {result.confidence} Confidence
          </span>
        </div>

        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
            Analysis
          </p>
          <p className="text-gray-700 text-sm leading-relaxed">
            {result.explanation}
          </p>
        </div>

        <div className="border border-cyan-100 bg-cyan-50 rounded-2xl p-4 mb-6">
          <p className="text-xs text-cyan-500 uppercase tracking-wider mb-2 font-semibold">
            Our Advice
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
          New Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[45px] shadow-2xl p-8 w-full max-w-[440px] animate-in fade-in zoom-in duration-500 mx-4">
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
          Step {step} / 2
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
              Your Measurements
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Body measurements in centimeters
            </p>
          </div>

          <Field
            label="Full Name"
            value={body.name}
            onChange={(v) => setBodyField("name", v)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Gender"
              value={body.gender}
              onChange={(v) => setBodyField("gender", v)}
              required
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
              ]}
            />
            <Field
              label="Height (cm)"
              type="number"
              value={body.height_cm}
              onChange={(v) => setBodyField("height_cm", v)}
              required
            />
          </div>
          <Field
            label="Weight (kg)"
            type="number"
            value={body.weight_kg}
            onChange={(v) => setBodyField("weight_kg", v)}
            required
          />
          <Field
            label="Chest (cm)"
            type="number"
            value={body.chest_cm}
            onChange={(v) => setBodyField("chest_cm", v)}
          />
          <Field
            label="Waist (cm)"
            type="number"
            value={body.waist_cm}
            onChange={(v) => setBodyField("waist_cm", v)}
          />
          <Field
            label="Hips (cm)"
            type="number"
            value={body.hips_cm}
            onChange={(v) => setBodyField("hips_cm", v)}
          />

          <button
            type="submit"
            className={`w-full mt-2 py-3.5 rounded-full ${btnGradient} text-white font-bold flex items-center justify-center gap-2`}
          >
            Next <ChevronRight size={18} />
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleAnalyze} className="space-y-3">
          <div className="flex flex-col items-center mb-4">
            <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center mb-3 shadow-xl">
              <Shirt className="text-white" size={26} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Garment Details</h2>
            <p className="text-gray-400 text-xs mt-1">
              Tell us about the item you want to check
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={product.category}
              onChange={(v) => setProductField("category", v)}
              required
              options={[
                { value: "tshirt", label: "T-Shirt" },
                { value: "shirt", label: "Shirt" },
                { value: "pants", label: "Pants" },
              ]}
            />
            <Select
              label="Region"
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
              label="Fit Type"
              value={product.fit_type}
              onChange={(v) => setProductField("fit_type", v)}
              required
              options={[
                { value: "slim", label: "Slim" },
                { value: "regular", label: "Regular" },
                { value: "oversized", label: "Oversized" },
              ]}
            />
            <Select
              label="Material"
              value={product.material}
              onChange={(v) => setProductField("material", v)}
              required
              options={[
                { value: "cotton", label: "Cotton" },
                { value: "polyester", label: "Polyester" },
                { value: "denim", label: "Denim" },
                { value: "mixed", label: "Mixed" },
              ]}
            />
          </div>
          <Field
            label="Size Label (e.g. M, L, 32)"
            value={product.size_label}
            onChange={(v) => setProductField("size_label", v)}
          />

          <p className="text-xs text-gray-400 uppercase tracking-wider pt-2 font-semibold">
            Garment Measurements
          </p>
          {product.category !== "pants" && (
            <Field
              label="Garment Chest (cm)"
              type="number"
              value={garment.chest_cm}
              onChange={(v) => setGarmentField("chest_cm", v)}
              required
            />
          )}
          {product.category === "pants" && (
            <>
              <Field
                label="Garment Waist (cm)"
                type="number"
                value={garment.waist_cm}
                onChange={(v) => setGarmentField("waist_cm", v)}
                required
              />
              <Field
                label="Garment Hips (cm)"
                type="number"
                value={garment.hips_cm}
                onChange={(v) => setGarmentField("hips_cm", v)}
              />
              <Field
                label="Thigh (cm)"
                type="number"
                value={garment.thigh_cm}
                onChange={(v) => setGarmentField("thigh_cm", v)}
              />
            </>
          )}
          <Field
            label="Length (cm)"
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
              <ChevronLeft size={18} />
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-3.5 rounded-full ${btnGradient} text-white font-bold disabled:opacity-60`}
            >
              {loading ? "Analyzing..." : "Analyze Fit"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
