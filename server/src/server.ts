/* eslint-disable no-console */
import type { Server } from "http";
import app from "./app";
import ENV from "./config/env.config";
import { connect_db } from "./database/connect_db";

let server: Server;

(async () => {
  try {
    await connect_db();
    server = app.listen(ENV.PORT, () => {
      console.log(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    console.log("server running error: ", error);
  }
})();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection detected, Server is shutting down...", err);
  if (server) return server.close(() => process.exit(1));
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.log("Unhandled exception detected, Server is shutting down...", err);
  if (server) return server.close(() => process.exit(1));
  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal issue detected, Server is shutting down...");
  if (server) return server.close(() => process.exit(1));
  process.exit(1);
});
