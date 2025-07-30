/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { deleteImageFromCloud } from "../../config/cloudinary/deleteImageFromCloud";
import { isDev } from "../../config/env.config";
import {
  appError,
  castError,
  mongooseError,
  validationError,
  zodValidationError,
} from "../../errors";
import { AppError } from "../../errors/AppError";

//
export default async function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errCode = err?.code || err?.cause?.code || null;
  const message = err?.message || "Internal Server Error";

  const response = {
    statusCode: err?.statusCode || 500,
    success: false,
    message,
    error: [
      { name: err?.name || "Error" },
      { path: err?.path, message: err?.errors || message },
    ],
    stack: isDev ? err?.stack : undefined,
  };

  if (err instanceof AppError) response.error = appError(err);

  switch (err?.name) {
    case "ValidationError":
      response.statusCode = 400;
      response.message = "Validation Failed";
      response.error = validationError(err);
      break;

    case "MongooseError":
      response.statusCode = errCode ? 409 : 400;
      response.message = "Database Error";
      response.error = mongooseError(err);
      break;

    case "CastError":
      response.statusCode = 400;
      response.message = "Invalid ID Format";
      response.error = castError(err);
      break;

    case "ZodError":
      response.statusCode = 400;
      response.message = "Zod Validation Error";
      response.error = zodValidationError(err);
      break;
  }
  //

  if (req.file && req.file.path) await deleteImageFromCloud(req.file.path);

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files?.map((file) => file.path);

    await Promise.all(imageUrls.map((url) => deleteImageFromCloud(url)));
  }

  //
  res.status(response.statusCode).json(response);
}
