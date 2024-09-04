import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    bookList: [{ type: Schema.Types.ObjectId, ref: "Books" }],
    followers: [{ type: Schema.Types.ObjectId, ref: "Users" }],
    following: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  },
  { timestamps: true }
);

export const Users = model("Users", userSchema);
