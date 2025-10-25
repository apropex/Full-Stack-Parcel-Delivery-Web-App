import { JwtPayload } from "jsonwebtoken";
import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  getAllUsersService,
  getMeService,
  getSingleUserService,
  updateUserService,
} from "./user.service";

//
export const createUserController = catchAsync(async (req, res) => {
  await createUserService(req.body);

  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "User created successfully",
    data: null,
  });
});

//
export const updateUserController = catchAsync(async (req, res) => {
  const { data } = await updateUserService(
    req.params.userId,
    req.body,
    req.decoded as JwtPayload
  );
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User updated successfully",
    data,
  });
});

//
export const getAllUsersController = catchAsync(async (req, res) => {
  const { data, meta } = await getAllUsersService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "All users retrieved successfully",
    data,
    meta,
  });
});

//
export const getMeController = catchAsync(async (req, res) => {
  const { data } = await getMeService(req.decoded?._id || "");
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User retrieved successfully",
    data,
  });
});

//
export const getSingleUserController = catchAsync(async (req, res) => {
  const param = req.params?.userId || "";
  let data = null;

  if (param.includes("@")) data = await getSingleUserService(param);
  else data = await getMeService(param);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User retrieved successfully",
    data: data ? data.data : data,
  });
});
