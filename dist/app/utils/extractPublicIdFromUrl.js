"use strict";
//
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicIdFromUrl = extractPublicIdFromUrl;
exports.getCloudinaryPublicId = getCloudinaryPublicId;
function extractPublicIdFromUrl(url) {
    const matches = url.match(/\/upload\/[^/]+\/(.+?)\.(jpg|jpeg|png|webp|gif)$/i);
    return matches ? matches[1] : null;
}
function getCloudinaryPublicId(url) {
    var _a;
    try {
        const filename = url.split("/").pop();
        return (_a = filename === null || filename === void 0 ? void 0 : filename.split(".").slice(0, -1).join(".")) !== null && _a !== void 0 ? _a : null;
    }
    catch (_b) {
        return null;
    }
}
