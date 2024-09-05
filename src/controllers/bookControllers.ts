/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Books } from "../models/bookModel";
import { ApiResponse } from "../utils/ApiResponse";
import {
  createBookSchema,
  createReviewsSchema,
  updateBookSchema,
  updateReviewsSchema,
} from "../utils/schemas";
import { Users } from "../models/usermodel";
import { Reviews } from "../models/reviewsModel";
import {
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} from "../../config/env";
import { v2 as cloudinary } from "cloudinary";

const createBook = async (req: Request, res: Response) => {
  try {
    await createBookSchema.parseAsync(req.body);

    const user = await Users.findById(req.userId);
    if (!user) {
      ApiResponse.sendResponse(res, "User not found", 400, {}, false);
    }

    // create book
    const book = await Books.create({
      userId: user?._id,
      title: req.body.title,
      about: req.body.about,
      coverImage: req.body.coverImage,
      file: req.body.file,
      isPublic: req.body.isPublic || true,
    });

    await Users.findByIdAndUpdate(
      user?._id,
      {
        $push: {
          bookList: book._id,
        },
      },
      { new: true }
    );

    ApiResponse.sendResponse(res, "Book created successfully.", 201, {}, true);
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const updateBook = async (req: Request, res: Response) => {
  try {
    await updateBookSchema.parseAsync(req.body);

    // find book and update
    const book = await Books.findById(req.params.id);
    if (!book) {
      ApiResponse.sendResponse(res, "Book not found.", 404, {}, false);
    }

    if (!(String(req.userId) == String(book?.userId))) {
      ApiResponse.sendResponse(res, "UnAuthraised Request.", 401, {}, false);
    }

    const coverImageurl = book?.coverImage.split("/") || [];
    const coverImageName = coverImageurl[coverImageurl?.length - 1];
    const coverImageId = coverImageName.split(".")[0];

    const fileUrl = book?.file.split("/") || [];
    const fileName = fileUrl[fileUrl?.length - 1];
    const fileId = fileName.split(".")[0];

    // delete old file and coverImage

    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    await cloudinary.uploader.destroy(coverImageId);
    await cloudinary.uploader.destroy(fileId);

    // update
    await Books.findByIdAndUpdate(book?._id, {
      title: req.body.title,
      about: req.body.about,
      coverImage: req.body.coverImage,
      file: req.body.file,
      isPublic: req.body.isPublic || true,
    });

    ApiResponse.sendResponse(res, "Book updated successfully.", 200, {}, true);
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const deleteBook = async (req: Request, res: Response) => {
  try {
    // find book and update
    const book = await Books.findById(req.params.id);
    if (!book) {
      ApiResponse.sendResponse(res, "Book not found.", 404, {}, false);
    }

    if (!(String(req.userId) == String(book?.userId))) {
      ApiResponse.sendResponse(res, "UnAuthraised Request.", 401, {}, false);
    }

    const coverImageurl = book?.coverImage.split("/") || [];
    const coverImageName = coverImageurl[coverImageurl?.length - 1];
    const coverImageId = coverImageName.split(".")[0];

    const fileUrl = book?.file.split("/") || [];
    const fileName = fileUrl[fileUrl?.length - 1];
    const fileId = fileName.split(".")[0];

    // delete old file and coverImage

    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });

    await cloudinary.uploader.destroy(coverImageId);
    await cloudinary.uploader.destroy(fileId);

    await Books.findByIdAndDelete(book?._id);
    await Users.findByIdAndUpdate(book?.userId, {
      $pull: { bookList: book?._id },
    });

    ApiResponse.sendResponse(res, "Book deleted successfully.", 200, {}, true);
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const getAllBook = async (req: Request, res: Response) => {
  try {
    const books = await Books.find({ isPublic: true })
      .limit(Number(req.query.limit) || 10)
      .skip(Number(req.query.skip) || 0);

    ApiResponse.sendResponse(
      res,
      "Books feteched Successfully.",
      200,
      { ...books },
      true
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const getSingleBook = async (req: Request, res: Response) => {
  try {
    const book = await Books.findById(req.params.id)
      .populate("reviews")
      .populate("userId");

    if (!book) {
      ApiResponse.sendResponse(res, "Book not found.", 404, {}, false);
    }

    ApiResponse.sendResponse(
      res,
      "Book fetched successfully",
      200,
      { book },
      true
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const addReviews = async (req: Request, res: Response) => {
  try {
    await createReviewsSchema.parseAsync(req.body);

    const findBook = await Books.findById(req.params.id);

    if (!findBook) {
      ApiResponse.sendResponse(res, "Book not found.", 404, {}, false);
    }

    const review = await Reviews.create({
      userId: req.userId,
      comment: req.body.comment,
      rate: req.body.rate,
      bookId: findBook?._id,
    });

    await Books.findByIdAndUpdate(findBook?._id, {
      $push: { reviews: review._id },
    });

    ApiResponse.sendResponse(res, "Review added on book.", 201, {}, true);
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const updateReviews = async (req: Request, res: Response) => {
  try {
    await updateReviewsSchema.parseAsync(req.body);

    // find review and update
    const review = await Reviews.findById(req.params.reviewId);

    if (!review) {
      ApiResponse.sendResponse(res, "Review not found.", 404, {}, false);
    }

    if (!(String(req.userId) == String(review?.userId))) {
      ApiResponse.sendResponse(res, "UnAuthraised Request.", 401, {}, false);
    }

    await Reviews.findByIdAndUpdate(review?._id, {
      rate: req.body.rate,
      comment: req.body.comment,
    });

    ApiResponse.sendResponse(
      res,
      "Review updated successfully.",
      200,
      {},
      true
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const removeReviews = async (req: Request, res: Response) => {
  try {
    // find review and update
    const review = await Reviews.findById(req.params.reviewId);

    if (!review) {
      ApiResponse.sendResponse(res, "Review not found.", 404, {}, false);
    }

    if (!(String(req.userId) == String(review?.userId))) {
      ApiResponse.sendResponse(res, "UnAuthraised Request.", 401, {}, false);
    }

    await Reviews.findByIdAndDelete(review?._id);
    await Books.findByIdAndUpdate(review?.bookId, {
      $pull: { reviews: review?._id },
    });

    ApiResponse.sendResponse(
      res,
      "Review deleted successfully.",
      200,
      {},
      true
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const likeReviews = async (req: Request, res: Response) => {
  try {
    // find review
    const review = await Reviews.findById(req.params.id);
    if (!review) {
      ApiResponse.sendResponse(res, "Review not found.", 404, {}, false);
    }

    const likes = Number(review?.likes) + 1;
    await Reviews.findByIdAndUpdate(review?._id, {
      likes: likes,
    });

    ApiResponse.sendResponse(res, "Review liked successfully.", 200, {}, true);
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};
const unLikeReviews = async (req: Request, res: Response) => {
  try {
    // find review
    const review = await Reviews.findById(req.params.id);
    if (!review) {
      ApiResponse.sendResponse(res, "Review not found.", 404, {}, false);
    }

    const likes = Number(review?.likes) - 1;
    await Reviews.findByIdAndUpdate(review?._id, {
      likes: likes,
    });

    ApiResponse.sendResponse(
      res,
      "Review unliked successfully.",
      200,
      {},
      true
    );
  } catch (error: any) {
    ApiResponse.errorHandler(res, error);
  }
};

// aggregation pipelines for reviews in books
export {
  createBook,
  updateBook,
  deleteBook,
  getAllBook,
  getSingleBook,
  addReviews,
  updateReviews,
  removeReviews,
  likeReviews,
  unLikeReviews,
};
