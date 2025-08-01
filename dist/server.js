"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_config_1 = __importDefault(require("./config/env.config"));
const connect_db_1 = require("./database/connect_db");
let server;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_db_1.connect_db)();
        server = app_1.default.listen(env_config_1.default.PORT, () => {
            console.log(`Server running on port ${env_config_1.default.PORT}`);
        });
    }
    catch (error) {
        console.log("server running error: ", error);
    }
}))();
process.on("unhandledRejection", (err) => {
    console.log("Unhandled rejection detected, Server is shutting down...", err);
    if (server)
        return server.close(() => process.exit(1));
    process.exit(1);
});
process.on("uncaughtException", (err) => {
    console.log("Unhandled exception detected, Server is shutting down...", err);
    if (server)
        return server.close(() => process.exit(1));
    process.exit(1);
});
process.on("SIGTERM", () => {
    console.log("SIGTERM signal issue detected, Server is shutting down...");
    if (server)
        return server.close(() => process.exit(1));
    process.exit(1);
});
