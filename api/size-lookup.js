import fs from "node:fs/promises";

const BASE = "G:/TM471 - Part 2/المقاسات json";

const TABLE_PATHS = {
  pants: {
    slim: {
      male: `${BASE}/البناطيل/all/fitro_slim_fit_pants_men.json`,
      female: `${BASE}/البناطيل/all/fitro_slim_fit_pants_women.json`,
    },
    regular: {
      male: `${BASE}/البناطيل/all/fitro_regular_pants_men.json`,
      female: `${BASE}/البناطيل/all/fitro_regular_pants_women.json`,
    },
    oversized: {
      male: `${BASE}/البناطيل/all/fitro_oversize_pants_men.json`,
      female: `${BASE}/البناطيل/all/fitro_oversize_pants_women.json`,
    },
  },
  tshirt: {
    slim: {
      male: `${BASE}/التيشرتات/all/Men's Slim Fit T-Shirts.json`,
      female: `${BASE}/التيشرتات/all/Women's Slim Fit T-Shirts.json`,
    },
    regular: {
      male: `${BASE}/التيشرتات/all/Men_s_Regular_T-Shirt_Chart.json`,
      female: `${BASE}/التيشرتات/all/Women_s_Regular_T-Shirt_Chart.json`,
    },
    oversized: {
      male: `${BASE}/التيشرتات/all/Men's Oversize Fit T-Shirts.json`,
      female: `${BASE}/التيشرتات/all/Women's Oversize Fit T-Shirts .json`,
    },
  },
  shirt: {
    slim: {
      male: `${BASE}/القمصان/all/fitro_slim_shirts_men.json`,
      female: `${BASE}/القمصان/all/fitro_slim_shirts_women.json`,
    },
    regular: {
      male: `${BASE}/القمصان/all/fitro_regular_shirts_men.json`,
      female: `${BASE}/القمصان/all/fitro_regular_shirts_women.json`,
    },
    oversized: {
      male: `${BASE}/القمصان/all/fitro_oversize_shirts_men.json`,
      female: `${BASE}/القمصان/all/fitro_oversize_shirts_women.json`,
    },
  },
};

function parseRange(raw) {
  if (typeof raw === "number") return { min: raw, max: raw };
  if (typeof raw !== "string") return null;
  const nums = raw
    .replace(/\s+/g, "")
    .split("-")
    .map((v) => Number(v))
    .filter((v) => Number.isFinite(v));
  if (nums.length === 2) return { min: nums[0], max: nums[1] };
  if (nums.length === 1) return { min: nums[0], max: nums[0] };
  return null;
}

function normalizeRegion(region) {
  const r = String(region ?? "")
    .trim()
    .toUpperCase();
  if (r === "TU") return "TR";
  return r;
}

function normalizeSize(size) {
  return String(size ?? "")
    .trim()
    .toUpperCase();
}

function findInObjectByRegion(table, region, size) {
  const key = region === "US" ? "US_UK" : region;
  const rows = table[key] ?? [];
  const row = rows.find((entry) => normalizeSize(entry.size ?? entry.Size) === size);
  return row ?? null;
}

function findInRegularTshirtArray(table, region, size) {
  const rows = Array.isArray(table) ? table : [];
  const row = rows.find((entry) => {
    const entryRegion = String(entry.Region ?? "");
    const regionMatches = entryRegion.includes(`(${region})`);
    return regionMatches && normalizeSize(entry.Size) === size;
  });
  return row ?? null;
}

function findInNestedRegionObject(table, region, size) {
  const root = Object.values(table ?? {})[0];
  if (!root || typeof root !== "object") return null;
  const rows = root[region] ?? [];
  const row = rows.find((entry) => normalizeSize(entry.size ?? entry.Size) === size);
  return row ?? null;
}

function toSizeProfile(category, row) {
  if (!row) return null;
  if (category === "pants") {
    return {
      waistRange: parseRange(row.waist_cm),
      hipRange: parseRange(row.hip_cm),
    };
  }

  const rawChest =
    row["Chest Circumference (cm)"] ??
    row.Chest_Circumference_cm ??
    row.chest_cm ??
    null;

  return {
    chestRange: parseRange(rawChest),
  };
}

function hasUsableData(category, profile) {
  if (!profile) return false;
  if (category === "pants") return !!(profile.waistRange && profile.hipRange);
  return !!profile.chestRange;
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const category = String(req.query.category ?? "").trim().toLowerCase();
  const fitType = String(req.query.fitType ?? "").trim().toLowerCase();
  const gender = String(req.query.gender ?? "").trim().toLowerCase();
  const region = normalizeRegion(req.query.region);
  const size = normalizeSize(req.query.size);

  if (!category || !fitType || !gender || !region || !size) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }

  const path = TABLE_PATHS[category]?.[fitType]?.[gender];
  if (!path) {
    return res.status(400).json({ error: "Unsupported category/fitType/gender" });
  }

  try {
    const raw = await fs.readFile(path, "utf-8");
    const table = JSON.parse(raw);

    let row = null;
    if (category === "pants") {
      row = findInObjectByRegion(table, region, size);
    } else if (category === "tshirt" && fitType === "regular") {
      row = findInRegularTshirtArray(table, region, size);
    } else if (category === "tshirt") {
      row = findInNestedRegionObject(table, region, size);
    } else {
      row = findInObjectByRegion(table, region, size);
    }

    const sizeProfile = toSizeProfile(category, row);
    if (!hasUsableData(category, sizeProfile)) {
      return res.status(404).json({
        found: false,
        error: "No size profile for this region/fit/size",
      });
    }

    return res.status(200).json({ found: true, sizeProfile });
  } catch (error) {
    return res.status(500).json({
      found: false,
      error: "Failed to load size table",
      details: error?.message,
    });
  }
}
