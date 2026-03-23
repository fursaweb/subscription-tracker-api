import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { register, login } from "./controllers/auth-controller";
import { authMiddleware } from "./middleware/auth-middleware";

dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

export const config = {
  jwtSecret,
};

const app = express();
app.use(express.json());

app.post("/auth/register", register);
app.post("/auth/login", login);
app.get("/profile", authMiddleware, (req: Request, res: Response) => {
  return res.status(200).json({ data: { user: req.userId } });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
