"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusZodSchema = exports.updateParcelZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = require("zod");
const parcel_interface_1 = require("./parcel.interface");
exports.createParcelZodSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: ({ input }) => input === undefined ? "Title is required" : "Title must be a string",
    })
        .max(250, { error: "Title cannot exceed 250 characters" })
        .trim(),
    type: zod_1.z.enum(Object.values(parcel_interface_1.eParcelTypes), {
        error: `Parcel type must be in between ${Object.values(parcel_interface_1.eParcelTypes).join(", ")}`,
    }),
    weight: zod_1.z
        .number({
        error: ({ input }) => input === undefined ? "Weight is required" : "Title must be a number",
    })
        .max(100, { error: `weight must less than 100 kg` }),
    pickupAddress: zod_1.z.object({
        street: zod_1.z
            .string({
            error: ({ input }) => input === undefined
                ? "Street is required"
                : "Street must be a string",
        })
            .trim(),
        stateOrProvince: zod_1.z
            .string({
            error: ({ input }) => input === undefined ? "State is required" : "State must be a string",
        })
            .trim(),
        city: zod_1.z
            .string({
            error: ({ input }) => input === undefined ? "City is required" : "City must be a string",
        })
            .trim(),
        postalCode: zod_1.z
            .string({
            error: ({ input }) => input === undefined
                ? "Post code is required"
                : "Post code must be a string",
        })
            .trim(),
        country: zod_1.z
            .string({
            error: ({ input }) => input === undefined
                ? "Country is required"
                : "Country must be a string",
        })
            .trim(),
    }),
    deliveryAddress: zod_1.z.object({
        street: zod_1.z
            .string({
            error: ({ input }) => input === undefined
                ? "Street is required"
                : "Street must be a string",
        })
            .trim(),
        stateOrProvince: zod_1.z
            .string({
            error: ({ input }) => input === undefined ? "State is required" : "State must be a string",
        })
            .trim(),
        city: zod_1.z
            .string({
            error: ({ input }) => input === undefined ? "City is required" : "City must be a string",
        })
            .trim(),
        postalCode: zod_1.z
            .string({
            error: ({ input }) => input === undefined
                ? "Post code is required"
                : "Post code must be a string",
        })
            .trim(),
        country: zod_1.z
            .string({
            error: ({ input }) => input === undefined
                ? "Country is required"
                : "Country must be a string",
        })
            .trim(),
    }),
    receiver: zod_1.z
        .string({
        error: ({ input }) => input === undefined
            ? "Receiver ID is required"
            : "Enter a valid receiver ID",
    })
        .trim(),
});
// ===========================
const updateOnlyParcelFields = zod_1.z.object({
    rent: zod_1.z.number({ error: "Parcel rent must a number" }).optional(),
    deletedImages: zod_1.z.array(zod_1.z.string()).optional(),
    isBlocked: zod_1.z
        .boolean({
        error: "isBlocked must be a boolean",
    })
        .optional(),
    isCancelled: zod_1.z
        .boolean({
        error: "isBlocked must be a boolean",
    })
        .optional(),
    estimatedDeliveryDate: zod_1.z
        .string({
        error: "Date must be a string",
    })
        .trim()
        .optional(),
    deliveredAt: zod_1.z
        .string({
        error: "Date must be a string",
    })
        .trim()
        .optional(),
});
exports.updateParcelZodSchema = exports.createParcelZodSchema
    .partial()
    .merge(updateOnlyParcelFields);
exports.updateParcelStatusZodSchema = zod_1.z.object({
    status: zod_1.z
        .enum(Object.values(parcel_interface_1.eParcelStatus), {
        error: `Parcel status must be in between ${Object.values(parcel_interface_1.eParcelStatus).join(", ")}`,
    })
        .optional(),
    note: zod_1.z.string({ error: "Note must be a string" }).optional(),
    updatedAt: zod_1.z.string().optional(),
});
