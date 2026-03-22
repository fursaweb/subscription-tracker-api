import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { register, login } from "./controllers/auth-controller";

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const app = express();
app.use(express.json());

app.post("/auth/register", register);

app.post("/auth/login", login);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
