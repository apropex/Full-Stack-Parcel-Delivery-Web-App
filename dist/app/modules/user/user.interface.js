"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eAuthProvider = exports.eIsActive = exports.eUserRoles = void 0;
var eUserRoles;
(function (eUserRoles) {
    eUserRoles["ADMIN"] = "ADMIN";
    eUserRoles["SENDER"] = "SENDER";
    eUserRoles["RECEIVER"] = "RECEIVER";
})(eUserRoles || (exports.eUserRoles = eUserRoles = {}));
var eIsActive;
(function (eIsActive) {
    eIsActive["ACTIVE"] = "ACTIVE";
    eIsActive["INACTIVE"] = "INACTIVE";
    eIsActive["BLOCKED"] = "BLOCKED";
})(eIsActive || (exports.eIsActive = eIsActive = {}));
var eAuthProvider;
(function (eAuthProvider) {
    eAuthProvider["google"] = "google";
    eAuthProvider["facebook"] = "facebook";
    eAuthProvider["credentials"] = "credentials";
})(eAuthProvider || (exports.eAuthProvider = eAuthProvider = {}));
