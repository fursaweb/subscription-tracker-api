import jwt from "jsonwebtoken";
import { config } from "../index";

type Payload = { id: string };
type Token = string;

class TokenService {
  generateAccessToken(payload: Payload) {
    const accessToken = jwt.sign(payload, config.jwtAccessSecret, {
      expiresIn: "30m",
    });

    return accessToken;
  }

  generateRefreshToken(payload: Payload) {
    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, {
      expiresIn: "30d",
    });

    return refreshToken;
  }

  validateAccessToken(token: Token) {
    try {
      const data = jwt.verify(token, config.jwtAccessSecret);
      return data;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: Token) {
    try {
      const data = jwt.verify(token, config.jwtRefreshSecret);
      return data;
    } catch (error) {
      return null;
    }
  }
}

export default new TokenService();
