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
exports.sendEmail = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ejs_1 = __importDefault(require("ejs"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const env_config_1 = __importDefault(require("../../config/env.config"));
const AppError_1 = require("../../errors/AppError");
const logger_1 = __importDefault(require("./logger"));
const SMTP = env_config_1.default.NODEMAILER;
const transporter = nodemailer_1.default.createTransport({
    host: SMTP.SMTP_HOST,
    port: SMTP.SMTP_PORT,
    secure: true,
    auth: {
        user: SMTP.SMTP_USER,
        pass: SMTP.SMTP_PASS,
    },
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, attachments, templateName, templateData, }) {
    try {
        const templatePath = path_1.default.resolve(__dirname, `templates/${templateName}.ejs`);
        const html = yield ejs_1.default.renderFile(templatePath, templateData);
        const info = yield transporter.sendMail({
            from: SMTP.SMTP_FROM,
            to,
            subject,
            html,
            attachments,
        });
        logger_1.default.info("Email sent successfully", { messageId: info.messageId });
    }
    catch (error) {
        logger_1.default.error("Email sending error", {
            error: error instanceof Error ? error.message : error,
        });
        throw new AppError_1.AppError(401, "Email sending failed");
    }
});
exports.sendEmail = sendEmail;
