import { JwtPayload } from "jsonwebtoken";
import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { setCookie } from "../../lib/cookie";
import { generateAllTokens } from "../../lib/jwt";
import { sendResponse } from "../../utils/sendResponse";
import {
  createUserService,
  getAllUsersService,
  getMeService,
  updateUserService,
} from "./user.service";

//
export const createUserController = catchAsync(async (req, res) => {
  const { data: user } = await createUserService(req.body);

  const { accessToken, refreshToken } = generateAllTokens(user);
  setCookie.allTokens(res, accessToken, refreshToken);

  sendResponse(res, {
    statusCode: sCode.CREATED,
    message: "User created successfully",
    data: user,
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
  const { data } = await getMeService(req.params?.userId || "");
  sendResponse(res, {
    statusCode: sCode.OK,
    message: "User retrieved successfully",
    data,
  });
});
