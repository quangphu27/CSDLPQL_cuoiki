import express from "express";
import { createGroup, getGroup } from "../controllers/group.controller.js";

const router = express.Router();

// Tạo nhóm mới
router.post("/", createGroup);

// Lấy thông tin nhóm
router.get("/:groupId", getGroup);  // Sử dụng getGroup thay vì getGroupById

export default router;
