import jwt from "jsonwebtoken";
import { User } from "../Models/user.js";

export const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(400).json({
      success: true,
      message: "Login into your account first",
    });
  }

  const decode = jwt.verify(token, "fjsldajfoijf");
  req.user = await User.findById(decode._id);
  next();
};
