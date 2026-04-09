import { Response } from "express";

type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "SERVER_ERROR";

export const sendError = (
  res: Response,
  status: number,
  code: ErrorCode,
  message: string,
  details?: string[],
) => {
  return res.status(status).json({
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  });
};
