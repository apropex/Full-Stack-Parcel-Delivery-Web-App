import PDFDocument from "pdfkit";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import logger from "./logger";

export interface InvoiceData {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  parcelTitle: string;
  trackingId: string;
  pickupDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  pickupAddress: string;
  parcelType: string;
  weight: number;
  rent: number;
  paymentMethod: string;
  TrxId: string;
}

export const generatePdf = async (data: InvoiceData): Promise<Buffer> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const buffers: Uint8Array[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", (err) => reject(err));

      // HEADER
      doc
        .fontSize(22)
        .fillColor("#1F2937")
        .text("Happy Parcel Picker", { align: "center", underline: true })
        .moveDown(0.5)
        .fontSize(16)
        .fillColor("#4B5563")
        .text("Invoice", { align: "center" })
        .moveDown();

      // Section Title
      const sectionTitle = (title: string) => {
        doc
          .moveDown(0.5)
          .fontSize(13)
          .fillColor("#111827")
          .text(title, { underline: true })
          .moveDown(0.2);
      };

      // Key-Value Pair Renderer
      const renderRow = (label: string, value: string | number) => {
        doc
          .fontSize(11)
          .fillColor("#1F2937")
          .text(`${label}: `, { continued: true })
          .fillColor("#374151")
          .text(String(value));
      };

      // Sender Info
      sectionTitle("Sender Information");
      renderRow("Name", data.senderName);
      renderRow("Email", data.senderEmail);
      renderRow("Phone", data.senderPhone);

      // Receiver Info
      sectionTitle("Receiver Information");
      renderRow("Name", data.receiverName);
      renderRow("Email", data.receiverEmail);
      renderRow("Phone", data.receiverPhone);

      // Parcel Info
      sectionTitle("Parcel Details");
      renderRow("Parcel Title", data.parcelTitle);
      renderRow("Tracking ID", data.trackingId);
      renderRow("Parcel Type", data.parcelType);
      renderRow("Weight (kg)", data.weight);
      renderRow("Pickup Address", data.pickupAddress);
      renderRow("Delivery Address", data.deliveryAddress);
      renderRow("Pickup Date", data.pickupDate);
      renderRow("Delivery Date", data.deliveryDate);

      // Payment Info
      sectionTitle("Payment Information");
      renderRow("Payment Method", data.paymentMethod);
      renderRow("Amount (Rent)", `$${data.rent.toFixed(2)}`);
      renderRow("Transaction ID", data.TrxId);

      // Footer
      doc
        .moveDown(2)
        .fontSize(11)
        .fillColor("#6B7280")
        .text(
          "Thank you for using Happy Parcel Picker! If you have any questions, please contact our support team.",
          { align: "center" }
        )
        .moveDown(0.5)
        .text("Safe delivery is our top priority.", { align: "center" });

      // Finalize
      doc.end();
    });
  } catch (error) {
    logger.error("PDF creation error", {
      error: error instanceof Error ? error.message : error,
    });
    throw new AppError(sCode.BAD_REQUEST, "PDF creation error");
  }
};
