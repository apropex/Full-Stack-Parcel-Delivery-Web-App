/* eslint-disable @typescript-eslint/no-explicit-any */
import { hash } from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { deleteImageFromCloud } from "../../../config/cloudinary/deleteImageFromCloud";
import ENV from "../../../config/env.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { eAuthMessages } from "../../constants/messages";
import { transactionRollback } from "../../lib/transactionRollback";
import { getExistingUser } from "../../utils/userChecker";
import { eAuthProvider, eUserRoles, iAuthProvider, iUser } from "./user.interface";
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
      "Password could not be processed, try again"
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
  const isSender = role === SENDER;
  const isReceiver = role === RECEIVER;

  return await transactionRollback(async (session) => {
    const user = await getExistingUser({ id: userId });

    const oldImage = user?.image || null;

    // 1. Only Self, Admin, SuperAdmin can update
    if (!isSelf && !isAdmin) {
      throw new AppError(sCode.UNAUTHORIZED, "Only the user (owner) or the admin can update");
    }

    // 2. Enforce field-level restriction for USER
    const forbiddenFields = ["isActive", "isDeleted", "isVerified", "role"];
    if (isSender || isReceiver) {
      const hasForbiddenField = forbiddenFields.some((field) => field in payload);
      if (hasForbiddenField) {
        throw new AppError(
          sCode.FORBIDDEN,
          "You're not allowed to update these fields: isActive, isDeleted, isVerified, role"
        );
      }
    }

    // 3. Prevent password update here
    if ("password" in payload) delete payload.password;

    // 4. Marge the payload
    Object.assign(user, payload);

    // 4. Proceed to update
    await user.save({ session });

    if (oldImage && payload.image && payload.image !== oldImage)
      deleteImageFromCloud(oldImage);

    return { data: user };
  });
};

//

export const getAllUsersService = async (query: Record<string, string>) => {
  const { page = "1", limit = "10", skip, search, role, status } = query;

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skipNum = skip ? parseInt(skip, 10) : (pageNum - 1) * limitNum;

  // Build filter object
  const filter: any = {};

  if (role) filter.role = role;
  if (status) filter.isActive = status;

  if (search) {
    const regex = new RegExp(search, "i"); // case-insensitive
    filter.$or = [{ "name.firstName": regex }, { "name.lastName": regex }, { email: regex }];
  }

  // Total users (without filter)
  const totalUser = await User.countDocuments();

  // Total filtered users
  const filteredUser = await User.countDocuments(filter);

  // Fetch paginated users
  const users = await User.find(filter)
    .skip(skipNum)
    .limit(limitNum)
    .sort({ createdAt: -1, id: -1 });

  const totalPage = Math.ceil(filteredUser / limitNum);

  return {
    data: users,
    meta: {
      total_data: totalUser,
      filtered_data: filteredUser,
      total_page: totalPage,
      present_page: pageNum,
      skip: skipNum,
      limit: limitNum,
    },
  };
};

//
export const getMeService = async (id: string) => {
  const user = await getExistingUser({ id });

  return {
    data: user,
  };
};

export const getSingleUserService = async (email: string) => {
  const user = await getExistingUser({ email });

  return {
    data: user,
  };
};
