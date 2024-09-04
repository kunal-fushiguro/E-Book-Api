import { Response } from "express";
import { NODE_ENV } from "../../config/env";
import { ZodError } from "zod";

class ApiResponse {
  statusCode: number;
  message: string;
  data: object;
  success: boolean;
  constructor(
    statusCode: number,
    message: string,
    success: boolean,
    data: object
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || {};
    this.success = success;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static errorHandler(res: Response, error: any) {
    let statusCode = 500;
    let message = error.message || "An unexpected error occurred";

    // zod error handle
    if (error instanceof ZodError) {
      statusCode = 400;
      message = error.errors
        .map((issue) => `${issue.path.join(".")} is ${issue.message}`)
        .join(", ");
    }

    return res
      .status(statusCode)
      .json(
        new ApiResponse(
          statusCode,
          message || "Internal server error.",
          false,
          NODE_ENV === "DEV" ? { stack: error.stack } : {}
        )
      );
  }

  static sendResponse(
    res: Response,
    message: string,
    statusCode: number,
    data: object,
    success: boolean
  ) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, message, success, data));
  }

  static sendResponseWithUserData(
    res: Response,
    message: string,
    statusCode: number,
    success: boolean,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any
  ) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, message, success, {
        userId: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        bookList: user.bookList,
        followers: user.followers,
        following: user.following,
      })
    );
  }
}

export { ApiResponse };
