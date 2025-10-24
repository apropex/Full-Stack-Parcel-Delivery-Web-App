import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { eJwtMessages } from "../constants/messages";

export const extractTokenFromHeader = (authHeader: string): string => {
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError(sCode.UNAUTHORIZED, eJwtMessages.UNAUTHORIZED);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new AppError(sCode.FORBIDDEN, eJwtMessages.TOKEN_NOT_FOUND);
  }

  return token;
};
