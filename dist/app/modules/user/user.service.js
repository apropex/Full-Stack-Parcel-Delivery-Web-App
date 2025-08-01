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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeService = exports.getAllUsersService = exports.updateUserService = exports.createUserService = void 0;
const bcryptjs_1 = require("bcryptjs");
const env_config_1 = __importDefault(require("../../../config/env.config"));
const AppError_1 = require("../../../errors/AppError");
const statusCode_1 = __importDefault(require("../../../statusCode"));
const messages_1 = require("../../constants/messages");
const userChecker_1 = require("../../utils/userChecker");
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
//
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const exists = yield user_model_1.User.exists({ email });
    if (exists)
        throw new AppError_1.AppError(statusCode_1.default.CONFLICT, messages_1.eAuthMessages.USER_EXIST);
    const hashedPassword = yield (0, bcryptjs_1.hash)(password, env_config_1.default.BCRYPT_SALT_ROUND);
    if (!hashedPassword)
        throw new AppError_1.AppError(statusCode_1.default.UNPROCESSABLE_ENTITY, "Password could not be processed, try again");
    const authProvider = {
        provider: user_interface_1.eAuthProvider.credentials,
        providerId: email,
    };
    const user = yield user_model_1.User.create(Object.assign(Object.assign({}, rest), { email, password: hashedPassword, auth: [authProvider] }));
    const newUser = user.toObject();
    delete newUser.password;
    return { data: newUser };
});
exports.createUserService = createUserService;
//
const updateUserService = (userId, payload, decoded) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: requesterId, role } = decoded;
    const { ADMIN, SENDER, RECEIVER } = user_interface_1.eUserRoles;
    const isSelf = requesterId === String(userId);
    const isAdmin = role === ADMIN;
    const isSender = role === SENDER;
    const isReceiver = role === RECEIVER;
    const user = yield (0, userChecker_1.getExistingUser)({ id: userId });
    // 1. Only Self, Admin, SuperAdmin can update
    if (!isSelf && !isAdmin) {
        throw new AppError_1.AppError(statusCode_1.default.UNAUTHORIZED, "Only the user (owner) or the admin can update");
    }
    // 2. Role can't be changed unless Admin
    if ("role" in payload && !isAdmin) {
        throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, "Only Admin can change roles");
    }
    // 3. Blocked/Deleted users can't be updated by SENDER/RECEIVER
    if ((isSender || isReceiver) && user.isDeleted) {
        throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, "You cannot update this user. Contact to admin");
    }
    // 4. Enforce field-level restriction for USER
    const forbiddenFields = ["isActive", "isDeleted", "isVerified"];
    if (isSender || isReceiver) {
        const hasForbiddenField = forbiddenFields.some((field) => field in payload);
        if (hasForbiddenField) {
            throw new AppError_1.AppError(statusCode_1.default.FORBIDDEN, "You're not allowed to update these fields: isActive, isDeleted, isVerified");
        }
    }
    // 5. Prevent password update here
    if ("password" in payload)
        delete payload.password;
    // 6. Proceed to update
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    return { data: updatedUser };
});
exports.updateUserService = updateUserService;
//
const getAllUsersService = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    const totalUser = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: { total_data: totalUser },
    };
});
exports.getAllUsersService = getAllUsersService;
//
const getMeService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userChecker_1.getExistingUser)({ id });
    return {
        data: user,
    };
});
exports.getMeService = getMeService;
