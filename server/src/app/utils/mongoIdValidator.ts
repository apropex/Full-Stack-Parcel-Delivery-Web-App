import { Types } from "mongoose";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";

export const mongoIdValidator = (id: string): Types.ObjectId => {
  if (Types.ObjectId.isValid(id)) return new Types.ObjectId(id);
  throw new AppError(sCode.BAD_REQUEST, "Invalid MongoDB ID format");
};
