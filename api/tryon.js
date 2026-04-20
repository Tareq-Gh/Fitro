// Virtual Try-On API endpoint
// Uses Replicate IDM-VTON when REPLICATE_API_TOKEN is set in env.
// Falls back gracefully (image_url: null) so the frontend shows the garment photo instead.

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { garment_image_b64, body_image_b64, category, fit_type, material } =
    req.body ?? {};

  // Both images are required for AI try-on
  if (!garment_image_b64 || !body_image_b64) {
    return res.json({ image_url: null, reason: "missing_inputs" });
  }

  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    return res.json({ image_url: null, reason: "no_token" });
  }

  try {
    const resp = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/json",
        // Wait synchronously up to 55 s (Vercel hobby limit is 60 s)
        Prefer: "wait=55",
      },
      body: JSON.stringify({
        // IDM-VTON: high-quality virtual try-on model
        version:
          "a07f252abbbd832009640b27f063ea52d87d7a23ce5e70fad196c2b4cfc9b44a",
        input: {
          human_img: body_image_b64,
          garm_img: garment_image_b64,
          garment_des: `${fit_type ?? "regular"} ${
            category ?? "garment"
          } made of ${material ?? "cotton"}`,
          is_checked: true,
          is_checked_crop: false,
          denoise_steps: 30,
          seed: 42,
        },
      }),
      signal: AbortSignal.timeout(55000),
    });

    if (!resp.ok) {
      return res.json({ image_url: null, reason: "api_error" });
    }

    const data = await resp.json();
    const imageUrl = Array.isArray(data.output)
      ? data.output[0]
      : data.output ?? null;

    return res.json({ image_url: imageUrl ?? null });
  } catch {
    return res.json({ image_url: null, reason: "timeout_or_error" });
  }
}
