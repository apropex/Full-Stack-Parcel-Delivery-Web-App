//
export enum eAuthMessages {
  LOGIN_SUCCESS = "User logged in successfully",
  CREATE_SUCCESS = "User created successfully",
  USER_NOT_FOUND = "User does not exist",
  INVALID_CREDENTIALS = "Invalid credentials",
  USER_BLOCKED = "User is blocked",
  USER_NOT_VERIFIED = "User is not verified",
  USER_DELETED = "User is deleted",
}

export enum eJwtMessages {
  UNAUTHORIZED = "Unauthorized user",
  FORBIDDEN = "Forbidden user role",
  TOKEN_NOT_FOUND = "Token did not arrive",
  INVALID_TOKEN = "Invalid token",
}
