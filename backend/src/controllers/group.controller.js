import Group from "../models/group.model.js";  // Import model Group
import User from "../models/user.model.js";  // Import model Group

// Tạo nhóm mới
export const createGroup = async (req, res) => {
  const { name, description, users } = req.body;  // Lấy dữ liệu từ yêu cầu

  try {
    // Kiểm tra nếu tất cả người dùng có tồn tại
    const usersExist = await User.find({ '_id': { $in: users } });

    if (usersExist.length !== users.length) {
      return res.status(400).json({ message: "One or more users do not exist" });
    }

    // Tạo nhóm mới
    const newGroup = new Group({
      name,
      description,
      users,  // Thêm người dùng vào nhóm
      createdBy: req.user._id,  // Nếu cần lưu ai là người tạo nhóm
    });

    // Lưu nhóm vào cơ sở dữ liệu
    await newGroup.save();
    res.status(201).json(newGroup);  // Trả về nhóm đã tạo
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating group", error: error.message });
  }
};

// controllers/group.controller.js

// Lấy thông tin nhóm
export const getGroup = async (req, res) => {
  const { groupId } = req.params;  // Lấy groupId từ params

  try {
    const group = await Group.findById(groupId).populate('users', 'name profilePic');  // Populate để lấy thông tin người dùng

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);  // Trả về thông tin nhóm
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching group", error: error.message });
  }
};
