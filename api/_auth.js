import { jwtVerify } from "jose";

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

export async function verifyToken(req) {
  const auth = req.headers.authorization ?? "";
  if (!auth.startsWith("Bearer ")) throw new Error("Unauthorized");
  const token = auth.slice(7);
  await jwtVerify(token, secret());
}
