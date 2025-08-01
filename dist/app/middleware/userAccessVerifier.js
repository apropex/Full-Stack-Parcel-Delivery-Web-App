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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAccessVerifier = void 0;
const AppError_1 = require("../../errors/AppError");
const jwt_1 = require("../lib/jwt");
const user_interface_1 = require("../modules/user/user.interface");
const extractTokenFromHeader_1 = require("../utils/extractTokenFromHeader");
const userAccessVerifier = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const header = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || "";
        const decoded = (0, jwt_1.verifyAccessToken)((0, extractTokenFromHeader_1.extractTokenFromHeader)(header));
        const { isDeleted, isVerified, isActive } = decoded;
        if (isDeleted)
            return next(new AppError_1.AppError(400, "User is deleted"));
        if (!isVerified)
            return next(new AppError_1.AppError(400, "User is not verified"));
        if (isActive === user_interface_1.eIsActive.BLOCKED)
            return next(new AppError_1.AppError(400, "User is blocked"));
        req.decoded = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.userAccessVerifier = userAccessVerifier;
