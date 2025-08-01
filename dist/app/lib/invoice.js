"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePdf = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const logger_1 = __importDefault(require("./logger"));
const generatePdf = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ size: "A4", margin: 50 });
            const buffers = [];
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
            const sectionTitle = (title) => {
                doc
                    .moveDown(0.5)
                    .fontSize(13)
                    .fillColor("#111827")
                    .text(title, { underline: true })
                    .moveDown(0.2);
            };
            // Key-Value Pair Renderer
            const renderRow = (label, value) => {
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
                .text("Thank you for using Happy Parcel Picker! If you have any questions, please contact our support team.", { align: "center" })
                .moveDown(0.5)
                .text("Safe delivery is our top priority.", { align: "center" });
            // Finalize
            doc.end();
        });
    }
    catch (error) {
        logger_1.default.error("PDF creation error", {
            error: error instanceof Error ? error.message : error,
        });
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "PDF creation error");
    }
});
exports.generatePdf = generatePdf;
