"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordZodSchema = exports.changePasswordZodSchema = exports.loginUserZodSchema = exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
const userRoles = Object.values(user_interface_1.eUserRoles);
const isActive = Object.values(user_interface_1.eIsActive);
const authProvider = Object.values(user_interface_1.eAuthProvider);
exports.createUserZodSchema = zod_1.z.object({
    name: zod_1.z.object({
        firstName: zod_1.z
            .string({
            error: (issue) => issue.input === undefined
                ? "First name is required"
                : "First name must be a string",
        })
            .min(2, { error: "Name must be at least 2 characters" })
            .max(15, { error: "Name must be at most 15 characters" })
            .trim(),
        lastName: zod_1.z
            .string({
            error: (issue) => issue.input === undefined
                ? "Last name is required"
                : "Last name must be a string type",
        })
            .min(2, { error: "Name must be at least 2 characters" })
            .max(15, { error: "Name must be at most 15 characters" })
            .trim(),
    }),
    email: zod_1.z
        .string({
        error: ({ input }) => input === undefined ? "Email is required" : "Enter a valid email",
    })
        .email({ message: "Enter a valid email" })
        .trim()
        .transform((val) => val.toLowerCase()),
    password: zod_1.z
        .string({
        error: (issue) => issue.input === undefined
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
    phone: zod_1.z
        .string({
        error: "Phone must be a string type",
    })
        .regex(/^(?:\+8801|01)[0-9]{9}$/, {
        message: "Phone number must be valid Bangladeshi format",
    })
        .optional(),
    address: zod_1.z
        .string({
        error: "Address must be a string",
    })
        .max(250, { error: "Address cannot exceed 250 characters" })
        .trim()
        .optional(),
});
const updateOnlyUserFields = zod_1.z.object({
    role: zod_1.z
        .enum(userRoles, {
        error: "Enter a valid user role",
    })
        .optional(),
    isActive: zod_1.z
        .enum(isActive, {
        error: "Enter a valid isActive status",
    })
        .optional(),
    isDeleted: zod_1.z
        .boolean({
        error: "isDeleted must be a boolean",
    })
        .optional(),
    isVerified: zod_1.z
        .boolean({
        error: "isVerified must be a boolean",
    })
        .optional(),
    auth: zod_1.z
        .array(zod_1.z.object({
        provider: zod_1.z.enum(authProvider, {
            error: "Invalid auth provider",
        }),
        providerId: zod_1.z.string({ error: "providerId must be a string" }),
    }))
        .optional(),
});
exports.updateUserZodSchema = exports.createUserZodSchema
    .partial()
    .extend(updateOnlyUserFields.shape);
exports.loginUserZodSchema = exports.createUserZodSchema.pick({
    email: true,
    password: true,
});
exports.changePasswordZodSchema = zod_1.z.object({
    oldPassword: zod_1.z.string({
        error: ({ input }) => input ? "Old password must be string" : "Old password is required",
    }),
    newPassword: zod_1.z.string({
        error: ({ input }) => input ? "New password must be string" : "New password is required",
    }),
});
exports.resetPasswordZodSchema = zod_1.z.object({
    newPassword: zod_1.z.string({
        error: ({ input }) => input ? "New password must be string" : "New password is required",
    }),
    id: zod_1.z
        .string({
        error: ({ input }) => (input ? "ID must be string" : "ID is required"),
    })
        .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID format, enter a valid ID"),
});
