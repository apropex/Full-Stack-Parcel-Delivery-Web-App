import { z } from "zod";
import { eParcelStatus, eParcelTypes } from "./parcel.interface";

export const createParcelZodSchema = z.object({
  title: z
    .string({
      error: ({ input }) =>
        input === undefined ? "Title is required" : "Title must be a string",
    })
    .max(250, { error: "Title cannot exceed 250 characters" })
    .trim(),

  type: z.enum(Object.values(eParcelTypes) as [string, ...string[]], {
    error: `Parcel type must be in between ${Object.values(eParcelTypes).join(", ")}`,
  }),

  weight: z
    .number({
      error: ({ input }) =>
        input === undefined ? "Weight is required" : "Title must be a number",
    })
    .max(100, { error: `weight must less than 100 kg` }),

  pickupAddress: z.object({
    street: z
      .string({
        error: ({ input }) =>
          input === undefined
            ? "Street is required"
            : "Street must be a string",
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
          input === undefined
            ? "Post code is required"
            : "Post code must be a string",
      })
      .trim(),
    country: z
      .string({
        error: ({ input }) =>
          input === undefined
            ? "Country is required"
            : "Country must be a string",
      })
      .trim(),
  }),

  deliveryAddress: z.object({
    street: z
      .string({
        error: ({ input }) =>
          input === undefined
            ? "Street is required"
            : "Street must be a string",
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
          input === undefined
            ? "Post code is required"
            : "Post code must be a string",
      })
      .trim(),
    country: z
      .string({
        error: ({ input }) =>
          input === undefined
            ? "Country is required"
            : "Country must be a string",
      })
      .trim(),
  }),

  receiver: z
    .string({
      error: ({ input }) =>
        input === undefined
          ? "Receiver ID is required"
          : "Enter a valid receiver ID",
    })
    .trim(),
});

// ===========================

const updateOnlyParcelFields = z.object({
  rent: z.number({ error: "Parcel rent must a number" }).optional(),

  deletedImages: z.array(z.string()).optional(),

  isBlocked: z
    .boolean({
      error: "isBlocked must be a boolean",
    })
    .optional(),

  isCancelled: z
    .boolean({
      error: "isBlocked must be a boolean",
    })
    .optional(),

  estimatedDeliveryDate: z
    .string({
      error: "Date must be a string",
    })
    .trim()
    .optional(),

  deliveredAt: z
    .string({
      error: "Date must be a string",
    })
    .trim()
    .optional(),
});

export const updateParcelZodSchema = createParcelZodSchema
  .partial()
  .merge(updateOnlyParcelFields);

export const updateParcelStatusZodSchema = z.object({
  status: z
    .enum(Object.values(eParcelStatus) as [string, ...string[]], {
      error: `Parcel status must be in between ${Object.values(eParcelStatus).join(", ")}`,
    })
    .optional(),
  note: z.string({ error: "Note must be a string" }).optional(),
  updatedAt: z.string().optional(),
});
