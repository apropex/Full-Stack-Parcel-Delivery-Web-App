import { Router } from "express";
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

//!   uploadImage.array("files"),
parcelRoutes.post("/create", createdParcelController);

parcelRoutes.patch("/update-parcel/parcelId", updateParcelController);

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
