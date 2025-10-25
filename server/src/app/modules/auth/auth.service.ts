import { compare, hash } from "bcryptjs";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import ENV from "../../../config/env.config";
import { AppError } from "../../../errors/AppError";
import sCode from "../../../statusCode";
import { eAuthMessages } from "../../constants/messages";
import { generateAccessToken } from "../../lib/jwt";
import { sendEmail } from "../../lib/sendEmail";
import { getExistingUser } from "../../utils/userChecker";
import { eAuthProvider, eIsActive, iUser } from "../user/user.interface";

//
export const credentialLoginService = async (payload: Partial<iUser>) => {
  const { email, password } = payload;

  const isUserExist = await getExistingUser({ email, password: true });

  if (!isUserExist.isVerified) throw new AppError(sCode.BAD_REQUEST, "User is not verified");

  let isPasswordMatch = false;
  if (isUserExist?.password) {
    isPasswordMatch = await compare(password as string, isUserExist?.password as string);
  }

  if (!isPasswordMatch) {
    throw new AppError(sCode.UNAUTHORIZED, eAuthMessages.INVALID_CREDENTIALS);
  }

  const userData = isUserExist.toObject();
  delete userData.password;
  return { data: userData };
};

//

export const changePasswordService = async (req: Request) => {
  const { _id } = req.decoded as JwtPayload;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new AppError(
      sCode.BAD_REQUEST,
      !oldPassword ? "Old passwords is required" : "New passwords is required"
    );
  }

  const user = await getExistingUser({ id: _id, password: true });

  const isMatched = await compare(oldPassword, user.password as string);
  if (!isMatched) {
    throw new AppError(sCode.BAD_REQUEST, "Invalid password");
  }

  const hashedPassword = await hash(newPassword, ENV.BCRYPT_SALT_ROUND);

  user.password = hashedPassword;
  await user.save();

  return {
    data: {
      _id: user._id,
      email: user.email,
      message: "Password updated successfully",
    },
  };
};

//
export const forgotPasswordService = async (email: string) => {
  const user = await getExistingUser({ email });

  if (user.isDeleted) throw new AppError(400, "User is deleted");
  if (user.isActive === eIsActive.BLOCKED) throw new AppError(400, "User is blocked");

  const token = generateAccessToken(user, "10m");
  const resetUILink = `${ENV.FRONTEND_URL}/reset-password?id=${user._id}&token=${encodeURIComponent(token)}`;

  await sendEmail({
    to: email,
    subject: "PH Tour | Password Reset",
    templateName: "forgotPassword",
    templateData: {
      name: `${user.name.firstName} ${user.name.lastName}`,
      resetUILink,
    },
  });
};

//
export const resetPasswordService = async (req: Request) => {
  const { _id, email } = req.decoded as JwtPayload;
  const { newPassword, id } = req.body;

  if (_id !== id) throw new AppError(sCode.UNAUTHORIZED, "Unauthorized");

  const user = await getExistingUser({ id: _id });
  user.password = await hash(newPassword, ENV.BCRYPT_SALT_ROUND);

  await user.save();

  return {
    data: { email },
  };
};

//
export const setPasswordService = async (req: Request) => {
  const { _id, email } = req.decoded as JwtPayload;
  const { password } = req.body;

  const user = await getExistingUser({ id: _id, password: true });

  if (user.password) {
    throw new AppError(
      sCode.BAD_REQUEST,
      "You already have a password, try to login or forgot password"
    );
  }

  user.auth = [
    {
      provider: eAuthProvider.credentials,
      providerId: email,
    },
    ...user.auth,
  ];

  user.password = await hash(password, ENV.BCRYPT_SALT_ROUND);

  await user.save();

  return {
    data: { _id, email, message: "Password created successfully" },
  };
};
