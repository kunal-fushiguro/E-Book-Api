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
import { profilePicUpdate } from "../middlewares/fileUploadUser";

const routes = Router();

// User Routes
routes.route("/users").post(registerUser);
routes.route("/users/login").post(loginUser);
routes.route("/users").patch(checkToken, profilePicUpdate, updateUser);
routes.route("/users").delete(checkToken, deleteUser);
routes.route("/users").get(checkToken, getUser);
routes.route("/users/logout").get(checkToken, logoutUser);
routes.route("/users/:id").get(getUserProfile);
routes.route("users/follow/:id").patch(checkToken, follow);
routes.route("users/unfollow/:id").patch(checkToken, unFollow);

// Books Routes

export { routes };
