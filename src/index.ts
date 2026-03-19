import express, { Request, Response } from "express";
import { prisma } from "./prisma";
import dotenv from "dotenv";
import { register } from "./controllers/auth-controller";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const app = express();
app.use(express.json());

app.post("/auth/register", register);

app.post("/auth/login", async (req: Request, res: Response) => {
  // try {
  //   const result = loginSchema.safeParse(req.body);
  //   if (!result.success) {
  //     const errors = result.error.issues.map(
  //       (error: { message: string }) => error.message,
  //     );
  //     return res.status(400).json({ error: errors });
  //   }
  //   const { email, password } = result.data;
  //   const user = await prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (!user) {
  //     return res.status(401).json({ error: "Invalid credentials" });
  //   }
  //   const isPassEqual = await bcrypt.compare(password, user.password);
  //   if (!isPassEqual) {
  //     return res.status(401).json({ error: "Invalid credentials" });
  //   }
  //   const payload = { id: user.id };
  //   const token = jwt.sign(payload, JWT_SECRET, {
  //     expiresIn: "15m",
  //   });
  //   res.status(200).json({
  //     token,
  //     user: {
  //       id: user.id,
  //       email: user.email,
  //       createdAt: user.createdAt,
  //     },
  //   });
  // } catch (error) {
  //   return res.status(500).json({ error: "Server error" });
  // }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
