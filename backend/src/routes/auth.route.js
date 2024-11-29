import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify-email/:token", verifyEmail); // Xác thực email
router.post("/forgot-password", forgotPassword); // Quên mật khẩu
router.post("/reset-password/:token", resetPassword); // Đặt lại mật khẩu
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
