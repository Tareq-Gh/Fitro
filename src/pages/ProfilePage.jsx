import { useMemo, useState } from "react";
import { UserCircle2, PencilLine, Save, XCircle, ArrowLeft } from "lucide-react";
import { useLang } from "../context/useLang";
import { submitUserInfo } from "../services/api";
import { btnGradient } from "../constants";

const FIELD_CONFIG = [
  { key: "height_cm", labelKey: "height", unit: "cm", required: true, min: 90, max: 260 },
  { key: "weight_kg", labelKey: "weight", unit: "kg", required: true, min: 25, max: 350 },
  { key: "chest_cm", labelKey: "chest", unit: "cm", required: false, min: 40, max: 220 },
  { key: "shoulder_cm", labelKey: "shoulder", unit: "cm", required: false, min: 30, max: 70 },
  { key: "waist_cm", labelKey: "waist", unit: "cm", required: false, min: 35, max: 220 },
  { key: "hips_cm", labelKey: "hips", unit: "cm", required: false, min: 40, max: 240 },
];

function toNumOrUndefined(value) {
  if (value === "" || value === null || value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function validateBody(body, t) {
  const errors = {};

  for (const field of FIELD_CONFIG) {
    const raw = body[field.key] ?? "";
    if (field.required && `${raw}`.trim() === "") {
      errors[field.key] = t("profile.requiredField");
      continue;
    }
    if (`${raw}`.trim() === "") continue;

    const num = Number(raw);
    if (Number.isNaN(num)) {
      errors[field.key] = t("profile.numberOnly");
      continue;
    }
    if (num < field.min || num > field.max) {
      errors[field.key] = t("profile.rangeError")
        .replace("{min}", String(field.min))
        .replace("{max}", String(field.max));
    }
  }

  return errors;
}

export function ProfilePage({ profile, onBack, onProfileUpdated }) {
  const { t, lang } = useLang();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(() => ({
    name: profile?.name ?? "",
    gender: profile?.body?.gender ?? "",
    height_cm: profile?.body?.height_cm ?? "",
    weight_kg: profile?.body?.weight_kg ?? "",
    chest_cm: profile?.body?.chest_cm ?? "",
    shoulder_cm: profile?.body?.shoulder_cm ?? "",
    waist_cm: profile?.body?.waist_cm ?? "",
    hips_cm: profile?.body?.hips_cm ?? "",
  }));

  const canEdit = !!profile?.email;
  const displayName = useMemo(
    () => profile?.name || profile?.email || t("profile.guestUser"),
    [profile?.name, profile?.email, t],
  );

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit() {
    setError("");
    setSuccess("");
    setFieldErrors({});
    setEditing(true);
  }

  function cancelEdit() {
    setForm({
      name: profile?.name ?? "",
      gender: profile?.body?.gender ?? "",
      height_cm: profile?.body?.height_cm ?? "",
      weight_kg: profile?.body?.weight_kg ?? "",
      chest_cm: profile?.body?.chest_cm ?? "",
      shoulder_cm: profile?.body?.shoulder_cm ?? "",
      waist_cm: profile?.body?.waist_cm ?? "",
      hips_cm: profile?.body?.hips_cm ?? "",
    });
    setFieldErrors({});
    setError("");
    setSuccess("");
    setEditing(false);
  }

  async function saveProfile() {
    setError("");
    setSuccess("");
    const nextFieldErrors = validateBody(form, t);
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) {
      setError(t("profile.fixValidation"));
      return;
    }
    if (!profile?.email) {
      setError(t("profile.emailMissing"));
      return;
    }

    setSaving(true);
    try {
      await submitUserInfo({
        email: profile.email,
        name: form.name?.trim() || profile.name || "User",
        gender: form.gender || undefined,
        height: Number(form.height_cm),
        weight: Number(form.weight_kg),
        chest: toNumOrUndefined(form.chest_cm),
        shoulder: toNumOrUndefined(form.shoulder_cm),
        waist: toNumOrUndefined(form.waist_cm),
        hips: toNumOrUndefined(form.hips_cm),
      });

      onProfileUpdated?.({
        name: form.name?.trim() || profile.name || "User",
        email: profile.email,
        body: {
          name: form.name?.trim() || profile.name || "User",
          gender: form.gender,
          height_cm: `${form.height_cm}`,
          weight_kg: `${form.weight_kg}`,
          chest_cm: `${form.chest_cm ?? ""}`,
          shoulder_cm: `${form.shoulder_cm ?? ""}`,
          waist_cm: `${form.waist_cm ?? ""}`,
          hips_cm: `${form.hips_cm ?? ""}`,
        },
        hasMeasurements: true,
      });

      setEditing(false);
      setSuccess(t("profile.saved"));
      setTimeout(() => setSuccess(""), 2200);
    } catch {
      setError(t("profile.saveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full max-w-3xl mx-4">
      <div className="bg-[#0f1d3a]/90 border border-white/10 rounded-[34px] shadow-2xl p-6 md:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white/70 hover:text-cyan-300 transition text-sm"
          >
            <ArrowLeft size={16} className={lang === "ar" ? "rotate-180" : ""} />
            {t("profile.back")}
          </button>
          {!editing ? (
            <button
              type="button"
              onClick={startEdit}
              disabled={!canEdit}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 px-4 py-2 text-cyan-300 hover:bg-cyan-500/15 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PencilLine size={15} />
              {t("profile.edit")}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-white/80 hover:bg-white/10 disabled:opacity-60"
              >
                <XCircle size={15} />
                {t("profile.cancel")}
              </button>
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-white font-semibold ${btnGradient} disabled:opacity-60`}
              >
                <Save size={15} />
                {saving ? t("profile.saving") : t("profile.save")}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
            <UserCircle2 size={24} className="text-cyan-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{t("profile.title")}</h2>
            <p className="text-sm text-white/60">{displayName}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/50 mb-1">{t("userInfo.name")}</p>
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
              />
            ) : (
              <p className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/85">
                {form.name || "-"}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">{t("nav.profileEmail")}</p>
            <p className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/85">
              {profile?.email || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/50 mb-1">{t("userInfo.gender")}</p>
            {editing ? (
              <select
                value={form.gender}
                onChange={(e) => setField("gender", e.target.value)}
                className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
              >
                <option value="">{t("profile.optional")}</option>
                <option value="male">{t("userInfo.male")}</option>
                <option value="female">{t("userInfo.female")}</option>
              </select>
            ) : (
              <p className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/85">
                {form.gender ? t(`userInfo.${form.gender}`) : "-"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          {FIELD_CONFIG.map((field) => (
            <div key={field.key}>
              <p className="text-xs text-white/50 mb-1">
                {t(`userInfo.${field.labelKey}`)}
                {field.required ? " *" : ""}
              </p>
              {editing ? (
                <>
                  <input
                    type="number"
                    value={form[field.key] ?? ""}
                    onChange={(e) => setField(field.key, e.target.value)}
                    min={field.min}
                    max={field.max}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-white outline-none focus:border-cyan-400"
                  />
                  {fieldErrors[field.key] && (
                    <p className="text-rose-300 text-xs mt-1">{fieldErrors[field.key]}</p>
                  )}
                </>
              ) : (
                <p className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white/85">
                  {form[field.key] ? `${form[field.key]} ${field.unit}` : "-"}
                </p>
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-5 bg-rose-500/15 border border-rose-400/30 rounded-xl px-4 py-3 text-rose-200 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-5 bg-emerald-500/15 border border-emerald-400/30 rounded-xl px-4 py-3 text-emerald-200 text-sm">
            {success}
          </div>
        )}
        {!canEdit && (
          <div className="mt-5 bg-amber-500/15 border border-amber-400/30 rounded-xl px-4 py-3 text-amber-200 text-sm">
            {t("profile.needAccount")}
          </div>
        )}
      </div>
    </div>
  );
}
