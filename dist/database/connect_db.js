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
exports.connect_db = void 0;
/* eslint-disable no-console */
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = __importDefault(require("../config/env.config"));
const connect_db = () => __awaiter(void 0, void 0, void 0, function* () {
    let connected = false;
    let retries = 3;
    let errors;
    while (!connected && retries > 0) {
        try {
            yield mongoose_1.default.connect(env_config_1.default.MONGODB_URL);
            console.log("✅ MongoDB Connected");
            connected = true;
        }
        catch (error) {
            errors = error;
            console.error("❌ MongoDB connection failed. Retrying...");
            retries--;
            yield new Promise((res) => setTimeout(res, 3000)); // wait 3s
        }
    }
    if (!connected) {
        console.error("❌ MongoDB failed to connect after retries.", errors);
        process.exit(1);
    }
});
exports.connect_db = connect_db;
