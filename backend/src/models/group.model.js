import mongoose from "mongoose";

// Mô hình nhóm
const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  // Liên kết với mô hình User
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Người tạo nhóm
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;
