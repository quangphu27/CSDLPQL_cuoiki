import express from "express";
import { createGroup, getGroup } from "../controllers/group.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

export default router;