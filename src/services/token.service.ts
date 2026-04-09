import jwt from "jsonwebtoken";
import { config } from "../index";

type Token = string;
type TokenPayload = { userId: string; sessionId: string };

const isTokenPayload = (data: unknown): data is TokenPayload => {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  if (!("userId" in data) || !("sessionId" in data)) {
    return false;
  }

  return typeof data.userId === "string" && typeof data.sessionId === "string";
};

class TokenService {
  generateAccessToken(payload: TokenPayload): Token {
    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: "15m",
    });

    return accessToken;
  }

  generateRefreshToken(payload: TokenPayload): Token {
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: "7d",
    });

    return refreshToken;
  }

  validateAccessToken(token: Token): TokenPayload | null {
    try {
      const data = jwt.verify(token, config.jwtAccessSecret);

      if (!isTokenPayload(data)) return null;

      return data;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: Token): TokenPayload | null {
    try {
      const data = jwt.verify(token, config.jwtRefreshSecret);

      if (!isTokenPayload(data)) return null;

      return data;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
