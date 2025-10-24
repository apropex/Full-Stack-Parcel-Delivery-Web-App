import { Router } from "express";
import passport from "passport";
import ENV from "../../../config/env.config";
import { authValidator } from "../../middleware/authValidator";
import { userAccessVerifier } from "../../middleware/userAccessVerifier";
import { zodBodyValidator } from "../../middleware/zodValidator";
import {
  changePasswordZodSchema,
  loginUserZodSchema,
  resetPasswordZodSchema,
} from "../user/user.validation";
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

authRoutes.post(
  "/login",
  zodBodyValidator(loginUserZodSchema),
  credentialLoginController
);

authRoutes.post("/logout", userLogoutController);

authRoutes.post("/refresh-token", getNewAccessTokenController);

// -------------

authRoutes.post(
  "/change-password",
  userAccessVerifier,
  zodBodyValidator(changePasswordZodSchema),
  changePasswordController
);

authRoutes.post("/forgot-password", forgotPasswordController);

authRoutes.post(
  "/reset-password",
  authValidator,
  zodBodyValidator(resetPasswordZodSchema),
  resetPasswordController
);

authRoutes.post("/set-password", userAccessVerifier, setPasswordController);

// -------------

authRoutes.get("/google", googleLoginUserController);
authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect }),
  googleCallbackController
);

export default authRoutes;
