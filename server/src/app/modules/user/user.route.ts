import { Router } from "express";
import { uploadImage } from "../../../config/cloudinary/multer.config";
import { authValidator } from "../../middleware/authValidator";
import { userRoleVerifier } from "../../middleware/userRoleVerifier";
import { zodBodyValidator } from "../../middleware/zodValidator";
import {
  createUserController,
  getAllUsersController,
  getMeController,
  getSingleUserController,
  updateUserController,
} from "./user.controller";
import { eUserRoles } from "./user.interface";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";

const { ADMIN, SENDER, RECEIVER } = eUserRoles;

const userRoutes = Router();

// TODO: ADD ZOD VALIDATOR

userRoutes.post("/register", zodBodyValidator(createUserZodSchema), createUserController);

userRoutes.get("/all-users", userRoleVerifier(ADMIN), getAllUsersController);

userRoutes.get("/me", authValidator, getMeController);

userRoutes.get("/:userId", userRoleVerifier(ADMIN, SENDER, RECEIVER), getSingleUserController);

userRoutes.patch(
  "/:userId",
  authValidator,
  uploadImage.single("file"),
  zodBodyValidator(updateUserZodSchema),
  updateUserController
);

export default userRoutes;
