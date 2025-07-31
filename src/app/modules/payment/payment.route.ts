import { Router } from "express";
import { userAccessVerifier } from "../../middleware/userAccessVerifier";
import {
  cancelPaymentController,
  failPaymentController,
  getInvoiceUrlController,
  repaymentController,
  successPaymentController,
} from "./payment.controller";

const paymentRoutes = Router();

paymentRoutes.post("/success", successPaymentController);
paymentRoutes.post("/fail", failPaymentController);
paymentRoutes.post("/cancel", cancelPaymentController);

paymentRoutes.post(
  "/repayment/:bookingId",
  userAccessVerifier,
  repaymentController
);

paymentRoutes.get(
  "/invoice/:paymentId",
  userAccessVerifier,
  getInvoiceUrlController
);

export default paymentRoutes;
