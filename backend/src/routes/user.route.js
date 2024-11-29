import express from "express";
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

// Các route liên quan đến người dùng
router.get("/", getUsers);
router.post("/", addUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


export default router;
