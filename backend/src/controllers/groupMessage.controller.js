// controllers/groupMessage.controller.js
import Message from "../models/message.model.js";
import Group from "../models/group.model.js";

// Gửi tin nhắn vào nhóm
export const sendMessageToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { senderId, text, image } = req.body;

  try {
    // Tạo một tin nhắn mới
    const newMessage = new Message({
      senderId,
      groupId,
      text,
      image,
    });

    await newMessage.save();

    // Emit sự kiện tin nhắn mới đến nhóm qua socket.io
    req.app.get("socket").to(groupId).emit("newMessage", newMessage);

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getMessagesForGroup = async (req, res) => {
    const { groupId } = req.params;
  
    try {
      const messages = await Message.find({ groupId })
        .populate("senderId", "name profilePic")
        .sort({ createdAt: 1 });  // Sắp xếp tin nhắn theo thời gian
  
      res.status(200).json(messages);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };