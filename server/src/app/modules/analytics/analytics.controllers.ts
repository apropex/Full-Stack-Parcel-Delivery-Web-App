import { Request, Response } from "express";
import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import * as analyticsService from "./analytics.services";

// Get all dashboard analytics summary

export const getDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const data = await analyticsService.getDashboardAnalytics();

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Dashboard analytics fetched successfully",
    data,
  });
});
