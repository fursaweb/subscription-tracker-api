import { Request, Response, NextFunction } from "express";
import tokenService from "../services/token.service";
import { extractBearerToken } from "../utils/extractBearerToken";
import { sendError } from "../utils/sendError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || typeof authorizationHeader !== "string") {
    return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
  }

  const accessToken = extractBearerToken(authorizationHeader);

  if (typeof accessToken !== "string") {
    return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
  }

  const data = tokenService.validateAccessToken(accessToken);

  if (
    !data ||
    typeof data !== "object" ||
    typeof data.userId !== "string" ||
    typeof data.sessionId !== "string"
  ) {
    return sendError(res, 401, "UNAUTHORIZED", "Unauthorized");
  }

  req.userId = data.userId;
  req.sessionId = data.sessionId;

  next();
};
