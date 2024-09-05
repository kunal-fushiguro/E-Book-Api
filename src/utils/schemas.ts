import z from "zod";

const userRegisterSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be atleast 3 characters long" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Not a valid Email." }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be atleast 8 characters long" }),
});

const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Not a valid Email." }),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be atleast 8 characters long" }),
});

const updateUserSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username must be atleast 3 characters long" }),
  bio: z
    .string({ required_error: "Bio is required" })
    .min(3, { message: "Bio must be atleast 3 characters long" }),
  profilePic: z.string({ required_error: "ProfilePic is required" }),
});

const createBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be atleast 3 characters long" }),
  about: z
    .string({ required_error: "About is required" })
    .min(10, { message: "About must be atleast 10 characters long" }),
  coverImage: z.string({ required_error: "Cover Image is required." }),
  file: z.string({ required_error: "File is required." }),
});

const updateBookSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be atleast 3 characters long" }),
  about: z
    .string({ required_error: "About is required" })
    .min(10, { message: "About must be atleast 10 characters long" }),
  coverImage: z.string({ required_error: "Cover Image is required." }),
  file: z.string({ required_error: "File is required." }),
  // isPublic: z.boolean({ required_error: "isPublic is required." }),
});

const createReviewsSchema = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .min(3, { message: "Comment must be atleast 3 characters long" }),
  rate: z.number({ required_error: "Rate is required." }),
});

const updateReviewsSchema = z.object({
  comment: z
    .string({ required_error: "Comment is required" })
    .min(3, { message: "Comment must be atleast 3 characters long" }),
  rate: z.number({ required_error: "Rate is required." }),
});

export {
  userRegisterSchema,
  userLoginSchema,
  updateUserSchema,
  createBookSchema,
  updateBookSchema,
  createReviewsSchema,
  updateReviewsSchema,
};
