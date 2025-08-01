"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authValidator_1 = require("../../middleware/authValidator");
const userRoleVerifier_1 = require("../../middleware/userRoleVerifier");
const zodValidator_1 = require("../../middleware/zodValidator");
const user_controller_1 = require("./user.controller");
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const { ADMIN } = user_interface_1.eUserRoles;
const userRoutes = (0, express_1.Router)();
// TODO: ADD ZOD VALIDATOR
userRoutes.post("/register", (0, zodValidator_1.zodBodyValidator)(user_validation_1.createUserZodSchema), user_controller_1.createUserController);
userRoutes.get("/all-users", (0, userRoleVerifier_1.userRoleVerifier)(ADMIN), user_controller_1.getAllUsersController);
userRoutes.get("/me", authValidator_1.authValidator, user_controller_1.getMeController);
userRoutes.get("/:userId", (0, userRoleVerifier_1.userRoleVerifier)(ADMIN), user_controller_1.getSingleUserController);
userRoutes.patch("/:userId", authValidator_1.authValidator, (0, zodValidator_1.zodBodyValidator)(user_validation_1.updateUserZodSchema), user_controller_1.updateUserController);
exports.default = userRoutes;
