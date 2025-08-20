import fs from "fs";
import path from "path";
import { createLogger, format, transports } from "winston";

const logDir = path.join(__dirname, "../../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${
      Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
    }`;
  })
);

const logger = createLogger({
  level: "silly",
  format: logFormat,
  transports: [
    new transports.Console({
      level: "silly",
    }),
    new transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new transports.File({
      filename: path.join(logDir, "combined.log"),
      level: "silly",
    }),
  ],
});

export default logger;
