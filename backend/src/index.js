import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import groupRoutes from "./routes/groupRoutes.route.js";  // Route xử lý nhóm
import groupMessageRoutes from "./routes/groupMessage.route.js";  // Route xử lý tin nhắn nhóm
import path from "path";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js"; // Import router mới

import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Gắn các router
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Thêm các route cho nhóm và tin nhắn nhóm
// app.use("/api/groups", groupRoutes);  // Route xử lý nhóm
// app.use("/api/groups/:groupId/messages", groupMessageRoutes);  // Route xử lý tin nhắn nhóm

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
