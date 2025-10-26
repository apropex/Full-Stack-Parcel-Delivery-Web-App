import { Router } from "express";
import { userRoleVerifier } from "../../middleware/userRoleVerifier";
import { eUserRoles } from "../user/user.interface";
import { getDashboardAnalytics } from "./analytics.controllers";

const { ADMIN } = eUserRoles;

const analyticsRoutes = Router();

analyticsRoutes.get("/summary", userRoleVerifier(ADMIN), getDashboardAnalytics);

export default analyticsRoutes;
