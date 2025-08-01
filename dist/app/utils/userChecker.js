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
exports.checkUserExist = exports.getExistingUser = void 0;
const AppError_1 = require("../../errors/AppError");
const statusCode_1 = __importDefault(require("../../statusCode"));
const messages_1 = require("../constants/messages");
const user_model_1 = require("../modules/user/user.model");
const mongoIdValidator_1 = require("./mongoIdValidator");
const getExistingUser = (_a) => __awaiter(void 0, [_a], void 0, function* ({ id, email, password = false, }) {
    if (!id && !email) {
        throw new AppError_1.AppError(statusCode_1.default.BAD_REQUEST, "Either 'id' or 'email' must be provided");
    }
    const query = id ? { _id: (0, mongoIdValidator_1.mongoIdValidator)(id) } : { email };
    const userQuery = user_model_1.User.findOne(query);
    if (password)
        userQuery.select("+password");
    const user = yield userQuery;
    if (!user) {
        throw new AppError_1.AppError(statusCode_1.default.NOT_FOUND, messages_1.eAuthMessages.USER_NOT_FOUND);
    }
    return user;
});
exports.getExistingUser = getExistingUser;
/**
 * Only checks if user exists by ID or email. Throws error if not found.
 */
const checkUserExist = (props) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getExistingUser)(props);
});
exports.checkUserExist = checkUserExist;
