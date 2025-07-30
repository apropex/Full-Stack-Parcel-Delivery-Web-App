import { Router } from "express";
import passport from "passport";
import ENV from "../../../config/env.config";
import { authValidator } from "../../middleware/authValidator";
import { userAccessVerifier } from "../../middleware/userAccessVerifier";
import {
  changePasswordController,
  credentialLoginController,
  forgotPasswordController,
  getNewAccessTokenController,
  googleCallbackController,
  googleLoginUserController,
  resetPasswordController,
  setPasswordController,
  userLogoutController,
} from "./auth.controller";

const failureRedirect = `${ENV.FRONTEND_URL}/login?error=We are unable to log you in at the moment due to an issue with your account. Please try again shortly or reach out to our support team for assistance.`;

const authRoutes = Router();

// TODO: ADD ZOD VALIDATOR

authRoutes.post("/login", credentialLoginController);
authRoutes.post("/refresh-token", getNewAccessTokenController);
authRoutes.post("/logout", userLogoutController);

// -------------

authRoutes.post(
  "/change-password",
  userAccessVerifier,
  changePasswordController
);

authRoutes.post("/forgot-password", forgotPasswordController);

authRoutes.post("/reset-password", authValidator, resetPasswordController);

authRoutes.post("/set-password", userAccessVerifier, setPasswordController);

// -------------

authRoutes.get("/google", googleLoginUserController);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect }),
  googleCallbackController
);

export default authRoutes;
