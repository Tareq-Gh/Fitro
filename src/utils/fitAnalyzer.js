// Standard garment chest/waist measurements (cm) by size label and region.
// Used when the user does not manually enter garment dimensions.
const SIZE_CHART = {
  // Upper body chest (cm) — unisex averages; women's sizes are smaller
  upper: {
    US: { XS: 86, S: 91, M: 97, L: 104, XL: 112, XXL: 119, XXXL: 127 },
    EU: { XS: 84, S: 90, M: 96, L: 102, XL: 110, XXL: 118, XXXL: 126 },
    UK: { XS: 84, S: 90, M: 96, L: 102, XL: 110, XXL: 118, XXXL: 126 },
    IT: { XS: 82, S: 88, M: 94, L: 100, XL: 108, XXL: 116, XXXL: 124 },
  },
  // Lower body waist (cm)
  lower: {
    US: { XS: 68, S: 74, M: 80, L: 86, XL: 94, XXL: 102, XXXL: 110 },
    EU: { XS: 66, S: 72, M: 78, L: 84, XL: 92, XXL: 100, XXXL: 108 },
    UK: { XS: 66, S: 72, M: 78, L: 84, XL: 92, XXL: 100, XXXL: 108 },
    IT: { XS: 64, S: 70, M: 76, L: 82, XL: 90, XXL: 98, XXXL: 106 },
  },
};

function lookupGarmentMeasurement(category, size_label, region) {
  const type = isPants(category) ? "lower" : "upper";
  const regionMap = SIZE_CHART[type][region] ?? SIZE_CHART[type]["US"];
  const normalizedSize = size_label?.toUpperCase().replace(/\s+/g, "");
  return regionMap[normalizedSize] ?? null;
}

const FIT_BANDS = [
  { max: 1, label: "Tight" },
  { max: 4, label: "Slightly Tight" },
  { max: 8, label: "Perfect Fit" },
  { max: 12, label: "Comfortable" },
  { max: 18, label: "Loose" },
  { max: Infinity, label: "Oversized" },
];

const MATERIAL_EASE_DELTA = {
  denim: -2,
  polyester: -1,
  cotton: 0,
  mixed: 0,
};

const FIT_TYPE_EASE_DELTA = {
  slim: -2,
  regular: 0,
  oversized: 3,
};

function classifyEase(adjustedEase) {
  for (const band of FIT_BANDS) {
    if (adjustedEase <= band.max) return band.label;
  }
  return "Oversized";
}

function isPants(category) {
  return category === "pants";
}

function buildExplanation({
  category,
  primaryMeasurement,
  garmentPrimary,
  ease,
  adjustedEase,
  material,
  fitType,
  fitResult,
  region,
}) {
  const isUpper = !isPants(category);
  const measureLabel = isUpper ? "chest" : "waist";
  const materialNote =
    MATERIAL_EASE_DELTA[material] !== 0
      ? ` ${
          material === "denim"
            ? "Denim is rigid and less forgiving"
            : "Polyester has limited stretch"
        }, reducing effective ease by ${Math.abs(
          MATERIAL_EASE_DELTA[material],
        )} cm.`
      : "";
  const fitTypeNote =
    fitType !== "regular"
      ? ` This is a ${fitType}-fit cut, which ${
          fitType === "slim"
            ? "is intentionally closer to the body (ease adjusted −2 cm)"
            : "adds extra room by design (ease adjusted +3 cm)"
        }.`
      : "";
  const regionNote =
    region && region !== "EU"
      ? ` Note: Size labels vary by region (${region} vs EU standards) — always verify actual measurements.`
      : "";

  return (
    `Your ${measureLabel} measures ${primaryMeasurement} cm. The garment's ${measureLabel} measures ${garmentPrimary} cm.` +
    ` Raw ease = ${garmentPrimary} − ${primaryMeasurement} = ${ease} cm.` +
    materialNote +
    fitTypeNote +
    ` After adjustments, effective ease = ${adjustedEase} cm, resulting in a "${fitResult}" classification.` +
    regionNote
  );
}

function buildAdvice({ fitResult, material, fitType }) {
  const adviceMap = {
    Tight: `This item will feel restrictive. Size up for comfort, especially given${
      material === "denim" ? " the rigid denim" : " the material"
    }.`,
    "Slightly Tight":
      fitType === "slim"
        ? "Expected for a slim-fit cut. If you prefer more freedom of movement, consider sizing up."
        : "This will feel close to the body. If you like a relaxed feel, choose one size up.",
    "Perfect Fit": `Great match. This item should fit well without being restrictive or baggy.${
      material === "denim"
        ? " Keep in mind denim softens slightly after wear."
        : ""
    }`,
    Comfortable: `Good everyday fit with room to move. If you prefer a more tailored look, consider sizing down.`,
    Loose: `This item will feel noticeably loose. ${
      fitType === "oversized"
        ? "This is expected for an oversized style."
        : "Size down for a better silhouette."
    }`,
    Oversized: `Very large fit. ${
      fitType === "oversized"
        ? "Intentional oversized style."
        : "Strongly consider sizing down by 1–2 sizes."
    }`,
  };
  return (
    adviceMap[fitResult] ??
    "Check measurements and compare with the size chart."
  );
}

