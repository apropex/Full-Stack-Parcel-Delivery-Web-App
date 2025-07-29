import { z } from "zod";
import { eAuthProvider, eIsActive, eUserRoles } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z.object({
    firstName: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "First name is required"
            : "First name must be a string",
      })
      .min(2, { error: "Name must be at least 2 characters" })
      .max(15, { error: "Name must be at most 15 characters" })
      .trim(),

    lastName: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Last name is required"
            : "Last name must be a string type",
      })
      .min(2, { error: "Name must be at least 2 characters" })
      .max(15, { error: "Name must be at most 15 characters" })
      .trim(),
  }),

  email: z
    .string({
      error: ({ input }) =>
        input === undefined ? "Email is required" : "Enter a valid email",
    })
    .email({ message: "Enter a valid email" })
    .trim()
    .transform((val) => val.toLowerCase()),

  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string type",
    })
    .min(6, { error: "Password must be at least 6 characters" })
    .max(64, { error: "Password must be at most 64 characters" })
    .refine((val) => /[a-zA-Z]/.test(val), {
      error: "Password must contain at least one letter",
    })
    .refine((val) => /\d/.test(val), {
      error: "Password must contain at least one number",
    })
    .refine((val) => /[!@#$%^&*]/.test(val), {
      error: "Password must contain at least one special character",
    }),

  phone: z
    .string({
      error: "Phone must be a string type",
    })
    .regex(/^(?:\+8801|01)[0-9]{9}$/, {
      message: "Phone number must be valid Bangladeshi format",
    })
    .optional(),

  address: z
    .string({
      error: "Address must be a string",
    })
    .max(250, { error: "Address cannot exceed 250 characters" })
    .trim()
    .optional(),
});

const updateOnlyUserFields = z.object({
  role: z
    .enum(Object.values(eUserRoles) as [string, ...string[]], {
      error: "Enter a valid user role",
    })
    .optional(),

  isActive: z
    .enum(Object.values(eIsActive) as [string, ...string[]], {
      error: "Enter a valid isActive status",
    })
    .optional(),

  isDeleted: z
    .boolean({
      error: "isDeleted must be a boolean",
    })
    .optional(),

  isVerified: z
    .boolean({
      error: "isVerified must be a boolean",
    })
    .optional(),

  auth: z
    .array(
      z.object({
        provider: z.enum(
          Object.values(eAuthProvider) as [string, ...string[]],
          {
            error: "Invalid auth provider",
          }
        ),
        providerId: z.string({ error: "providerId must be a string" }),
      })
    )
    .optional(),

  // TODO: Add rest of fields
});

export const updateUserZodSchema = createUserZodSchema
  .partial()
  .merge(updateOnlyUserFields);
