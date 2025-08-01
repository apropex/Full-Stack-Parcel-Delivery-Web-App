import { hash } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import ENV from "../../../config/env.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { eAuthMessages } from "../../constants/messages";
import { getExistingUser } from "../../utils/userChecker";
import {
  eAuthProvider,
  eIsActive,
  eUserRoles,
  iAuthProvider,
  iUser,
} from "./user.interface";
import { User } from "./user.model";

//
export const createUserService = async (payload: Partial<iUser>) => {
  const { email, password, ...rest } = payload;

  const exists = await User.exists({ email });
  if (exists) throw new AppError(sCode.CONFLICT, eAuthMessages.USER_EXIST);

  const hashedPassword = await hash(password as string, ENV.BCRYPT_SALT_ROUND);
  if (!hashedPassword)
    throw new AppError(
      sCode.UNPROCESSABLE_ENTITY,
      "Password could not be processed by bcrypt"
    );

  const authProvider: iAuthProvider = {
    provider: eAuthProvider.credentials,
    providerId: email as string,
  };

  const user = await User.create({
    ...rest,
    email,
    password: hashedPassword,
    auth: [authProvider],
  });

  const newUser = user.toObject();
  delete newUser.password;

  return { data: newUser };
};

//
export const updateUserService = async (
  userId: string,
  payload: Partial<iUser>,
  decoded: JwtPayload
) => {
  const { _id: requesterId, role } = decoded;
  const { ADMIN, SENDER, RECEIVER } = eUserRoles;

  const isSelf = requesterId === String(userId);
  const isAdmin = role === ADMIN;

  const user = await getExistingUser({ id: userId });

  // 1. Only Self, Admin, SuperAdmin can update
  if (!isSelf && !isAdmin) {
    throw new AppError(
      sCode.UNAUTHORIZED,
      "You're not authorized to update this user"
    );
  }

  // 2. Role can't be changed unless Super Admin
  if ("role" in payload) {
    throw new AppError(sCode.FORBIDDEN, "Only Super Admin can change roles");
  }

  // 3. Blocked/Deleted users can't be updated by SENDER/RECEIVER
  if (
    (role === SENDER || role === RECEIVER) &&
    (user.isDeleted || user.isActive === eIsActive.BLOCKED)
  ) {
    throw new AppError(
      sCode.FORBIDDEN,
      "You cannot update this user. Contact admin."
    );
  }

  // 4. Enforce field-level restriction for USER & MODERATOR
  const forbiddenFields = ["isActive", "isDeleted", "isVerified"];
  if (role === SENDER || role === RECEIVER) {
    const hasForbiddenField = forbiddenFields.some((field) => field in payload);
    if (hasForbiddenField) {
      throw new AppError(
        sCode.FORBIDDEN,
        "You're not allowed to update these fields: isActive, isDeleted, isVerified"
      );
    }
  }

  // 5. Prevent password update here
  if ("password" in payload) {
    delete payload.password;
  }

  // 6. Proceed to update
  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  return { data: updatedUser };
};

//
export const getAllUsersService = async () => {
  const users = await User.find();
  const totalUser = await User.countDocuments();
  return {
    data: users,
    meta: { total_data: totalUser },
  };
};

//
export const getMeService = async (id: string) => {
  const user = await getExistingUser({ id });

  return {
    data: user,
  };
};
