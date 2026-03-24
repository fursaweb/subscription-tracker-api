import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";
import {
  EmailAlreadyInUseError,
  InvalidCredentialsError,
} from "./../errors/auth-errors";
import { config } from "../index";

class AuthService {
  async register(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    const candidate = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (candidate) {
      throw new EmailAlreadyInUseError();
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: normalizedEmail, password: hashPassword },
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user) {
      console.warn("Login failed: user not found", {
        route: "/auth/login",
        method: "POST",
        email,
      });

      throw new InvalidCredentialsError();
    }

    const isPassEqual = await bcrypt.compare(password, user.password);

    if (!isPassEqual) {
      console.warn("Login failed: wrong password", {
        route: "/auth/login",
        method: "POST",
        userId: user.id,
      });

      throw new InvalidCredentialsError();
    }

    const payload = { id: user.id };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: "30m",
    });

    console.info("User logged in successfully", {
      route: "/auth/login",
      method: "POST",
      userId: user.id,
    });

    return {
      accessToken: token,
      id: user.id,
      email: user.email,
    };
  }
}

export default new AuthService();
