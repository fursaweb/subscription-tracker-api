import express, { Request, Response } from "express";
import { prisma } from "./prisma";
import dotenv from "dotenv";
import * as z from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req: Request, res: Response) => res.json({ ok: true }));

app.post("/users", async (req: Request, res: Response) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await prisma.user.create({ data: { email, password } });

  console.log("Created user:", user);
  return res.status(201).json(user);
});

app.post("/auth/register", async (req: Request, res: Response) => {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((error) => error.message);
      return res.status(400).json({ error: errors });
    }

    const { email, password } = result.data;
    const candidate = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (candidate) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: { email, password: hashPassword },
    });

    return res
      .status(201)
      .json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

app.post("/auth/login", async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((error) => error.message);
      return res.status(400).json({ error: errors });
    }

    const { email, password } = result.data;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "15m",
    });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
