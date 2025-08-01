"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtPayloadGenerator = void 0;
const jwtPayloadGenerator = (user) => {
    const { _id, name, email, phone, picture, address, isActive, isDeleted, isVerified, role, } = user;
    return {
        _id,
        name,
        email,
        phone,
        picture,
        address,
        isActive,
        isDeleted,
        isVerified,
        role,
    };
};
exports.jwtPayloadGenerator = jwtPayloadGenerator;
