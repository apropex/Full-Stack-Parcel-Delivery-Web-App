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
exports.getSingleUserController = exports.getMeController = exports.getAllUsersController = exports.updateUserController = exports.createUserController = void 0;
const statusCode_1 = __importDefault(require("../../../statusCode"));
const catchAsync_1 = require("../../lib/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const user_service_1 = require("./user.service");
//
exports.createUserController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, user_service_1.createUserService)(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "User created successfully",
        data,
    });
}));
//
exports.updateUserController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, user_service_1.updateUserService)(req.params.userId, req.body, req.decoded);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "User updated successfully",
        data,
    });
}));
//
exports.getAllUsersController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield (0, user_service_1.getAllUsersService)();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "All users retrieved successfully",
        data,
        meta,
    });
}));
//
exports.getMeController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { data } = yield (0, user_service_1.getMeService)(((_a = req.decoded) === null || _a === void 0 ? void 0 : _a._id) || "");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "User retrieved successfully",
        data,
    });
}));
//
exports.getSingleUserController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { data } = yield (0, user_service_1.getMeService)(((_a = req.params) === null || _a === void 0 ? void 0 : _a.userId) || "");
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "User retrieved successfully",
        data,
    });
}));
