import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { Users } from "../models/usermodel";
import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../../config/env";

const profilePicUpdate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    const findUser = await Users.findById(req.userId);
    if (!findUser) {
      ApiResponse.sendResponse(res, "User not found.", 404, {}, false);
    }

    // delete the old image
    if (!(findUser?.profilePic === "")) {
      const imgUrl = findUser?.profilePic.split("/") || [];
      const imgName = imgUrl[imgUrl?.length - 1];
      const id = imgName.split(".")[0];

      await cloudinary.uploader.destroy(id);
    }

    // upload new one
    const url = await cloudinary.uploader.upload(req.body.profilePic);

    req.body.profilePic = url.secure_url;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};

export { profilePicUpdate };
