import ENV from "../../../config/env.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { catchAsync } from "../../lib/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import {
  cancelPaymentService,
  failPaymentService,
  getInvoiceUrlService,
  repaymentService,
  successPaymentService,
} from "./payment.service";

const SSL = ENV.SSL;

export const successPaymentController = catchAsync(async (req, res) => {
  const { TrxID, rent, status } = req.query;
  if (!TrxID || !rent || !status) {
    throw new AppError(
      sCode.NOT_FOUND,
      "Missing success payment request params"
    );
  }

  const { message } = await successPaymentService(req);

  const url = `${SSL.SUCCESS_CLIENT_URL}?TrxID=${TrxID}&rent=${rent}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const failPaymentController = catchAsync(async (req, res) => {
  const { TrxID, rent, status } = req.query;
  if (!TrxID || !rent || !status) {
    throw new AppError(sCode.NOT_FOUND, "Missing fail payment request params");
  }
  const { message } = await failPaymentService(TrxID as string);

  const url = `${SSL.FAIL_CLIENT_URL}?TrxID=${TrxID}&rent=${rent}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const cancelPaymentController = catchAsync(async (req, res) => {
  const { TrxID, rent, status } = req.query;
  if (!TrxID || !rent || !status) {
    throw new AppError(
      sCode.NOT_FOUND,
      "Missing cancel payment request params"
    );
  }

  const { message } = await cancelPaymentService(TrxID as string);

  const url = `${SSL.CANCEL_CLIENT_URL}?TrxID=${TrxID}&rent=${rent}&status=${status}&message=${message}`;

  res.redirect(url);
});

//
export const repaymentController = catchAsync(async (req, res) => {
  const { options, message } = await repaymentService(req);

  sendResponse(res, {
    statusCode: sCode.OK,
    message: message,
    data: null,
    meta: { options },
  });
});

//
export const getInvoiceUrlController = catchAsync(async (req, res) => {
  const { data } = await getInvoiceUrlService(req.params?.paymentId || "");

  sendResponse(res, {
    statusCode: sCode.OK,
    message: "Updated invoice URL successfully",
    data,
  });
});
