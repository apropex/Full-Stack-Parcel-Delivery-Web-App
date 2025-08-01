"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envValidator = void 0;
const envValidator = (obj, options) => {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
        const value = obj[key];
        const isObject = typeof value === "object" && value !== null;
        if (isObject) {
            (0, exports.envValidator)(value, {
                parentKey: `${(options === null || options === void 0 ? void 0 : options.parentKey) || ""}${String(key)}.`,
            });
        }
        else if (!process.env[String(key)]) {
            throw new Error(`❌ ${(options === null || options === void 0 ? void 0 : options.parentKey) ? options.parentKey + String(key) : String(key)} is not defined in environment variables`);
        }
    });
};
exports.envValidator = envValidator;
