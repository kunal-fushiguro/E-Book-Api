import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  MONGODB_URL,
  NODE_ENV,
  JWT_SECRET,
  CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
