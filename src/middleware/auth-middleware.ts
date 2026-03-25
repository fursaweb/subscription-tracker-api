import { Request, Response, NextFunction } from "express";
import tokenService from "../services/token-service";
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

  const data = tokenService.validateAccessToken(accessToken);

  if (!data || typeof data !== "object" || typeof data.id !== "string") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.userId = data.id;

  next();
};
