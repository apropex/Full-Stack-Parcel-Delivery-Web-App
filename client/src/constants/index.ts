//

export const ROLES = {
  ADMIN: "ADMIN",
  SENDER: "SENDER",
  RECEIVER: "RECEIVER",
  PUBLIC: "PUBLIC",
} as const;

export const ParcelTypes = {
  Document: "Document",
  Box: "Box",
  Fragile: "Fragile",
  Other: "Other",
} as const;
