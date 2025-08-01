"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../app/modules/auth/auth.route"));
const parcel_route_1 = __importDefault(require("../app/modules/parcel/parcel.route"));
const user_route_1 = __importDefault(require("../app/modules/user/user.route"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.default,
    },
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/parcel",
        route: parcel_route_1.default,
    },
];
moduleRoutes.forEach(({ path, route }) => exports.router.use(path, route));
