import sCode from "../../../statusCode";
import { iReqQueryParams } from "../../global-interfaces";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { getPathsFromMulterFiles } from "../user/getPathsFromMulterFiles";
import {
  createdParcelService,
  deleteStatusLogService,
  getAllParcelService,
  getSingleParcelService,
  updateParcelService,
  updateParcelStatusLogsService,
  updateParcelStatusService,
} from "./parcel.service";

export const createdParcelController = catchAsync(async (req, res) => {
  if (req.body?.files) {
    req.body.images = getPathsFromMulterFiles(req.body.files);
  }
  const { data } = await createdParcelService(req.body);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel created successfully",
    data,
  });
});

//
export const updateParcelController = catchAsync(async (req, res) => {
  const { data } = await updateParcelService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel updated successfully",
    data,
  });
});

//
export const updateParcelStatusController = catchAsync(async (req, res) => {
  const { data } = await updateParcelStatusService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Updated parcel status successfully",
    data,
  });
});

//
export const updateParcelStatusLogsController = catchAsync(async (req, res) => {
  const { data } = await updateParcelStatusLogsService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Updated parcel status log successfully",
    data,
  });
});

//
export const getAllParcelController = catchAsync(async (req, res) => {
  const query = req.query as iReqQueryParams;
  const { data } = await getAllParcelService(query);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcels retrieved successfully",
    data,
  });
});

//
export const getSingleParcelController = catchAsync(async (req, res) => {
  const id = req.params.trackingId;
  const { data } = await getSingleParcelService(id);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel retrieved successfully",
    data,
  });
});

//
export const deleteStatusLogController = catchAsync(async (req, res) => {
  const { data } = await deleteStatusLogService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Deleted parcel status log successfully",
    data,
  });
});

//
