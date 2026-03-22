import bcrypt from "bcrypt";
import { prisma } from "../prisma";
import { EmailAlreadyInUseError } from "./../errors/auth-errors";

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
}

export default new AuthService();
