import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";

const saltRounds = 10;

class AuthService {
  async register(email: string, password: string) {
    const candidate = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (candidate) {
      throw new Error("Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: { email, password: hashPassword },
    });

    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}

export default new AuthService();
