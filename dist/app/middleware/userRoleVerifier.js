"use strict";
// userRoleVerifier
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
exports.userRoleVerifier = void 0;
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const messages_1 = require("../constants/messages");
const jwt_1 = require("../lib/jwt");
const extractTokenFromHeader_1 = require("../utils/extractTokenFromHeader");
const userChecker_1 = require("../utils/userChecker");
const userRoleVerifier = (...roles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const header = ((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) || "";
        const decoded = (0, jwt_1.verifyAccessToken)((0, extractTokenFromHeader_1.extractTokenFromHeader)(header));
        yield (0, userChecker_1.checkUserExist)({ id: decoded._id });
        if (!roles.includes(decoded.role))
            return next(new AppError_1.AppError(statusCode_1.default.FORBIDDEN, messages_1.eJwtMessages.FORBIDDEN));
        req.decoded = decoded;
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.userRoleVerifier = userRoleVerifier;
