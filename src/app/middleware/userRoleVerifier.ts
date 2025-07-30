// userRoleVerifier

import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { eJwtMessages } from "../constants/messages";
import { verifyAccessToken } from "../lib/jwt";
import { extractTokenFromHeader } from "../utils/extractTokenFromHeader";
import { checkUserExist } from "../utils/userChecker";

export const roleVerifier =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers?.authorization || "";
      const decoded = verifyAccessToken(
        extractTokenFromHeader(header)
      ) as JwtPayload;

      await checkUserExist({ id: decoded._id });

      if (!roles.includes(decoded.role))
        return next(new AppError(sCode.FORBIDDEN, eJwtMessages.FORBIDDEN));

      req.decoded = decoded as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
