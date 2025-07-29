// userRoleVerifier

import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { extractTokenFromHeader } from "./authValidator";

export const roleVerifier =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const header = req.headers?.authorization || "";
      const decoded = verifyToken(extractTokenFromHeader(header, next));

      if (!roles.includes(decoded.role))
        return next(new AppError(sCode.FORBIDDEN, "Forbidden User Role"));

      req.decoded = decoded as JwtPayload;
      next();
    } catch (error) {
      next(error);
    }
  };
