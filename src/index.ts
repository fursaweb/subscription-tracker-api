import express, { Request, Response } from "express";
import { prisma } from "./prisma";
import dotenv from "dotenv";

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
