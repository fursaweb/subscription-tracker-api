import express from "express";
import dotenv from "dotenv";
import {
  register,
  login,
  refreshSession,
  logout,
} from "./controllers/auth.controller";
import { getProfile } from "./controllers/user.controller";
import {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
} from "./controllers/subscription.controller";
import { authMiddleware } from "./middleware/auth.middleware";

dotenv.config();
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

if (!jwtAccessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

if (!jwtRefreshSecret) {
  throw new Error("JWT_REFRESH_SECRET is not defined");
}

export const config = {
  jwtAccessSecret,
  jwtRefreshSecret,
  sessionLifetimeDays: 7,
};

const app = express();
app.use(express.json());

app.post("/auth/register", register);
app.post("/auth/login", login);
app.post("/auth/refresh", refreshSession);
app.post("/auth/logout", logout);

app.post("/subscriptions", authMiddleware, createSubscription);
app.get("/subscriptions", authMiddleware, getSubscriptions);
app.get("/subscriptions/:id", authMiddleware, getSubscriptionById);

app.get("/me", authMiddleware, getProfile);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
