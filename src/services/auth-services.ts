import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import tokenService from "../services/token-service";
import {
  EmailAlreadyInUseError,
  InvalidCredentialsError,
  UnauthorizedError,
} from "./../errors/auth-errors";

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

    const accessToken = tokenService.generateAccessToken(payload);
    const refreshToken = tokenService.generateRefreshToken(payload);

    console.info("User logged in successfully", {
      route: "/auth/login",
      method: "POST",
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const data = tokenService.validateRefreshToken(refreshToken);
    if (!data || typeof data !== "object" || typeof data.id !== "string") {
      throw new UnauthorizedError();
    }

    const userId = data.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedError();
    }

    const accessToken = tokenService.generateAccessToken({ id: user.id });
    return accessToken;
  }

  async logout(refreshToken: string) {
    const data = tokenService.validateRefreshToken(refreshToken);

    if (!data || typeof data !== "object" || typeof data.id !== "string") {
      throw new UnauthorizedError();
    }
    const userId = data.id;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UnauthorizedError();
    }
  }
}

export default new AuthService();
