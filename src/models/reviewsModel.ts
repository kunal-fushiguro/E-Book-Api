import { Schema, model } from "mongoose";

const reviewsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    rate: {
      type: Number,
      required: true,
    },
    bookId: {
      type: Schema.Types.ObjectId,
      ref: "Books",
    },
  },
  { timestamps: true }
);

export const Reviews = model("Reviews", reviewsSchema);