function buildExplanationAr({
  category,
  primaryMeasurement,
  garmentPrimary,
  ease,
  adjustedEase,
  material,
  fitType,
  fitResult,
  region,
}) {
  const isUpper = !isPants(category);
  const measureLabel = isUpper ? "الصدر" : "الخصر";
  const materialNote =
    MATERIAL_EASE_DELTA[material] !== 0
      ? ` ${
          material === "denim"
            ? "الدنيم صلب وأقل مرونة"
            : "البوليستر محدود المطاطية"
        }، مما يقلل الفراغ الفعلي بمقدار ${Math.abs(
          MATERIAL_EASE_DELTA[material],
        )} سم.`
      : "";
  const fitTypeNote =
    fitType !== "regular"
      ? ` هذا قصّ ${fitType === "slim" ? "ضيق (slim)" : "واسع (oversized)"}، ${
          fitType === "slim"
            ? "مما يُضيّق الفراغ بمقدار 2 سم"
            : "مما يُضيف فراغاً إضافياً بمقدار 3 سم"
        }.`
      : "";
  const regionNote =
    region && region !== "EU"
      ? ` ملاحظة: مقاسات الأحجام تختلف حسب المنطقة (${region} مقابل معيار EU) — تحقق دائماً من القياسات الفعلية.`
      : "";

  return (
    `قياس ${measureLabel} لديك هو ${primaryMeasurement} سم. قياس ${measureLabel} الملبس هو ${garmentPrimary} سم.` +
    ` الفراغ الخام = ${garmentPrimary} − ${primaryMeasurement} = ${ease} سم.` +
    materialNote +
    fitTypeNote +
    ` بعد التعديلات، الفراغ الفعلي = ${adjustedEase} سم، والتصنيف هو "${fitResult}".` +
    regionNote
  );
}

function buildAdviceAr({ fitResult, material, fitType }) {
  const adviceMap = {
    Tight: `هذا الملبس سيكون ضيقاً. يُنصح بأخذ مقاس أكبر للراحة${
      material === "denim" ? "، خاصةً مع صلابة الدنيم" : ""
    }.`,
    "Slightly Tight":
      fitType === "slim"
        ? "هذا متوقع للقصّ الضيق. إذا أردت حرية حركة أكبر، جرب مقاساً أكبر."
        : "سيشعرك قريباً من الجسم. إذا تفضّل قصاً مريحاً، اختر مقاساً أكبر.",
    "Perfect Fit": `مقاس ممتاز. يجب أن يكون الملبس مناسباً دون إحكام أو اتساع.${
      material === "denim" ? " الدنيم يلين قليلاً بعد الاستخدام." : ""
    }`,
    Comfortable: `مقاس مريح للاستخدام اليومي مع حرية حركة. إن أردت مظهراً أكثر أناقة، جرب مقاساً أصغر.`,
    Loose: `هذا الملبس سيكون واسعاً بشكل ملحوظ. ${
      fitType === "oversized"
        ? "هذا متوقع لأسلوب الـ oversized."
        : "يُنصح بأخذ مقاس أصغر للحصول على قصّة أفضل."
    }`,
    Oversized: `المقاس كبير جداً. ${
      fitType === "oversized"
        ? "هذا مقصود لأسلوب الـ oversized."
        : "يُنصح بشدة بأخذ مقاس أصغر بدرجة أو درجتين."
    }`,
  };
  return adviceMap[fitResult] ?? "تحقق من القياسات وقارنها بجدول المقاسات.";
}

