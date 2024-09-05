import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import path from "path";
import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../../config/env";
import fs from "fs";

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

const bookfileUpload = async (
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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (!files.coverImage[0] || !files.file[0]) {
      ApiResponse.sendResponse(
        res,
        "CoverImage and file is required.",
        400,
        {},
        false
      );
    }

    const coverImagePath = files.coverImage[0].path;
    const filePath = files.file[0].path;

    const coverImageUrl = await cloudinary.uploader.upload(coverImagePath);

    fs.unlink(coverImagePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      }
    });

    const fileUrl = await cloudinary.uploader.upload(filePath, {
      format: "pdf",
      resource_type: "auto",
    });

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      }
    });

    req.body.coverImage = coverImageUrl.secure_url;
    req.body.file = fileUrl.secure_url;

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};

export { upload as fileUpload, bookfileUpload };
