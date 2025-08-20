import mongoose, { ClientSession } from "mongoose";

type TransactionalFunction<T> = (session: ClientSession) => Promise<T>;

export const transactionRollback = async <T>(
  fn: TransactionalFunction<T>
): Promise<T> => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const result = await fn(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
