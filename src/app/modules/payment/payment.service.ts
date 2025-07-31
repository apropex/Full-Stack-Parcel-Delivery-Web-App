import { Request } from "express";
import { uploadBufferToCloud } from "../../../config/cloudinary/uploadBufferToCloud";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { PAYMENT_MESSAGES } from "../../constants/messages";
import { ePaymentStatus } from "../../global-interfaces";
import { InvoiceData } from "../../lib/invoice";
import { transactionRollback } from "../../lib/transactionRollback";
import { formatDate } from "../../utils/formatDate";
import { mongoIdValidator } from "../../utils/mongoIdValidator";
import { sendBookingInvoice } from "../../utils/sendParcelInvoice";
import { ParcelWithRelations } from "../parcel/parcel.interface";
import { Parcel } from "../parcel/parcel.model";
import { iSSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { sslPaymentInit } from "../sslCommerz/sslCommerz.service";
import { iUser } from "../user/user.interface";
import { iPayment } from "./payment.interface";
import { Payment } from "./payment.model";

interface UpdateStatusParams {
  TrxID: string;
  paymentStatus: ePaymentStatus;
  success: boolean;
  message: string;
  paymentInfo?: object;
}

interface BuildInvoiceParams {
  parcel: ParcelWithRelations;
  payment: iPayment;
  sender: iUser;
  receiver: iUser;
}

const buildInvoiceData = ({
  parcel,
  payment,
  sender,
  receiver,
}: BuildInvoiceParams): InvoiceData => {
  const {
    street: dStreet,
    city: dCity,
    stateOrProvince: dState,
    postalCode: dPost,
    country: dCountry,
  } = parcel.deliveryAddress;

  const {
    street: pStreet,
    city: pCity,
    stateOrProvince: pState,
    postalCode: pPost,
    country: pCountry,
  } = parcel.pickupAddress;

  const deliveryAddress = `${dStreet}, ${dCity}, ${dState}, ${dPost}, ${dCountry}`;
  const pickupAddress = `${pStreet}, ${pCity}, ${pState}, ${pPost}, ${pCountry}`;

  return {
    senderName: `${sender.name.firstName} ${sender.name.lastName}`,
    senderEmail: sender.email,
    senderPhone: sender.phone ?? "",
    receiverName: `${receiver.name.firstName} ${receiver.name.lastName}`,
    receiverEmail: receiver.email,
    receiverPhone: receiver.phone ?? "",
    parcelTitle: parcel.title,
    trackingId: parcel.trackingId,
    pickupDate: formatDate(parcel.createdAt),
    deliveryDate: formatDate(parcel.estimatedDeliveryDate),
    deliveryAddress,
    pickupAddress,
    parcelType: parcel.type,
    weight: parcel.weight,
    rent: parcel.rent,
    paymentMethod: payment.paymentInfo?.card_type ?? "N/A",
    TrxId: payment.TrxID,
  };
};

const processPaymentStatusUpdate = async ({
  TrxID,
  paymentStatus,
  success,
  message,
  paymentInfo = {},
}: UpdateStatusParams) => {
  return await transactionRollback(async (session) => {
    // 1. Update payment by TrxID
    const payment = await Payment.findOneAndUpdate(
      { TrxID },
      { status: paymentStatus, paymentInfo },
      { new: true }
    ).session(session);

    if (!payment) throw new AppError(404, "Payment not found");

    // 2. Update parcel paymentStatus and populate sender & receiver
    const parcel = (await Parcel.findByIdAndUpdate(
      payment.parcel,
      { paymentStatus },
      { new: true, session }
    )
      .populate<{ sender: iUser }>("sender", "name email phone")
      .populate<{ receiver: iUser }>(
        "receiver",
        "name email phone"
      )) as unknown as ParcelWithRelations;

    if (!parcel) throw new AppError(404, "Parcel not found");

    const { sender, receiver } = parcel;

    if (!sender || !receiver) {
      throw new AppError(404, "Sender or receiver data is incomplete");
    }

    // 3. If payment was successful, generate and store invoice
    if (success) {
      const invoiceData = buildInvoiceData({
        parcel,
        payment,
        sender,
        receiver,
      });

      const pdfBuffer = await sendBookingInvoice(sender.email, invoiceData);
      const uploadResult = await uploadBufferToCloud(pdfBuffer, "invoice");

      payment.invoiceUrl = uploadResult?.secure_url ?? "";
      await payment.save();
    }

    return { success, message };
  });
};

interface UpdateStatusParams {
  TrxID: string;
  paymentStatus: ePaymentStatus;
  success: boolean;
  message: string;
  paymentInfo?: object;
}

export const successPaymentService = async (req: Request) => {
  return await processPaymentStatusUpdate({
    TrxID: (req.query?.TrxID as string) || "",
    paymentInfo: req.body,
    paymentStatus: ePaymentStatus.PAID,
    success: true,
    message: PAYMENT_MESSAGES.SUCCESS,
  });
};

export const failPaymentService = async (TrxID: string) => {
  return await processPaymentStatusUpdate({
    TrxID,
    paymentStatus: ePaymentStatus.FAILED,
    success: false,
    message: PAYMENT_MESSAGES.FAILED,
  });
};

export const cancelPaymentService = async (TrxID: string) => {
  return await processPaymentStatusUpdate({
    TrxID,
    paymentStatus: ePaymentStatus.CANCELED,
    success: false,
    message: PAYMENT_MESSAGES.CANCELED,
  });
};

export const repaymentService = async (req: Request) => {
  const id = mongoIdValidator(req.params?.parcelId || "");
  const decoded = req.decoded;

  if (!decoded) throw new AppError(sCode.UNAUTHORIZED, "Unauthorized");

  const payment = await Payment.findOne({ parcel: id });

  if (!payment) {
    throw new AppError(
      sCode.NOT_FOUND,
      "Payment not found. Please create a parcel"
    );
  }

  const sslPayload = {
    rent: payment.rent,
    TrxID: payment.TrxID,
    name: decoded.name,
    email: decoded.email,
    phone: decoded.phone,
    address: decoded.address,
  } as iSSLCommerz;

  const sslPayment = await sslPaymentInit(sslPayload);

  return {
    options: { paymentURL: sslPayment?.GatewayPageURL },
    message: "SSL payment url arrived successfully",
  };
};

export const getInvoiceUrlService = async (paymentId: string) => {
  const id = mongoIdValidator(paymentId);
  const payment = await Payment.findById(id).select("+invoiceUrl");

  if (!payment) throw new AppError(sCode.NOT_FOUND, "Payment not found");
  if (!payment.invoiceUrl)
    throw new AppError(sCode.NOT_FOUND, "Payment not found");

  return { data: payment };
  //
};
