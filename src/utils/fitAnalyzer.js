const TOLERANCE_BY_FIT = {
  slim: { perfect: 1, comfortable: 2, loose: 4 },
  regular: { perfect: 2, comfortable: 4, loose: 7 },
  oversized: { perfect: 3, comfortable: 6, loose: 10 },
};

function isPants(category) {
  return category === "pants";
}

function classifyAgainstRange(value, range, fitType) {
  const t = TOLERANCE_BY_FIT[fitType] ?? TOLERANCE_BY_FIT.regular;
  if (!range) return "Perfect Fit";

  if (value > range.max + t.comfortable) return "Tight";
  if (value > range.max + t.perfect) return "Slightly Tight";
  if (value >= range.min && value <= range.max) return "Perfect Fit";
  if (value < range.min - t.loose) return "Oversized";
  if (value < range.min - t.comfortable) return "Loose";
  return "Comfortable";
}

function worstFit(...fits) {
  const order = [
    "Tight",
    "Slightly Tight",
    "Perfect Fit",
    "Comfortable",
    "Loose",
    "Oversized",
  ];
  let winner = "Perfect Fit";
  for (const fit of fits) {
    if (!fit) continue;
    if (order.indexOf(fit) < order.indexOf(winner)) winner = fit;
  }
  return winner;
}

function buildAdvice({ fitResult, fitType }) {
  const adviceMap = {
    Tight: "This size is smaller than your body range. Consider sizing up.",
    "Slightly Tight":
      fitType === "slim"
        ? "This is close for slim fit. Size up for extra comfort."
        : "This will feel close to the body. If you like a relaxed feel, choose one size up.",
    "Perfect Fit": "Great match for your selected region, fit type, and size.",
    Comfortable: `Good everyday fit with room to move. If you prefer a more tailored look, consider sizing down.`,
    Loose: `This item may feel loose. ${
      fitType === "oversized"
        ? "This is expected for an oversized style."
        : "Consider sizing down."
    }`,
    Oversized: `This is much roomier than your body range. ${
      fitType === "oversized"
        ? "Intentional oversized style."
        : "Consider sizing down by 1–2 sizes."
    }`,
  };
  return (
    adviceMap[fitResult] ??
    "Check measurements and compare with the size chart."
  );
}

function buildExplanationAr({
  category,
  bodyWaist,
  bodyHips,
  bodyChest,
  waistRange,
  hipRange,
  chestRange,
  fitType,
  fitResult,
  region,
  sizeLabel,
}) {
  const isUpper = !isPants(category);
  if (isUpper) {
    return `تمت مقارنة قياس الصدر (${bodyChest} سم) مع جدول المقاس ${sizeLabel} لمنطقة ${region} ونوع القصّة ${fitType}. نطاق الصدر للمقاس المختار هو ${chestRange.min} إلى ${chestRange.max} سم، والتصنيف النهائي هو "${fitResult}".`;
  }
  return `تمت مقارنة الخصر (${bodyWaist} سم) والورك (${bodyHips} سم) مع جدول المقاس ${sizeLabel} لمنطقة ${region} ونوع القصّة ${fitType}. نطاق الخصر هو ${waistRange.min}-${waistRange.max} سم ونطاق الورك هو ${hipRange.min}-${hipRange.max} سم، والتصنيف النهائي هو "${fitResult}".`;
}

function buildExplanation({
  category,
  bodyWaist,
  bodyHips,
  bodyChest,
  waistRange,
  hipRange,
  chestRange,
  fitType,
  fitResult,
  region,
  sizeLabel,
}) {
  const isUpper = !isPants(category);
  if (isUpper) {
    return `Compared chest (${bodyChest} cm) against ${region} ${fitType} ${sizeLabel}. Selected size chest range is ${chestRange.min}-${chestRange.max} cm. Final status: "${fitResult}".`;
  }
  return `Compared waist (${bodyWaist} cm) and hips (${bodyHips} cm) against ${region} ${fitType} ${sizeLabel}. Waist range is ${waistRange.min}-${waistRange.max} cm and hip range is ${hipRange.min}-${hipRange.max} cm. Final status: "${fitResult}".`;
}

function buildAdviceAr({ fitResult, fitType }) {
  const adviceMap = {
    Tight: "هذا المقاس أصغر من قياساتك. يفضّل اختيار مقاس أكبر.",
    "Slightly Tight":
      fitType === "slim"
        ? "هذا ضيق قليلاً بالنسبة لقصّة slim. جرّب مقاساً أكبر لمزيد من الراحة."
        : "سيشعرك قريباً من الجسم. إذا تفضّل قصاً مريحاً، اختر مقاساً أكبر.",
    "Perfect Fit": "مقاس مناسب جداً حسب المنطقة ونوع القصّة والمقاس المختار.",
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

export function analyzeFit({ user, product, sizeProfile }) {
  const { chest_cm, waist_cm, hips_cm } = user ?? {};
  const { category, region, fit_type, size_label } = product ?? {};

  const isUpper = !isPants(category);
  const bodyChest = Number(chest_cm);
  const bodyWaist = Number(waist_cm);
  const bodyHips = Number(hips_cm);
  const fitType = (fit_type ?? "regular").toLowerCase();

  if (!sizeProfile) {
    return {
      fit_result: null,
      confidence: "Low",
      explanation:
        "No matching size profile found for the selected region, fit type, and size label.",
      advice: "Try another size label or region.",
      explanation_ar:
        "لم يتم العثور على بيانات لهذا المقاس حسب المنطقة ونوع القصّة المختارين.",
      advice_ar:
        "جرّب اختيار مقاس أو منطقة مختلفة.",
    };
  }

  const waistRange = sizeProfile.waistRange;
  const hipRange = sizeProfile.hipRange;
  const chestRange = sizeProfile.chestRange;

  let fitResult = "Perfect Fit";
  if (isUpper) {
    fitResult = classifyAgainstRange(bodyChest, chestRange, fitType);
  } else {
    const waistFit = classifyAgainstRange(bodyWaist, waistRange, fitType);
    const hipsFit = classifyAgainstRange(bodyHips, hipRange, fitType);
    fitResult = worstFit(waistFit, hipsFit);
  }

  const confidence = "High";

  const explanation = buildExplanation({
    category,
    bodyWaist,
    bodyHips,
    bodyChest,
    waistRange,
    hipRange,
    chestRange,
    fitType,
    fitResult,
    region,
    sizeLabel: size_label,
  });

  const advice = buildAdvice({
    fitResult,
    fitType,
  });

  const explanation_ar = buildExplanationAr({
    category,
    bodyWaist,
    bodyHips,
    bodyChest,
    waistRange,
    hipRange,
    chestRange,
    fitType,
    fitResult,
    region,
    sizeLabel: size_label,
  });

  const advice_ar = buildAdviceAr({
    fitResult,
    fitType,
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
