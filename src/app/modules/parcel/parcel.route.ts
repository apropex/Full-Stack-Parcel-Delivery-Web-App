import { Router } from "express";
import { uploadImage } from "../../../config/cloudinary/multer.config";
import {
  createdParcelController,
  deleteStatusLogController,
  getAllParcelController,
  getSingleParcelController,
  updateParcelController,
  updateParcelStatusController,
  updateParcelStatusLogsController,
} from "./parcel.controller";

const parcelRoutes = Router();

parcelRoutes.post(
  "/create",
  uploadImage.array("files"),
  createdParcelController
);

parcelRoutes.patch(
  "/update-parcel/parcelId",
  uploadImage.array("files"),
  updateParcelController
);

parcelRoutes.patch(
  "/update-parcel-status/parcelId",
  updateParcelStatusController
);

parcelRoutes.patch(
  "/update-parcel-status-log/parcelId",
  updateParcelStatusLogsController
);

parcelRoutes.get("/all-parcels", getAllParcelController);

parcelRoutes.get("/parcel", getSingleParcelController);

parcelRoutes.delete("/delete-parcel", deleteStatusLogController);

export default parcelRoutes;
