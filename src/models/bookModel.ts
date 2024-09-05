import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
    },
    coverImage: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews" }],
  },
  { timestamps: true }
);

export const Books = model("Books", bookSchema);
