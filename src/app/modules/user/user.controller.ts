import { JwtPayload } from "jsonwebtoken";
import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  getAllUsersService,
  getMeService,
  updateUserService,
} from "./user.service";

//
export const createUserController = catchAsync(async (req, res) => {
  const { data } = await createUserService(req.body);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
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
    message: "",
    data,
  });
});

//
export const getAllUsersController = catchAsync(async (req, res) => {
  const { data, meta } = await getAllUsersService();
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
    meta,
  });
});

//
export const getMeController = catchAsync(async (req, res) => {
  const { data } = await getMeService(req.params.userId);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});

//
export const getSingleUserController = catchAsync(async (req, res) => {
  const { data } = await getMeService(req.params.userId);
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "",
    data,
  });
});
