import { connectDB } from "./_db.js";
import { User } from "./_User.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, name, gender } = req.body ?? {};

  if (!email || !name || !gender) {
    return res
      .status(400)
      .json({ error: "email, name, and gender are required" });
  }

  const clean = email.toLowerCase().trim();

  try {
    await connectDB();
  } catch {
    return res.status(503).json({ error: "Database unavailable" });
  }

  const existing = await User.findOne({ email: clean });
  if (existing) {
    return res.status(409).json({ error: "email_taken" });
  }

  try {
    const user = await User.create({ email: clean, name: name.trim(), gender });
    return res.status(201).json({ success: true, user });
  } catch {
    return res.status(500).json({ error: "Failed to create account" });
  }
}
