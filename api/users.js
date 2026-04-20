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
    const { name, gender, height, weight, chest, waist, hips } = req.body ?? {};

    if (!name || !height || !weight) {
      return res
        .status(400)
        .json({ error: "Name, height, and weight are required" });
    }

    try {
      const user = await User.create({
        name,
        gender,
        height,
        weight,
        chest,
        waist,
        hips,
      });
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
