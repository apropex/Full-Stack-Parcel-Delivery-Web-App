import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import ENV from "../../config/env.config";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { eIsActive } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import {
  jwtPayloadGenerator,
  TokenPayload,
} from "../utils/jwtPayloadGenerator";

// Environment validation
const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_TOKEN_PERIOD,
  JWT_REFRESH_TOKEN_PERIOD,
} = ENV.JWT;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

// Token signing function
const signToken = (
  payload: object,
  secret: string,
  expiresIn: string
): string => {
  try {
    return jwt.sign(payload, secret, { expiresIn } as SignOptions);
  } catch {
    throw new AppError(sCode.UNAUTHORIZED, "Failed to sign token");
  }
};

// Access token generator
export const generateAccessToken = (
  data: TokenPayload,
  period?: string
): string => {
  const payload = jwtPayloadGenerator(data);
  return signToken(payload, JWT_SECRET, period || JWT_TOKEN_PERIOD);
};

// Refresh token generator
export const generateRefreshToken = (data: TokenPayload): string => {
  const payload = jwtPayloadGenerator(data);
  return signToken(payload, JWT_REFRESH_SECRET, JWT_REFRESH_TOKEN_PERIOD);
};

// Sign both tokens
export const generateAllTokens = (data: TokenPayload, period?: string) => {
  return {
    accessToken: generateAccessToken(data, period),
    refreshToken: generateRefreshToken(data),
  };
};

// Generic verifier
const verify = (token: string, secret: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === "string" || !decoded) {
      throw new AppError(sCode.UNAUTHORIZED, "Invalid token structure");
    }
    return decoded as JwtPayload;
  } catch {
    throw new AppError(sCode.UNAUTHORIZED, "Invalid or expired token");
  }
};

// Verify access token
export const verifyAccessToken = (token: string): JwtPayload =>
  verify(token, JWT_SECRET);

// Verify refresh token
export const verifyRefreshToken = (token: string): JwtPayload =>
  verify(token, JWT_REFRESH_SECRET);

// Access token from refresh
export const generateAccessTokenByRefreshToken = async (
  refreshToken: string
): Promise<string> => {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded._id) {
    throw new AppError(sCode.BAD_REQUEST, "Refresh token is missing user ID");
  }

  const user = await User.findById(decoded._id);
  if (!user) throw new AppError(sCode.NOT_FOUND, "User does not exist");

  if (user.isActive === eIsActive.BLOCKED || user.isDeleted)
    throw new AppError(
      sCode.BAD_REQUEST,
      `User is ${user.isDeleted ? "deleted" : "blocked"}`
    );

  return generateAccessToken(user as TokenPayload);
};
