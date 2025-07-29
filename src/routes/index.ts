import { Router } from "express";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: "",
  },
];

moduleRoutes.forEach(({ path, route }) => router.use(path, route));
