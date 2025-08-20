// utils/jwtPayloadGenerator
import { JwtPayload } from "jsonwebtoken";
import { iUserResponse } from "../modules/user/user.interface";

// export type TokenPayload = Partial<iUserResponse> | JwtPayload;

export type TokenPayload =
  | Pick<
      iUserResponse,
      | "_id"
      | "name"
      | "email"
      | "phone"
      | "picture"
      | "address"
      | "isActive"
      | "isDeleted"
      | "isVerified"
      | "role"
    >
  | JwtPayload;

export const jwtPayloadGenerator = (
  user: Partial<TokenPayload>
): TokenPayload => {
  const {
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
  } = user;

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
