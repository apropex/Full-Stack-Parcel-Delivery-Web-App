"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookie = void 0;
const env_config_1 = require("../../config/env.config");
const cookieOptions = {
    httpOnly: true,
    secure: env_config_1.isDev,
    sameSite: "lax",
};
exports.setCookie = {
    accessToken(res, token) {
        res.cookie("accessToken", token, Object.assign(Object.assign({}, cookieOptions), { maxAge: 1000 * 60 * 60 * 24 }));
    },
    refreshToken(res, token) {
        res.cookie("refreshToken", token, Object.assign(Object.assign({}, cookieOptions), { maxAge: 1000 * 60 * 60 * 24 * 30 }));
    },
    allTokens(res, accessToken, refreshToken) {
        this.accessToken(res, accessToken);
        this.refreshToken(res, refreshToken);
    },
    clearCookies(res) {
        res.clearCookie("accessToken", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);
    },
};
