// backend/controllers/user.controller.js
import User from "../models/user.model.js"; // Đảm bảo đúng với tên file
import bcrypt from "bcryptjs";  // Đảm bảo rằng bcrypt được nhập khẩu

// Lấy danh sách người dùng
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Tìm tất cả người dùng trong DB
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  const salt = await bcrypt.genSalt(10); 
  const hashedPassword = await bcrypt.hash(password, salt);
  // Tạo người dùng mới với trường isVerified mặc định là true
  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    isVerified: true, // Mặc định isVerified là true
  });

  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật thông tin người dùng
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullName, email, password } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { fullName, email, password },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa người dùng
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
