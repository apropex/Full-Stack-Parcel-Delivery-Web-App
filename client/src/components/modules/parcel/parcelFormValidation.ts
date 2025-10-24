import { ParcelTypes } from "@/constants";
import z from "zod";

export const ParcelFormSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(100, "Title must be within 100 characters")
      .transform((val) => val.trim())
      .pipe(z.string().min(1, "Title cannot be empty or whitespaces only")),

    description: z
      .string()
      .max(1000, "Description must be within 1000 characters")
      .transform((val) => val.trim()),

    type: z.enum(Object.values(ParcelTypes), "Parcel type is required"),

    kilo: z.coerce
      .number<number>()
      .min(0, "Weight cannot be negative")
      .max(100, "Maximum weight is 100 kg")
      .int("Kilo must be a whole number")
      .transform((val) => Math.round(val * 100) / 100)
      .refine((val) => val >= 0.01 || val === 0, "Weight must be 0 or at least 0.01 kg"),

    gram: z.coerce
      .number<number>()
      .min(0, "Gram cannot be negative")
      .max(999, "Maximum gram is 999")
      .int("Gram must be a whole number"),

    pickupStreet: z
      .string()
      .min(1, "Pickup street address is required")
      .max(200, "Street address is too long")
      .transform((val) => val.trim()),
    pickupCity: z
      .string()
      .min(1, "Pickup city is required")
      .max(100, "City name is too long")
      .transform((val) => val.trim())
      .pipe(
        z.string().regex(/^[a-zA-Z\s\-'.]+$/, "City name contains invalid characters")
      ),
    pickupStateOrProvince: z
      .string()
      .min(1, "Pickup state/province is required")
      .max(100, "State/Province name is too long")
      .transform((val) => val.trim()),
    pickupPostalCode: z
      .string()
      .min(1, "Pickup postal code is required")
      .max(20, "Postal code is too long")
      .transform((val) => val.trim())
      .pipe(z.string().regex(/^[a-zA-Z0-9\s-]+$/, "Invalid postal code format")),
    pickupCountry: z
      .string()
      .min(1, "Pickup country is required")
      .transform((val) => val.trim()),

    deliveryStreet: z
      .string()
      .min(1, "Delivery street address is required")
      .max(200, "Street address is too long")
      .transform((val) => val.trim()),
    deliveryCity: z
      .string()
      .min(1, "Delivery city is required")
      .max(100, "City name is too long")
      .transform((val) => val.trim())
      .pipe(
        z.string().regex(/^[a-zA-Z\s\-'.]+$/, "City name contains invalid characters")
      ),
    deliveryStateOrProvince: z
      .string()
      .min(1, "Delivery state/province is required")
      .max(100, "State/Province name is too long")
      .transform((val) => val.trim()),
    deliveryPostalCode: z
      .string()
      .min(1, "Delivery postal code is required")
      .max(20, "Postal code is too long")
      .transform((val) => val.trim())
      .pipe(z.string().regex(/^[a-zA-Z0-9\s-]+$/, "Invalid postal code format")),
    deliveryCountry: z
      .string()
      .min(1, "Delivery country is required")
      .transform((val) => val.trim()),
  })
  .superRefine((data, ctx) => {
    const totalWeight = data.kilo + data.gram / 1000;
    if (totalWeight > 100) {
      ctx.addIssue({
        code: "custom",
        message: "Total weight cannot exceed 100 kg",
        path: ["kilo"],
      });
    }

    if (totalWeight <= 0) {
      ctx.addIssue({
        code: "custom",
        message: "Weight is required",
        path: ["kilo"],
      });
    }

    if (
      data.pickupStreet === data.deliveryStreet &&
      data.pickupCity === data.deliveryCity &&
      data.pickupPostalCode === data.deliveryPostalCode
    ) {
      ctx.addIssue({
        code: "custom",
        message: "Pickup and delivery address cannot be the same",
        path: ["deliveryStreet"],
      });
    }
  });

export type ParcelFormValues = z.infer<typeof ParcelFormSchema>;
