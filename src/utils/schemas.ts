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

export { userRegisterSchema, userLoginSchema, updateUserSchema };
