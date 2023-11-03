import express from "express";
import {
  register,
  login,
  logout,
  getMyProfile,
} from "../Controllers/userController.js";
import { isAuthenticated } from "../Middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", isAuthenticated, getMyProfile);
router.get("/logout", logout);

export default router;
