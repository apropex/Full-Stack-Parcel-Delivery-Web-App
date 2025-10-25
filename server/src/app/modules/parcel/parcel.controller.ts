import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  cancelParcelService,
  confirmParcelService,
  createdParcelService,
  deleteSingleParcelService,
  deleteStatusLogService,
  getAllParcelService,
  getMyParcelService,
  getSingleParcelService,
  getSingleParcelStatusLogsService,
  incomingParcelService,
  updateParcelService,
  updateParcelStatusLogsService,
  updateParcelStatusService,
} from "./parcel.service";

export const createdParcelController = catchAsync(async (req, res) => {
  const { data } = await createdParcelService(req);

  sendResponse(res, {
    statusCode: sCode.CREATED,
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
  const { data, meta } = await getAllParcelService(req.query);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcels retrieved successfully",
    data,
    meta,
  });
});

//
export const getSingleParcelController = catchAsync(async (req, res) => {
  const id = req.params.parcelId || "";
  const { data } = await getSingleParcelService(id);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel retrieved successfully",
    data,
  });
});

export const getSingleParcelStatusLogsController = catchAsync(async (req, res) => {
  const id = req.params.parcelId || "";
  const { data } = await getSingleParcelStatusLogsService(id);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel status-logs retrieved successfully",
    data,
  });
});

//
export const getMyParcelController = catchAsync(async (req, res) => {
  const id = req.decoded?._id || "";
  const { data, meta } = await getMyParcelService(id, req.query);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel retrieved successfully",
    data,
    meta,
  });
});

//
export const incomingParcelController = catchAsync(async (req, res) => {
  const id = req.decoded?._id || "";
  const { data, meta } = await incomingParcelService(id, req.query);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Parcel retrieved successfully",
    data,
    meta,
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
export const deleteSingleParcelController = catchAsync(async (req, res) => {
  const { data } = await deleteSingleParcelService(req.params?.parcelId || "");

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Deleted the parcel successfully",
    data,
  });
});
