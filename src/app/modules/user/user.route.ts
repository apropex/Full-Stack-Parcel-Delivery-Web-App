import { Router } from "express";
import { authValidator } from "../../middleware/authValidator";
import { userRoleVerifier } from "../../middleware/userRoleVerifier";
import {
  createUserController,
  getAllUsersController,
  getMeController,
  getSingleUserController,
  updateUserController,
} from "./user.controller";
import { eUserRoles } from "./user.interface";

const { ADMIN } = eUserRoles;

const userRoutes = Router();

// TODO: ADD ZOD VALIDATOR

userRoutes.post("/register", createUserController);

userRoutes.get("/all-users", userRoleVerifier(ADMIN), getAllUsersController);

userRoutes.get("/me", authValidator, getMeController);

userRoutes.get("/:userId", userRoleVerifier(ADMIN), getSingleUserController);

userRoutes.patch("/:userId", authValidator, updateUserController);

export default userRoutes;
