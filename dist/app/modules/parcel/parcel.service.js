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
exports.deleteStatusLogService = exports.incomingParcelService = exports.getMyParcelService = exports.getSingleParcelService = exports.getAllParcelService = exports.updateParcelStatusLogsService = exports.confirmParcelService = exports.cancelParcelService = exports.updateParcelStatusService = exports.updateParcelService = exports.createdParcelService = void 0;
const AppError_1 = require("../../../errors/AppError");
const statusCode_1 = __importDefault(require("../../../statusCode"));
const transactionRollback_1 = require("../../lib/transactionRollback");
const idGenerator_1 = require("../../utils/idGenerator");
const mongoIdValidator_1 = require("../../utils/mongoIdValidator");
const user_interface_1 = require("../user/user.interface");
const parcel_interface_1 = require("./parcel.interface");
const parcel_model_1 = require("./parcel.model");
const createdParcelService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const rates = { Document: 40, Box: 60, Fragile: 50, Other: 80 };
    const decoded = req.decoded;
    const payload = req.body;
    if (!payload.type || !payload.weight) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Parcel type and weight is required");
    }
    const type = Object.keys(rates).find((rate) => rate === payload.type);
    payload.rent = rates[type] * payload.weight;
    payload.trackingId = (0, idGenerator_1.generateTrackingID)();
    payload.sender = decoded._id;
    const parcel = yield parcel_model_1.Parcel.create(payload);
    return { data: parcel };
});
exports.createdParcelService = createdParcelService;
//
const updateParcelService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const id = (0, mongoIdValidator_1.mongoIdValidator)(((_a = req.params) === null || _a === void 0 ? void 0 : _a.parcelId) || "");
    const payload = req.body;
    const { role, _id } = req.decoded;
    const { SENDER, RECEIVER, ADMIN } = user_interface_1.eUserRoles;
    const forbiddenFields = [
        "rent",
        "isBlocked",
        "isCancelled",
        "estimatedDeliveryDate",
        "deliveredAt",
    ];
    if (role === SENDER || role === RECEIVER) {
        const hasForbiddenField = forbiddenFields.some((field) => field in payload);
        if (hasForbiddenField) {
            throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, `You're not allowed to update these fields: ${forbiddenFields.join(", ")}`);
        }
    }
    delete payload.trackingId;
    delete payload.status;
    delete payload.statusLogs;
    return yield (0, transactionRollback_1.transactionRollback)((session) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (!updatedParcel) {
            throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, "Parcel not found");
        }
        if (role !== ADMIN && updatedParcel.sender.toString() !== _id) {
            throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, "Only sender or admin can update the parcel");
        }
        return { data: updatedParcel };
    }));
});
exports.updateParcelService = updateParcelService;
//
const updateParcelStatusService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcelId = req.params.parcelId;
    const { status, note } = req.body;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.AppError(404, "Parcel not found");
    parcel.statusLogs.push({
        status: status,
        updatedAt: new Date(),
        updatedBy: (0, mongoIdValidator_1.mongoIdValidator)((_a = req.decoded) === null || _a === void 0 ? void 0 : _a._id),
        note: note || `Status updated from ${parcel.status}`,
    });
    parcel.status = status;
    yield parcel.save();
    return { data: parcel };
});
exports.updateParcelStatusService = updateParcelStatusService;
//
const cancelParcelService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.parcelId;
    const { _id, role } = req.decoded;
    const { ADMIN } = user_interface_1.eUserRoles;
    const { note } = req.body;
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.AppError(404, "Parcel not found");
    // Access control
    if (role !== ADMIN && String(parcel.sender) !== _id) {
        throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, `Only the sender or an admin can cancel the parcel`);
    }
    const { Requested, Approved, Cancelled } = parcel_interface_1.eParcelStatus;
    const cancellableStatuses = [Requested, Approved];
    if (!cancellableStatuses.includes(parcel.status) && role !== ADMIN) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, `Parcel already ${parcel.status}`);
    }
    const previousStatus = parcel.status;
    parcel.status = Cancelled;
    parcel.statusLogs.push({
        status: Cancelled,
        updatedAt: new Date(),
        updatedBy: (0, mongoIdValidator_1.mongoIdValidator)(_id),
        note: note || `Status changed from ${previousStatus} to Cancelled`,
    });
    yield parcel.save();
    return {
        data: parcel,
    };
});
exports.cancelParcelService = cancelParcelService;
//
const confirmParcelService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const parcelId = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.parcelId) || "";
    const { note } = req.body;
    const { _id } = req.decoded;
    const { Received } = parcel_interface_1.eParcelStatus;
    const parcel = yield parcel_model_1.Parcel.findById((0, mongoIdValidator_1.mongoIdValidator)(parcelId));
    if (!parcel)
        throw new AppError_1.AppError(404, "Parcel not found");
    if (_id !== String(parcel.receiver)) {
        throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, "Only the receiver can confirm the parcel");
    }
    if (parcel.status === Received) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Parcel already received");
    }
    const previousStatus = parcel.status;
    parcel.status = Received;
    parcel.statusLogs.push({
        status: Received,
        updatedAt: new Date(),
        updatedBy: (0, mongoIdValidator_1.mongoIdValidator)(_id),
        note: note || `Status changed from ${previousStatus} to Received`,
    });
    yield parcel.save();
    return {
        data: parcel,
    };
});
exports.confirmParcelService = confirmParcelService;
//
const updateParcelStatusLogsService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.parcelId;
    const { note, status, updatedAt } = req.body;
    if (!parcelId || !status || !updatedAt) {
        throw new AppError_1.AppError(400, "Parcel ID, status, and updatedAt are required");
    }
    const result = yield parcel_model_1.Parcel.updateOne({ _id: parcelId }, {
        $set: {
            "statusLogs.$[log].note": note,
            "statusLogs.$[log].updatedAt": new Date(),
        },
    }, {
        arrayFilters: [
            {
                "log.status": status,
                "log.updatedAt": new Date(updatedAt),
            },
        ],
    });
    if (result.modifiedCount === 0) {
        throw new AppError_1.AppError(404, "No matching status log found to update");
    }
    return {
        data: result,
    };
});
exports.updateParcelStatusLogsService = updateParcelStatusLogsService;
//
const getAllParcelService = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find();
    const total = yield parcel_model_1.Parcel.estimatedDocumentCount();
    return {
        data: parcels,
        meta: { total_data: total },
    };
});
exports.getAllParcelService = getAllParcelService;
//
const getSingleParcelService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById((0, mongoIdValidator_1.mongoIdValidator)(id));
    if (!parcel)
        throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, "Parcel not found with this ID");
    return { data: parcel };
});
exports.getSingleParcelService = getSingleParcelService;
//
const getMyParcelService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({ sender: (0, mongoIdValidator_1.mongoIdValidator)(id) });
    if (!parcels)
        throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, "Parcel not found with this ID");
    return { data: parcels };
});
exports.getMyParcelService = getMyParcelService;
//
const incomingParcelService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({ receiver: (0, mongoIdValidator_1.mongoIdValidator)(id) });
    if (!parcels)
        throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, "Parcel not found with this ID");
    return { data: parcels };
});
exports.incomingParcelService = incomingParcelService;
//
const deleteStatusLogService = (req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { _id } = req.decoded;
    const parcelId = ((_a = req.params) === null || _a === void 0 ? void 0 : _a.parcelId) || "";
    const { deletedStatus, presentStatus, note, updatedAt } = req.body;
    const parcel = yield parcel_model_1.Parcel.findById((0, mongoIdValidator_1.mongoIdValidator)(parcelId));
    if (!parcel)
        throw new AppError_1.AppError(404, "Parcel not found");
    const newStatusLogs = parcel.statusLogs.filter((log) => !(log.status === deletedStatus &&
        new Date(log.updatedAt).getTime() === new Date(updatedAt).getTime()));
    if (newStatusLogs.length === 0) {
        throw new AppError_1.AppError(400, "Cannot delete status log");
    }
    parcel.statusLogs = newStatusLogs;
    parcel.status = presentStatus;
    parcel.statusLogs.push({
        status: presentStatus,
        updatedAt: new Date(),
        updatedBy: (0, mongoIdValidator_1.mongoIdValidator)(_id),
        note: note || `Status updated to ${presentStatus}`,
    });
    yield parcel.save();
    return {
        data: {
            message: "Status log deleted and new status added",
            currentStatus: parcel.status,
            totalLogs: parcel.statusLogs.length,
        },
    };
});
exports.deleteStatusLogService = deleteStatusLogService;
