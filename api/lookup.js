import { connectDB } from "./_db.js";
import { User } from "./_User.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  const email = ((req.query.email ?? "")).toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "email required" });

  try {
    await connectDB();
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }

  const user = await User.findOne({ email }).select(
    "name gender height weight chest waist hips email -_id"
  );

  if (!user) return res.json({ found: false });
  return res.json({ found: true, user });
}
