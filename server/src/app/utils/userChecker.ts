import { HydratedDocument } from "mongoose";
import { AppError } from "../../errors/AppError";
import sCode from "../../statusCode";
import { eAuthMessages } from "../constants/messages";
import { iUser } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import { mongoIdValidator } from "./mongoIdValidator";

interface Props {
  id?: string;
  email?: string;
  password?: boolean;
}

/**
 * Retrieves a user by ID or email.
 * @throws AppError if user not found or no identifier provided.
 */

export const getExistingUser = async ({
  id,
  email,
  password = false,
}: Props): Promise<HydratedDocument<iUser>> => {
  //

  if (!id && !email) {
    throw new AppError(sCode.BAD_REQUEST, "Either 'id' or 'email' must be provided");
  }

  const query = id ? { _id: mongoIdValidator(id) } : { email };

  const userQuery = User.findOne(query);
  if (password) userQuery.select("+password");

  const user = await userQuery;

  if (!user) {
    throw new AppError(sCode.NOT_FOUND, eAuthMessages.USER_NOT_FOUND);
  }

  return user;
};

// Only checks if user exists by ID or email. Throws error if not found.
export const checkUserExist = async (props: Props): Promise<void> => {
  await getExistingUser(props);
};
