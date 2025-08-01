"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const notFound_1 = require("./app/middleware/notFound");
const env_config_1 = __importDefault(require("./config/env.config"));
const routes_1 = require("./routes");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: env_config_1.default.FRONTEND_URL,
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: env_config_1.default.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ROUTES
app.use("/api/v1", routes_1.router);
// ROOT ROUTES
app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to PH Tour Management Server" });
});
// Global Error Handler
app.use(globalErrorHandler_1.default);
// Not Found handler
app.use(notFound_1.notFound);
exports.default = app;
