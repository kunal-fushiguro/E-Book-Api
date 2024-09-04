import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { Users } from "../models/usermodel";
import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../../config/env";
import multer from "multer";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const uploadPath = path.resolve(__dirname, "../uploads/");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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

    const file = req.file;
    if (!file) {
      return ApiResponse.sendResponse(res, "No file uploaded.", 400, {}, false);
    }
    // upload new one
    const url = await cloudinary.uploader.upload(file?.path);

    req.body.profilePic = url.secure_url;

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      }
    });

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};

export { profilePicUpdate, upload };
