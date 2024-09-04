import { Response } from "express";
import { HttpError } from "http-errors";
import { NODE_ENV } from "../../config/env";

class ApiResponse {
  statusCode: number;
  message: string;
  data: object;
  success: boolean;
  constructor(
    statusCode: number,
    message: string,
    data: object,
    success: boolean
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data || {};
    this.success = success;
  }

  static errorHandler(res: Response, error: HttpError) {
    return res
      .status(error.statusCode)
      .json(
        new ApiResponse(
          error.statusCode,
          error.message || "Internal server error.",
          NODE_ENV === "DEV" ? { stack: error.stack } : {},
          false
        )
      );
  }
}

export { ApiResponse };
