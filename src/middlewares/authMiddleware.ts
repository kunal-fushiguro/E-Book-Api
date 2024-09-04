import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string | JwtPayload;
  }
}

const checkToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return ApiResponse.sendResponse(res, "Token not found.", 400, {}, false);
    }

    const decoded = jwt.verify(token, JWT_SECRET || "");

    if (typeof decoded === "string" || !decoded.userId) {
      res.clearCookie("userToken", {
        httpOnly: true,
        secure: true,
        maxAge: 0,
      });
      return ApiResponse.sendResponse(
        res,
        "Invalid Token, please Login again.",
        400,
        {},
        false
      );
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.clearCookie("userToken", { httpOnly: true, secure: true, maxAge: 0 });
    ApiResponse.errorHandler(res, error);
  }
};

export { checkToken };
