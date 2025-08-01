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
exports.querySchema = exports.paramsSchema = exports.zodPQValidator = exports.zodBodyValidator = void 0;
const zod_1 = __importDefault(require("zod"));
// zod request body validator
const zodBodyValidator = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data;
        const result = data ? JSON.parse(data) : req.body;
        req.body = yield zodSchema.parseAsync(result);
        next();
    }
    catch (error) {
        next(error);
    }
});
exports.zodBodyValidator = zodBodyValidator;
// zod query and params validator
const zodPQValidator = ({ paramsSchema, querySchema }) => (req, res, next) => {
    try {
        if (paramsSchema) {
            req.params = paramsSchema.parse(req.params);
        }
        if (querySchema) {
            req.query = querySchema.parse(req.query);
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.zodPQValidator = zodPQValidator;
// zod params validation schema
exports.paramsSchema = zod_1.default.object({
    id: zod_1.default
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, {
        message: "Invalid ID format",
    })
        .optional(),
    email: zod_1.default.string().email({ message: "Invalid Email" }).optional(),
});
// zod query validation schema
exports.querySchema = zod_1.default.object({
    page: zod_1.default
        .string()
        .regex(/^\d+$/, { message: "Page must be a number" })
        .optional(),
    limit: zod_1.default
        .string()
        .regex(/^\d+$/, { message: "Limit must be a number" })
        .optional(),
});
