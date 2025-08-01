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
exports.googleStrategy = void 0;
const passport_google_oauth20_1 = require("passport-google-oauth20");
const messages_1 = require("../../../app/constants/messages");
const user_interface_1 = require("../../../app/modules/user/user.interface");
const user_model_1 = require("../../../app/modules/user/user.model");
const env_config_1 = __importDefault(require("../../env.config"));
const GOOGLE = env_config_1.default.GOOGLE;
exports.googleStrategy = new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE.GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE.GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE.GOOGLE_CALLBACK_URL,
}, (_accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
        if (!email)
            return done(null, false, { message: "Email not found" });
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            if (user === null || user === void 0 ? void 0 : user.isDeleted)
                return done(null, false, { message: "User is deleted" });
            if (!(user === null || user === void 0 ? void 0 : user.isVerified))
                return done(null, false, { message: "User is not verified" });
            if ((user === null || user === void 0 ? void 0 : user.isActive) === user_interface_1.eIsActive.BLOCKED)
                return done(null, false, { message: "User is blocked" });
        }
        if (!user) {
            const fullName = profile.displayName || "";
            const [firstName, ...rest] = fullName.trim().split(" ");
            const lastName = rest.join(" ");
            user = yield user_model_1.User.create({
                email,
                name: { firstName, lastName },
                picture: ((_b = profile.photos) === null || _b === void 0 ? void 0 : _b[0].value) || "",
                role: user_interface_1.eUserRoles.SENDER,
                isVerified: true,
                auth: [
                    {
                        provider: user_interface_1.eAuthProvider.google,
                        providerId: email,
                    },
                ],
            });
            return done(null, user, { message: messages_1.eAuthMessages.CREATE_SUCCESS });
        }
        done(null, user, { message: messages_1.eAuthMessages.LOGIN_SUCCESS });
    }
    catch (error) {
        return done(error);
    }
}));