export function analyzeFit({ user, product, garment_measurements }) {
  const { chest_cm, waist_cm, hips_cm } = user ?? {};
  const { category, region, fit_type, material, size_label } = product ?? {};
  const garment = garment_measurements ?? {};

  const isUpper = !isPants(category);

  const bodyPrimary = isUpper ? Number(chest_cm) : Number(waist_cm);
  const bodySecondary = isUpper ? null : Number(hips_cm);

  // Use manually entered garment measurement, or fall back to size chart lookup.
  const garmentPrimary =
    (isUpper ? Number(garment.chest_cm) : Number(garment.waist_cm)) ||
    lookupGarmentMeasurement(category, size_label, region);
  const garmentSecondary = isUpper ? null : Number(garment.hips_cm);

  if (!bodyPrimary || !garmentPrimary) {
    return {
      fit_result: null,
      confidence: "Low",
      explanation: `Missing required measurement: ${
        isUpper ? "chest" : "waist"
      } is needed for a ${category} analysis. Please provide all measurements.`,
      advice: "Enter complete measurements to get an accurate fit analysis.",
      explanation_ar: `\u0627\u0644\u0642\u064a\u0627\u0633 \u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0645\u0641\u0642\u0648\u062f: ${
        isUpper
          ? "\u0627\u0644\u0635\u062f\u0631"
          : "\u0627\u0644\u062e\u0635\u0631"
      } \u0636\u0631\u0648\u0631\u064a \u0644\u062a\u062d\u0644\u064a\u0644 ${category}. \u064a\u0631\u062c\u0649 \u0625\u062f\u062e\u0627\u0644 \u062c\u0645\u064a\u0639 \u0627\u0644\u0642\u064a\u0627\u0633\u0627\u062a.`,
      advice_ar:
        "\u0623\u062f\u062e\u0644 \u0627\u0644\u0642\u064a\u0627\u0633\u0627\u062a \u0627\u0644\u0643\u0627\u0645\u0644\u0629 \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u062a\u062d\u0644\u064a\u0644 \u062f\u0642\u064a\u0642.",
    };
  }

  const normalizedMaterial = (material ?? "cotton").toLowerCase();
  const normalizedFitType = (fit_type ?? "regular").toLowerCase();

  const materialDelta = MATERIAL_EASE_DELTA[normalizedMaterial] ?? 0;
  const fitTypeDelta = FIT_TYPE_EASE_DELTA[normalizedFitType] ?? 0;

  const ease = garmentPrimary - bodyPrimary;
  const adjustedEase = ease + materialDelta + fitTypeDelta;

  let fitResult = classifyEase(adjustedEase);

  let secondaryFitResult = null;
  if (!isUpper && bodySecondary && garmentSecondary) {
    const hipsEase = garmentSecondary - bodySecondary;
    const adjustedHipsEase = hipsEase + materialDelta + fitTypeDelta;
    secondaryFitResult = classifyEase(adjustedHipsEase);
    if (
      FIT_BANDS.findIndex((b) => b.label === secondaryFitResult) <
      FIT_BANDS.findIndex((b) => b.label === fitResult)
    ) {
      fitResult = secondaryFitResult;
    }
  }

  const hasBothMeasurements = !isUpper
    ? !!bodySecondary && !!garmentSecondary
    : true;
  const confidence = hasBothMeasurements ? "High" : "Medium";

  const explanation = buildExplanation({
    category,
    primaryMeasurement: bodyPrimary,
    garmentPrimary,
    ease,
    adjustedEase,
    material: normalizedMaterial,
    fitType: normalizedFitType,
    fitResult,
    region,
  });

  const advice = buildAdvice({
    fitResult,
    category,
    material: normalizedMaterial,
    fitType: normalizedFitType,
  });

  const explanation_ar = buildExplanationAr({
    category,
    primaryMeasurement: bodyPrimary,
    garmentPrimary,
    ease,
    adjustedEase,
    material: normalizedMaterial,
    fitType: normalizedFitType,
    fitResult,
    region,
  });

  const advice_ar = buildAdviceAr({
    fitResult,
    material: normalizedMaterial,
    fitType: normalizedFitType,
  });

  const SHORT_DESC = {
    Tight:
      "This size is too tight for your measurements. Consider going one size up.",
    "Slightly Tight":
      "This size is a little snug. You might be more comfortable in the next size up.",
    "Perfect Fit": "This size fits you just right — great choice.",
    Comfortable:
      "This size gives you a relaxed, comfortable fit with good freedom of movement.",
    Loose:
      "This size is a bit loose on you. Sizing down could give a cleaner look.",
    Oversized:
      "This size is significantly larger than your measurements — expect a bold, oversized look.",
  };
  const SHORT_DESC_AR = {
    Tight: "هذا المقاس ضيق جداً على قياساتك. يُنصح بتجربة مقاس أكبر.",
    "Slightly Tight":
      "هذا المقاس ضيق قليلاً. قد تشعر براحة أكبر بالمقاس التالي.",
    "Perfect Fit": "هذا المقاس يناسبك تماماً — اختيار موفق.",
    Comfortable: "هذا المقاس مريح ويمنحك حرية حركة جيدة.",
    Loose: "هذا المقاس فضفاض قليلاً. المقاس الأصغر قد يبدو أفضل.",
    Oversized: "هذا المقاس أكبر بكثير من قياساتك — سيبدو فضفاضاً بشكل واضح.",
  };

  return {
    fit_result: fitResult,
    confidence,
    explanation,
    advice,
    explanation_ar,
    advice_ar,
    short_description: SHORT_DESC[fitResult] ?? explanation,
    short_description_ar: SHORT_DESC_AR[fitResult] ?? explanation_ar,
  };
}
