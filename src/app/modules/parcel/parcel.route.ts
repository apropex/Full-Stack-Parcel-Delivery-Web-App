import { Router } from "express";
import { uploadImage } from "../../../config/cloudinary/multer.config";
import { userAccessVerifier } from "../../middleware/userAccessVerifier";
import { userRoleVerifier } from "../../middleware/userRoleVerifier";
import { zodBodyValidator } from "../../middleware/zodValidator";
import { eUserRoles } from "../user/user.interface";
import {
  cancelParcelController,
  confirmParcelController,
  createdParcelController,
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

const { MODERATOR, ADMIN, SUPER_ADMIN } = eUserRoles;

const parcelRoutes = Router();

parcelRoutes.post(
  "/create",
  userAccessVerifier,
  uploadImage.array("files"),
  zodBodyValidator(createParcelZodSchema),
  createdParcelController
);

parcelRoutes.patch(
  "/update-parcel/:parcelId",
  userAccessVerifier,
  uploadImage.array("files"),
  zodBodyValidator(updateParcelZodSchema),
  updateParcelController
);

parcelRoutes.patch(
  "/update-parcel-status/:parcelId",
  userRoleVerifier(ADMIN, SUPER_ADMIN, MODERATOR),
  zodBodyValidator(updateParcelStatusZodSchema),
  updateParcelStatusController
);

parcelRoutes.patch(
  "/cancel/:parcelId",
  userAccessVerifier,
  zodBodyValidator(updateParcelStatusZodSchema),
  cancelParcelController
);

parcelRoutes.patch(
  "/confirm/:parcelId",
  userAccessVerifier,
  zodBodyValidator(updateParcelStatusZodSchema),
  confirmParcelController
);

parcelRoutes.patch(
  "/update-parcel-status-log/:parcelId",
  userAccessVerifier,
  zodBodyValidator(updateParcelStatusZodSchema),
  updateParcelStatusLogsController
);

parcelRoutes.get(
  "/all-parcels",
  userRoleVerifier(MODERATOR, ADMIN, SUPER_ADMIN),
  getAllParcelController
);

parcelRoutes.get("/my-parcel", userAccessVerifier, getMyParcelController);

parcelRoutes.get(
  "/incoming-parcel",
  userAccessVerifier,
  incomingParcelController
);

parcelRoutes.get("/:parcelId", userAccessVerifier, getSingleParcelController);

parcelRoutes.delete(
  "/delete-parcel/:parcelId",
  userRoleVerifier(MODERATOR, ADMIN, SUPER_ADMIN),
  deleteStatusLogController
);

export default parcelRoutes;
