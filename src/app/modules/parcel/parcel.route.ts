import { Router } from "express";
import { authValidator } from "../../middleware/authValidator";
import { userRoleVerifier } from "../../middleware/userRoleVerifier";
import { zodBodyValidator } from "../../middleware/zodValidator";
import { eUserRoles } from "../user/user.interface";
import {
  cancelParcelController,
  confirmParcelController,
  createdParcelController,
  deleteSingleParcelController,
  deleteStatusLogController,
  getAllParcelController,
  getMyParcelController,
  getSingleParcelController,
  incomingParcelController,
  updateParcelController,
  updateParcelStatusController,
  updateParcelStatusLogsController,
} from "./parcel.controller";
import {
  createParcelZodSchema,
  updateParcelStatusZodSchema,
  updateParcelZodSchema,
} from "./parcel.validation";

const { ADMIN } = eUserRoles;

const parcelRoutes = Router();

parcelRoutes.post(
  "/create",
  authValidator,
  zodBodyValidator(createParcelZodSchema),
  createdParcelController
);

parcelRoutes.patch(
  "/update-parcel/:parcelId",
  authValidator,
  zodBodyValidator(updateParcelZodSchema),
  updateParcelController
);

parcelRoutes.patch(
  "/update-parcel-status/:parcelId",
  userRoleVerifier(ADMIN),
  zodBodyValidator(updateParcelStatusZodSchema),
  updateParcelStatusController
);

parcelRoutes.patch(
  "/update-parcel-status-log/:parcelId",
  userRoleVerifier(ADMIN),
  zodBodyValidator(updateParcelStatusZodSchema),
  updateParcelStatusLogsController
);

parcelRoutes.patch(
  "/cancel/:parcelId",
  authValidator,
  zodBodyValidator(updateParcelStatusZodSchema),
  cancelParcelController
);

parcelRoutes.patch(
  "/confirm/:parcelId",
  authValidator,
  zodBodyValidator(updateParcelStatusZodSchema),
  confirmParcelController
);

parcelRoutes.get(
  "/all-parcels",
  userRoleVerifier(ADMIN),
  getAllParcelController
);

parcelRoutes.get("/my-parcels", authValidator, getMyParcelController);

parcelRoutes.get("/incoming-parcels", authValidator, incomingParcelController);

parcelRoutes.get("/:parcelId", authValidator, getSingleParcelController);

parcelRoutes.delete(
  "/status/:parcelId",
  userRoleVerifier(ADMIN),
  deleteStatusLogController
);

parcelRoutes.delete(
  "/:parcelId",
  userRoleVerifier(ADMIN),
  deleteSingleParcelController
);

export default parcelRoutes;
