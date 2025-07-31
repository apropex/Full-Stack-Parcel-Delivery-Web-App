import { Router } from "express";
import authRoutes from "../app/modules/auth/auth.route";
import parcelRoutes from "../app/modules/parcel/parcel.route";
import paymentRoutes from "../app/modules/payment/payment.route";
import userRoutes from "../app/modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/parcel",
    route: parcelRoutes,
  },
  {
    path: "/payment",
    route: paymentRoutes,
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));
