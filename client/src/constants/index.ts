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

export const ParcelStatus = {
  Requested: "Requested",
  Approved: "Approved",
  Dispatched: "Dispatched",
  In_Transit: "In_Transit",
  Delivered: "Delivered",
  Received: "Received",
  Cancelled: "Cancelled",
  Blocked: "Blocked",
} as const;
