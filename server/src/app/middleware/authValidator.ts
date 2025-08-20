import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { eJwtMessages } from "../constants/messages";
import { verifyAccessToken } from "../lib/jwt";
import { checkUserExist } from "../utils/userChecker";

export const authValidator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken || req.headers?.authorization || "";
    const decoded = verifyAccessToken(token) as JwtPayload;

    await checkUserExist({ id: decoded._id });
    req.decoded = decoded;

    next();
  } catch {
    next(new AppError(sCode.UNAUTHORIZED, eJwtMessages.INVALID_TOKEN));
  }
};
