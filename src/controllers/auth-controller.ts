import { Request, Response } from "express";
import authService from "../services/auth-services";
import * as z from "zod";

const authSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const register = async (req: Request, res: Response) => {
  try {
    const result = authSchema.safeParse(req.body);

    if (!result.success) {
      console.warn("Login validation failed", {
        route: "/auth/login",
        method: req.method,
        errors: result.error.issues.map((e) => e.message),
      });
      return res.status(400).json({ error: "Invalid input" });
    }

    const { email, password } = result.data;
    const user = await authService.register(email, password);

    return res
      .status(201)
      .json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

export { register };
