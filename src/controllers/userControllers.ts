/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import {
  updateUserSchema,
  userLoginSchema,
  userRegisterSchema,
} from "../utils/schemas";
import { Users } from "../models/usermodel";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../../config/env";
import { v2 as cloudinary } from "cloudinary";

const registerUser = async (req: Request, res: Response) => {
  try {
    await userRegisterSchema.parseAsync(req.body);
    const { username, email, password } = req.body;

    const userExistOrNot = await Users.findOne({ email: email });

    if (userExistOrNot) {
      ApiResponse.sendResponse(
        res,
        "Email is registered already.",
        400,
        {},
        false
      );
    }

    const encryptPassword = await bcryptjs.hash(password, 12);

    await Users.create({
      username: username,
      email: email,
      password: encryptPassword,
    });

    ApiResponse.sendResponse(
      res,
      "Email Register SuccessFully , please login.",
      201,
      {},
      true
    );
  } catch (error: any) {
    return ApiResponse.errorHandler(res, error);
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    await userLoginSchema.parseAsync(req.body);
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email }).select("+password");

    const isPasswordValidOrNot = await bcryptjs.compare(
      password,
      user?.password || ""
    );

    if (!isPasswordValidOrNot) {
      ApiResponse.sendResponse(res, "Invalid Credintails", 401, {}, false);
    }

    const generateToken = await jwt.sign(
      { userId: user?._id },
      JWT_SECRET || "",
      {
        expiresIn: "7d",
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("userToken", generateToken, options);

    ApiResponse.sendResponseWithUserData(
      res,
      "User Login SuccessFully.",
      200,
      true,
      user
    );
  } catch (error: any) {
    return ApiResponse.errorHandler(res, error);
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      ApiResponse.sendResponse(res, "User Id not found.", 400, {}, false);
    }

    await updateUserSchema.parseAsync(req.body);

    const updatedUser = await Users.findByIdAndUpdate(
      req.userId,
      {
        username: req.body.username,
        bio: req.body.bio,
        profilePic: req.body.profilePic,
      },
      { new: true }
    );

    ApiResponse.sendResponseWithUserData(
      res,
      "User Updated Successfully.",
      200,
      true,
      updatedUser
    );
  } catch (error: any) {
    return ApiResponse.errorHandler(res, error);
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      ApiResponse.sendResponse(res, "User Id not found.", 400, {}, false);
    }

    const user = await Users.findByIdAndDelete(req.userId);

    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
    const imgUrl = user?.profilePic.split("/") || [];
    const imgName = imgUrl[imgUrl?.length - 1];
    const id = imgName.split(".")[0];

    await cloudinary.uploader.destroy(id);

    res.clearCookie("userToken", { httpOnly: true, secure: true, maxAge: 0 });
    ApiResponse.sendResponse(res, "User deleted successfully.", 200, {}, true);
  } catch (error: any) {
    return ApiResponse.errorHandler(res, error);
  }
};
const getUser = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      ApiResponse.sendResponse(res, "User Id not found.", 400, {}, false);
    }
    const user = await Users.findById(req.userId).populate([
      // "bookList",
      "followers",
      "following",
    ]);

    if (!user) {
      ApiResponse.sendResponse(res, "User not found.", 404, {}, false);
    }

    ApiResponse.sendResponseWithUserData(
      res,
      "User data feteched successfully.",
      200,
      true,
      user
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("userToken", { httpOnly: true, secure: true, maxAge: 0 });
  ApiResponse.sendResponse(res, "User logout successfully.", 200, {}, true);
};
const getUserProfile = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) {
      ApiResponse.sendResponse(res, "User Id not found.", 400, {}, false);
    }

    const user = await Users.findById(req.params.id).populate([
      "bookList",
      "followers",
      "following",
    ]);

    if (!user) {
      ApiResponse.sendResponse(res, "User not found.", 404, {}, false);
    }

    ApiResponse.sendResponseWithUserData(
      res,
      "User Find successfully.",
      200,
      true,
      user
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const follow = async (req: Request, res: Response) => {
  try {
    if (!req.params.id || !req.userId) {
      ApiResponse.sendResponse(res, "User Ids are required.", 400, {}, false);
    }

    const findUserWhoFollow = await Users.findById(req.userId);
    const findUserWhoGetFollower = await Users.findById(req.params.id);

    if (!findUserWhoFollow || !findUserWhoGetFollower) {
      ApiResponse.sendResponse(res, "Users Not Found.", 400, {}, false);
    }

    const updatedUserWhoFollow = await Users.findByIdAndUpdate(
      findUserWhoFollow?._id,
      {
        $push: {
          following: findUserWhoGetFollower?._id,
        },
      },
      { new: true }
    );

    await Users.findByIdAndUpdate(findUserWhoGetFollower?._id, {
      $push: {
        followers: findUserWhoFollow?._id,
      },
    });

    ApiResponse.sendResponseWithUserData(
      res,
      "User Follow Successfully.",
      200,
      true,
      updatedUserWhoFollow
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const unFollow = async (req: Request, res: Response) => {
  try {
    if (!req.params.id || !req.userId) {
      ApiResponse.sendResponse(res, "User Ids are required.", 400, {}, false);
    }

    const findUserWhoUnfollow = await Users.findById(req.userId);
    const findUserWhoGetUnfollow = await Users.findById(req.params.id);

    if (!findUserWhoUnfollow || !findUserWhoGetUnfollow) {
      ApiResponse.sendResponse(res, "Users Not Found.", 400, {}, false);
    }

    const updatedUserWhoFollow = await Users.findByIdAndUpdate(
      findUserWhoUnfollow?._id,
      {
        $pull: {
          following: findUserWhoGetUnfollow?._id,
        },
      },
      { new: true }
    );

    await Users.findByIdAndUpdate(findUserWhoGetUnfollow?._id, {
      $pull: {
        followers: findUserWhoUnfollow?._id,
      },
    });

    ApiResponse.sendResponseWithUserData(
      res,
      "User Unfollow Successfully.",
      200,
      true,
      updatedUserWhoFollow
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};

export {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getUser,
  logoutUser,
  getUserProfile,
  follow,
  unFollow,
};
