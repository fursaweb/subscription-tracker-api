import express, { Request, Response } from "express";
import { prisma } from "./prisma";
import dotenv from "dotenv";
import * as z from "zod";
import bcrypt from "bcrypt";

const saltRounds = 10;

const Login = z.object({
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

app.post("/auth/register", (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = Login.safeParse({ email, password });

  if (!result.success) {
    const errors = result.error.issues.map((error) => error.message);
    return res.status(400).json({ error: errors });
  } else {
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        try {
          const user = await prisma.user.create({
            data: { email, password: hash },
          });

          return res.status(200).json({ user });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  // return res.status(200).json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
