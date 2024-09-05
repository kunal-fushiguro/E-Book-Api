import { Router } from "express";
import {
  deleteUser,
  follow,
  getUser,
  getUserProfile,
  loginUser,
  logoutUser,
  registerUser,
  unFollow,
  updateUser,
} from "../controllers/userControllers";
import { checkToken } from "../middlewares/authMiddleware";
import { profilePicUpdate, upload } from "../middlewares/fileUploadUser";
import { bookfileUpload, fileUpload } from "../middlewares/fileUploadBook";
import {
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
} from "../controllers/bookControllers";

const routes = Router();

// User Routes
routes.route("/users").post(registerUser);
routes.route("/users/login").post(loginUser);
routes
  .route("/users")
  .patch(checkToken, upload.single("profilePic"), profilePicUpdate, updateUser);
routes.route("/users").delete(checkToken, deleteUser);
routes.route("/users").get(checkToken, getUser);
routes.route("/users/logout").get(checkToken, logoutUser);
routes.route("/users/:id").get(getUserProfile);
routes.route("users/follow/:id").patch(checkToken, follow);
routes.route("users/unfollow/:id").patch(checkToken, unFollow);

// Books Routes
routes.route("/books").post(
  checkToken,
  fileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  bookfileUpload,
  createBook
);
routes.route("/books/:id").patch(
  checkToken,
  fileUpload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  bookfileUpload,
  updateBook
);
routes.route("/books/:id").delete(checkToken, deleteBook);
routes.route("/books").get(getAllBook);
routes.route("/books/:id").get(getSingleBook);
routes.route("/books/r/:id").post(checkToken, addReviews);
routes.route("/books/r/:reviewId").patch(checkToken, updateReviews);
routes.route("/books/r/:reviewId").delete(checkToken, removeReviews);
routes.route("/books/r/l/:id").post(checkToken, likeReviews);
routes.route("/books/r/l/:id").delete(checkToken, unLikeReviews);
export { routes };
