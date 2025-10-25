import { z } from "zod";
import { eAuthProvider, eIsActive, eUserRoles } from "./user.interface";

const userRoles = Object.values(eUserRoles) as [string, ...string[]];
const isActive = Object.values(eIsActive) as [string, ...string[]];
const authProvider = Object.values(eAuthProvider) as [string, ...string[]];

export const createUserZodSchema = z.object({
  name: z.object({
    firstName: z
      .string({
        error: ({ input }) =>
          input === undefined ? "First name is required" : "First name must be a string",
      })
      .min(2, { error: "Name must be at least 2 characters" })
      .max(15, { error: "Name must be at most 15 characters" })
      .trim(),

    lastName: z
      .string({
        error: ({ input }) =>
          input === undefined ? "Last name is required" : "Last name must be a string type",
      })
      .min(2, { error: "Name must be at least 2 characters" })
      .max(15, { error: "Name must be at most 15 characters" })
      .trim(),
  }),

  role: z
    .enum(userRoles, {
      error: "Enter a valid user role",
    })
    .optional(),

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
      error: ({ input }) =>
        input === undefined ? "Password is required" : "Password must be a string type",
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
    .object({
      street: z
        .string({
          error: ({ input }) =>
            input === undefined ? "Street is required" : "Street must be a string",
        })
        .trim(),
      stateOrProvince: z
        .string({
          error: ({ input }) =>
            input === undefined ? "State is required" : "State must be a string",
        })
        .trim(),
      city: z
        .string({
          error: ({ input }) =>
            input === undefined ? "City is required" : "City must be a string",
        })
        .trim(),
      postalCode: z
        .string({
          error: ({ input }) =>
            input === undefined ? "Post code is required" : "Post code must be a string",
        })
        .trim(),
      country: z
        .string({
          error: ({ input }) =>
            input === undefined ? "Country is required" : "Country must be a string",
        })
        .trim(),
    })
    .optional(),
});

const updateOnlyUserFields = z.object({
  isActive: z
    .enum(isActive, {
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
        provider: z.enum(authProvider, {
          error: "Invalid auth provider",
        }),
        providerId: z.string({ error: "providerId must be a string" }),
      })
    )
    .optional(),
});

export const updateUserZodSchema = createUserZodSchema
  .partial()
  .extend(updateOnlyUserFields.shape);

export const loginUserZodSchema = createUserZodSchema.pick({ email: true, password: true });

export const changePasswordZodSchema = z.object({
  oldPassword: z.string({
    error: ({ input }) => (input ? "Old password must be string" : "Old password is required"),
  }),
  newPassword: z.string({
    error: ({ input }) => (input ? "New password must be string" : "New password is required"),
  }),
});

export const resetPasswordZodSchema = z.object({
  newPassword: z.string({
    error: ({ input }) => (input ? "New password must be string" : "New password is required"),
  }),
  id: z
    .string({
      error: ({ input }) => (input ? "ID must be string" : "ID is required"),
    })
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID format, enter a valid ID"),
});
