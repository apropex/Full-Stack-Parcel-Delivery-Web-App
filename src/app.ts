import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import expressSession from "express-session";
import passport from "passport";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import ENV from "./config/env.config";
import { router } from "./routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: ENV.FRONTEND_URL,
    credentials: true,
  })
);
app.use(
  expressSession({
    secret: ENV.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/api/v1", router);

// ROOT ROUTES
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Welcome to Happy Parcel Picker Server" });
});

// Global Error Handler
app.use(globalErrorHandler);

// Not Found handler
app.use(notFound);

export default app;
