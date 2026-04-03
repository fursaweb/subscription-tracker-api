import { Request, Response } from "express";
import userService from "../services/user.service";
import { UserNotFound } from "../errors/user.errors";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await userService.getUser(userId);
    return res.status(200).json({ data: user });
  } catch (error) {
    if (error instanceof UserNotFound) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Server error" });
  }
};
