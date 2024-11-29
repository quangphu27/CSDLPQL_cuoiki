import React, { useState, useEffect } from "react";
import axios from "axios";

// Inline styles để trang trí giao diện
const styles = {
  container: {
    margin: "20px",
    fontFamily: "Arial, sans-serif",
    color: "#333",
  },
  formContainer: {
    backgroundColor: "#f4f4f9",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    border: "1px solid #ccc",
    borderRadius: "5px",
    color: "white", // Màu chữ khi nhập vào
    backgroundColor: "#333",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "10px 0",
  },
  buttonEdit: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },
  buttonDelete: {
    padding: "10px 20px",
    backgroundColor: "#FF5733",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    margin: "5px",
  },
  userList: {
    listStyleType: "none",
    padding: "0",
  },
  userItem: {
    backgroundColor: "#f9f9f9",
    padding: "15px",
    margin: "10px 0",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "", phone: "", address: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Thêm người dùng mới
  const handleAddUser = async () => {
    try {
      console.log("Adding user:", newUser); // Kiểm tra dữ liệu đang gửi
      const response = await axios.post("http://localhost:5001/api/users", newUser);
      console.log("User added:", response.data); // Kiểm tra dữ liệu nhận về
      setUsers([...users, response.data]);
      setNewUser({ fullName: "", email: "", password: "", phone: "", address: "" }); // Reset form
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Cập nhật thông tin người dùng
  const handleEditUser = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/users/${editingUser._id}`,
        editingUser
      );
      setUsers(
        users.map((user) => (user._id === editingUser._id ? response.data : user))
      );
      setEditingUser(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Xóa người dùng
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Admin User Management</h1>

      {/* Form Thêm Người Dùng */}
      <div style={styles.formContainer}>
        <h2>Add New User</h2>
        <input
          style={styles.input}
          type="text"
          placeholder="Full Name"
          value={newUser.fullName}
          onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
        />
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />

        <button style={styles.button} onClick={handleAddUser}>Add User</button>
      </div>

      <h2>List of Users</h2>

      {/* Danh Sách Người Dùng */}
      <ul style={styles.userList}>
        {users.map((user) => (
          <li key={user._id} style={styles.userItem}>
            <span>{user.fullName} - {user.email}</span>
            <div>
              <button
                style={styles.buttonEdit}
                onClick={() => {
                  setEditingUser(user);
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
              <button
                style={styles.buttonDelete}
                onClick={() => handleDeleteUser(user._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Form Chỉnh Sửa Người Dùng */}
      {isEditing && editingUser && (
        <div style={styles.formContainer}>
          <h2>Edit User</h2>
          <input
            style={styles.input}
            type="text"
            value={editingUser.fullName}
            onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
          />
          <input
            style={styles.input}
            type="email"
            value={editingUser.email}
            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
          />
        
          <button style={styles.button} onClick={handleEditUser}>Update User</button>
          <button style={styles.button} onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
