import { Request, Response } from "express";
import * as z from "zod";
import {
  EmailAlreadyInUseError,
  InvalidCredentialsError,
} from "../errors/auth-errors";
import authServices from "../services/auth-services";

const authCredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const register = async (req: Request, res: Response) => {
  try {
    const result = authCredentialsSchema.safeParse(req.body);

    if (!result.success) {
      console.warn("Regiser validation failed", {
        route: "/auth/register",
        method: req.method,
        errors: result.error.issues.map((e) => e.message),
      });
      return res.status(400).json({ error: "Invalid input" });
    }

    const { email, password } = result.data;
    const user = await authServices.register(email, password);

    return res
      .status(201)
      .json({ id: user.id, email: user.email, createdAt: user.createdAt });
  } catch (error) {
    if (error instanceof EmailAlreadyInUseError) {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const result = authCredentialsSchema.safeParse(req.body);

    if (!result.success) {
      console.warn("Login validation failed", {
        route: "/auth/login",
        method: req.method,
        errors: result.error.issues.map((e) => e.message),
      });

      return res.status(400).json({ error: "Invalid input" });
    }

    const { email, password } = result.data;

    const data = await authServices.login(email, password);

    res.status(200).json(data);
  } catch (error) {
    console.error("Unexpected error in login route", {
      route: "/auth/login",
      method: req.method,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });

    if (error instanceof InvalidCredentialsError) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(500).json({ error: "Server error" });
  }
};

export { register, login };
