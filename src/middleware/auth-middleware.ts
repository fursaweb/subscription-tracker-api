import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "..";
import { extractBearerToken } from "../helpers";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || typeof authorizationHeader !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const accessToken = extractBearerToken(authorizationHeader);

  if (typeof accessToken !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  let data;

  try {
    data = jwt.verify(accessToken, config.jwtSecret);
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (typeof data !== "object" || typeof data.id !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.userId = data.id;

  next();
};
