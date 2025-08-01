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
exports.deleteStatusLogController = exports.incomingParcelController = exports.getMyParcelController = exports.getSingleParcelController = exports.getAllParcelController = exports.updateParcelStatusLogsController = exports.confirmParcelController = exports.cancelParcelController = exports.updateParcelStatusController = exports.updateParcelController = exports.createdParcelController = void 0;
const statusCode_1 = __importDefault(require("../../../statusCode"));
const catchAsync_1 = require("../../lib/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const parcel_service_1 = require("./parcel.service");
exports.createdParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.createdParcelService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.CREATED,
        message: "Parcel created successfully",
        data,
    });
}));
//
exports.updateParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.updateParcelService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcel updated successfully",
        data,
    });
}));
//
exports.updateParcelStatusController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.updateParcelStatusService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Updated parcel status successfully",
        data,
    });
}));
//
exports.cancelParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.cancelParcelService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcel cancelled successfully",
        data,
    });
}));
//
exports.confirmParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.confirmParcelService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcel confirmed successfully",
        data,
    });
}));
//
exports.updateParcelStatusLogsController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.updateParcelStatusLogsService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Updated parcel status log successfully",
        data,
    });
}));
//
exports.getAllParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, meta } = yield (0, parcel_service_1.getAllParcelService)();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcels retrieved successfully",
        data,
        meta,
    });
}));
//
exports.getSingleParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.parcelId || "";
    const { data } = yield (0, parcel_service_1.getSingleParcelService)(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcel retrieved successfully",
        data,
    });
}));
//
exports.getMyParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = ((_a = req.decoded) === null || _a === void 0 ? void 0 : _a._id) || "";
    const { data } = yield (0, parcel_service_1.getMyParcelService)(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcel retrieved successfully",
        data,
    });
}));
//
exports.incomingParcelController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = ((_a = req.decoded) === null || _a === void 0 ? void 0 : _a._id) || "";
    const { data } = yield (0, parcel_service_1.incomingParcelService)(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Parcel retrieved successfully",
        data,
    });
}));
//
exports.deleteStatusLogController = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, parcel_service_1.deleteStatusLogService)(req);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: statusCode_1.default.OK,
        message: "Deleted parcel status log successfully",
        data,
    });
}));
