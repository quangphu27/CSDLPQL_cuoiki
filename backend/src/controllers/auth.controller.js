import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo token xác thực email
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    // Gửi email xác thực
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực tài khoản của bạn",
      html: `<p>Chào ${fullName},</p>
             <p>Vui lòng nhấn vào link bên dưới để xác thực tài khoản:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
    });

    res.status(201).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để xác thực." });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Tìm user với token
    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token." });

    // Cập nhật trạng thái xác thực
    user.verificationToken = undefined;
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.log("Error in verifyEmail controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = resetToken;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password:</p>
             <a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.status(200).json({ message: "Password reset email sent!" });
  } catch (error) {
    console.log("Error in forgotPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid or expired token." });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully!" });
  } catch (error) {
    console.log("Error in resetPassword controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let isAdmin = false;
    if (email === 'phu2722002@gmail.com') {
      isAdmin = true;  // Đánh dấu là admin
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      isAdmin: isAdmin,  // Gửi thông tin là admin
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const logout = (req, res) => {
try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
