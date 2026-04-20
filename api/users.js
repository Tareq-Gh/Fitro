import { connectDB } from "./_db.js";
import { User } from "./_User.js";
import { verifyToken } from "./_auth.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch {
    return res.status(500).json({ error: "Database connection failed" });
  }

  if (req.method === "POST") {
    const { name, gender, height, weight, chest, waist, hips, email } =
      req.body ?? {};

    if (!name || !height || !weight) {
      return res
        .status(400)
        .json({ error: "Name, height, and weight are required" });
    }

    const toNum = (v) =>
      v !== undefined && v !== null && !Number.isNaN(Number(v))
        ? Number(v)
        : undefined;

    const data = {
      name,
      gender,
      height: Number(height),
      weight: Number(weight),
      chest: toNum(chest),
      waist: toNum(waist),
      hips: toNum(hips),
    };

    try {
      if (email && typeof email === "string" && email.trim()) {
        const clean = email.toLowerCase().trim();
        const user = await User.findOneAndUpdate(
          { email: clean },
          { ...data, email: clean },
          { upsert: true, new: true, setDefaultsOnInsert: true },
        );
        return res.status(200).json(user);
      }
      const user = await User.create(data);
      return res.status(201).json(user);
    } catch {
      return res.status(500).json({ error: "Failed to save user" });
    }
  }

  if (req.method === "GET") {
    try {
      await verifyToken(req);
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const users = await User.find().sort({ createdAt: -1 });
      return res.json(users);
    } catch {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  }

  res.status(405).end();
}
