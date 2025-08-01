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
exports.sendBookingInvoice = void 0;
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const invoice_1 = require("../lib/invoice");
const sendEmail_1 = require("../lib/sendEmail");
const sendBookingInvoice = (email, data) => __awaiter(void 0, void 0, void 0, function* () {
    const pdfBuffer = yield (0, invoice_1.generatePdf)(data);
    if (!pdfBuffer) {
        throw new AppError_1.AppError(statusCode_1.default.EXPECTATION_FAILED, "Failed to generate PDF buffer");
    }
    yield (0, sendEmail_1.sendEmail)({
        to: email,
        subject: "Your booking invoice",
        templateName: "invoice",
        templateData: data,
        attachments: [
            {
                filename: "invoice.pdf",
                content: pdfBuffer !== null && pdfBuffer !== void 0 ? pdfBuffer : Buffer.from(""),
                contentType: "application/pdf",
            },
        ],
    });
    return pdfBuffer;
});
exports.sendBookingInvoice = sendBookingInvoice;
