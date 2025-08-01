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
exports.localStrategy = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_local_1 = require("passport-local");
const messages_1 = require("../../../app/constants/messages");
const user_interface_1 = require("../../../app/modules/user/user.interface");
const user_model_1 = require("../../../app/modules/user/user.model");
exports.localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findOne({ email }).select("+password");
        if (!user) {
            return done(null, false, { message: messages_1.eAuthMessages.USER_NOT_FOUND });
        }
        const isMatch = user.password && (yield bcryptjs_1.default.compare(password, user.password));
        if (!isMatch) {
            return done(null, false, {
                message: messages_1.eAuthMessages.INVALID_CREDENTIALS,
            });
        }
        if (user === null || user === void 0 ? void 0 : user.isDeleted)
            return done(null, false, { message: "User is deleted" });
        if ((user === null || user === void 0 ? void 0 : user.isActive) === user_interface_1.eIsActive.BLOCKED)
            return done(null, false, { message: "User is blocked" });
        const userData = user.toObject();
        delete userData.password;
        done(null, userData, { message: messages_1.eAuthMessages.LOGIN_SUCCESS });
    }
    catch (error) {
        done(error, false);
    }
}));
