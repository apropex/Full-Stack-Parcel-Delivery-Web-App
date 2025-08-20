import { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";

// zod request body validator
export const zodBodyValidator =
  (zodSchema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body?.data;
      const result = data ? JSON.parse(data) : req.body;
      req.body = await zodSchema.parseAsync(result);

      next();
    } catch (error) {
      next(error);
    }
  };

// ===========================

interface PQSchema {
  paramsSchema?: ZodObject;
  querySchema?: ZodObject;
}

type QP = Record<string, string>;

// zod query and params validator
export const zodPQValidator =
  ({ paramsSchema, querySchema }: PQSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (paramsSchema) {
        req.params = paramsSchema.parse(req.params) as QP;
      }
      if (querySchema) {
        req.query = querySchema.parse(req.query) as QP;
      }

      next();
    } catch (error) {
      next(error);
    }
  };

// zod params validation schema
export const paramsSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, {
      message: "Invalid ID format",
    })
    .optional(),
  email: z.string().email({ message: "Invalid Email" }).optional(),
});

// zod query validation schema
export const querySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, { message: "Page must be a number" })
    .optional(),
  limit: z
    .string()
    .regex(/^\d+$/, { message: "Limit must be a number" })
    .optional(),
});
