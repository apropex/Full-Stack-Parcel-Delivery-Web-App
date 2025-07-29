import { NextFunction, Request, Response } from "express";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";

export const tokenVerifier = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError(sCode.UNAUTHORIZED, "Unauthorized"));
  }

  try {
    const token = authHeader.split(" ")[1];
    if (!token) {
      return next(new AppError(sCode.FORBIDDEN, "Token did not arrive"));
    }

    // req.decoded = verifyToken(token) as JwtPayload;

    next();
  } catch {
    next(new AppError(sCode.FORBIDDEN, "Invalid token"));
  }
};
