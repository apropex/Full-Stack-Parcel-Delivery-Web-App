import sCode from "../../../statusCode";
import { iReqQueryParams } from "../../global-interfaces";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { getPathsFromMulterFiles } from "../user/getPathsFromMulterFiles";
import {
  cancelParcelService,
  confirmParcelService,
  createdParcelService,
  deleteStatusLogService,
  getAllParcelService,
  getMyParcelService,
  getSingleParcelService,
  incomingParcelService,
  updateParcelService,
  updateParcelStatusLogsService,
  updateParcelStatusService,
} from "./parcel.service";

export const createdParcelController = catchAsync(async (req, res) => {
  if (req.body?.files) {
    const files = getPathsFromMulterFiles(req.body.files);
    if (files.length > 0) req.body.images = files;
  }

  const { data, meta } = await createdParcelService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel created successfully",
    data,
    meta,
  });
});

//
export const updateParcelController = catchAsync(async (req, res) => {
  if (req.body?.files) {
    const files = getPathsFromMulterFiles(req.body.files);
    if (files.length > 0) req.body.images = files;
  }

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
export const cancelParcelController = catchAsync(async (req, res) => {
  const { data } = await cancelParcelService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel cancelled successfully",
    data,
  });
});

//
export const confirmParcelController = catchAsync(async (req, res) => {
  const { data } = await confirmParcelService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel confirmed successfully",
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
export const getMyParcelController = catchAsync(async (req, res) => {
  const id = req.decoded?._id || "";
  const { data } = await getMyParcelService(id);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel retrieved successfully",
    data,
  });
});

//
export const incomingParcelController = catchAsync(async (req, res) => {
  const id = req.decoded?._id || "";
  const { data } = await incomingParcelService(id);

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
