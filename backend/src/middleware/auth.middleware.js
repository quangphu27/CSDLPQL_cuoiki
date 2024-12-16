import jwt from 'jsonwebtoken';
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Bỏ qua middleware này cho route '/signup'
    if (req.originalUrl === "/api/auth/signup") {
      return next();
    }

    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Tìm kiếm user từ decoded token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
