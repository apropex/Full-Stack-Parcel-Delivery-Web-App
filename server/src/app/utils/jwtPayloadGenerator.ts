// utils/jwtPayloadGenerator
import { JwtPayload } from "jsonwebtoken";

// export type TokenPayload = Partial<iUserResponse> | JwtPayload;

export type TokenPayload = JwtPayload;

export const jwtPayloadGenerator = (user: Partial<TokenPayload>): TokenPayload => {
  const { _id, name, email, phone, picture, address, isActive, isDeleted, isVerified, role } =
    user;

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
