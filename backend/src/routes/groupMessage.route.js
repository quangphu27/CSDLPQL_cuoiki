// routes/groupMessage.routes.js
import express from "express";
import { sendMessageToGroup, getMessagesForGroup } from "../controllers/groupMessage.controller.js";

const router = express.Router();

// Gửi tin nhắn vào nhóm
router.post("/:groupId/messages", sendMessageToGroup);

// Lấy tin nhắn của nhóm
router.get("/:groupId/messages", getMessagesForGroup);

export default router;
