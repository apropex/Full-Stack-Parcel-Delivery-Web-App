import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { eJwtMessages } from "../constants/messages";

export const authValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const header = req.headers?.authorization || "";
    const token = extractTokenFromHeader(header, next);
    // req.decoded = verifyToken(token) as JwtPayload;
    next();
  } catch {
    next(new AppError(sCode.FORBIDDEN, eJwtMessages.INVALID_TOKEN));
  }
};

export const extractTokenFromHeader = (
  authHeader: string,
  next: NextFunction
) => {
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(sCode.UNAUTHORIZED, eJwtMessages.UNAUTHORIZED));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(new AppError(sCode.FORBIDDEN, eJwtMessages.TOKEN_NOT_FOUND));
  }

  return token;
};
