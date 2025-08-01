"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const env_config_1 = __importDefault(require("../../../config/env.config"));
const authValidator_1 = require("../../middleware/authValidator");
const userAccessVerifier_1 = require("../../middleware/userAccessVerifier");
const zodValidator_1 = require("../../middleware/zodValidator");
const user_validation_1 = require("../user/user.validation");
const auth_controller_1 = require("./auth.controller");
const failureRedirect = `${env_config_1.default.FRONTEND_URL}/login?error=We are unable to log you in at the moment due to an issue with your account. Please try again shortly or reach out to our support team for assistance.`;
const authRoutes = (0, express_1.Router)();
authRoutes.post("/login", (0, zodValidator_1.zodBodyValidator)(user_validation_1.loginUserZodSchema), auth_controller_1.credentialLoginController);
authRoutes.post("/logout", auth_controller_1.userLogoutController);
authRoutes.post("/refresh-token", auth_controller_1.getNewAccessTokenController);
// -------------
authRoutes.post("/change-password", userAccessVerifier_1.userAccessVerifier, (0, zodValidator_1.zodBodyValidator)(user_validation_1.changePasswordZodSchema), auth_controller_1.changePasswordController);
authRoutes.post("/forgot-password", auth_controller_1.forgotPasswordController);
authRoutes.post("/reset-password", authValidator_1.authValidator, (0, zodValidator_1.zodBodyValidator)(user_validation_1.resetPasswordZodSchema), auth_controller_1.resetPasswordController);
authRoutes.post("/set-password", userAccessVerifier_1.userAccessVerifier, auth_controller_1.setPasswordController);
// -------------
authRoutes.get("/google", auth_controller_1.googleLoginUserController);
authRoutes.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect }), auth_controller_1.googleCallbackController);
exports.default = authRoutes;
