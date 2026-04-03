import { UserNotFound } from "../errors/user.errors";
import { prisma } from "../prisma";

class UserService {
  async getUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new UserNotFound();
    }

    return { id: user.id, email: user.email, createdAt: user.createdAt };
  }
}

export default new UserService();
