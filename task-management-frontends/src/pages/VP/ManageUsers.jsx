"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { Download, User, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthday: "",
    iasPosition: "",
  })
  const navigate = useNavigate()

  const iasPositions = [
    "COMMUNICATION",
    "FINANCE",
    "DESIGN AND MEDIA",
    "TECH",
    "HOSPITALITY",
    "Other"
  ]

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_USERS)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPORT_USERS, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "users_report.xlsx")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error exporting users:", error)
      alert("Failed to export users")
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || "",
      email: user.email || "",
      birthday: user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : "",
      iasPosition: user.iasPosition || "",
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axiosInstance.put(API_PATHS.UPDATE_USER(editingUser._id), formData)
      setShowEditModal(false)
      fetchUsers()
      alert("User updated successfully")
    } catch (error) {
      console.error("Error updating user:", error)
      alert(error.response?.data?.message || "Failed to update user")
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await axiosInstance.delete(`${API_PATHS.DELETE_USER}/${userId}`)
        setUsers(users.filter((user) => user._id !== userId))
        alert("User deleted successfully")
      } catch (error) {
        console.error("Error deleting user:", error)
        alert(error.response?.data?.message || "Failed to delete user")
      }
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading users...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text)" }}>Manage Department Users</h1>
          <button
            onClick={handleExport}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Download size={16} />
            Export Users
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Birthday</th>
                <th>Position</th>
                <th>Pending Tasks</th>
                <th>In Progress</th>
                <th>Completed</th>
                <th>Total Tasks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={user.name}
                            style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                            }}
                          >
                            <User size={20} />
                          </div>
                        )}
                        <span style={{ fontWeight: "600" }}>{user.name}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.birthday ? new Date(user.birthday).toLocaleDateString() : "N/A"}</td>
                    <td>{user.iasPosition || "N/A"}</td>
                    <td>
                      <span className="badge badge-pending">{user.pendingTasks || 0}</span>
                    </td>
                    <td>
                      <span className="badge badge-progress">{user.inProgressTasks || 0}</span>
                    </td>
                    <td>
                      <span className="badge badge-completed">{user.completedTasks || 0}</span>
                    </td>
                    <td style={{ fontWeight: "600" }}>
                      {(user.pendingTasks || 0) + (user.inProgressTasks || 0) + (user.completedTasks || 0)}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(user)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center", padding: "2rem" }}>
                    No users found in your department
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>
              Edit User: {editingUser.name}
            </h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthday">Birthday</label>
                <input
                  type="date"
                  id="birthday"
                  className="input"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="iasPosition">IAS Position</label>
                <select
                  id="iasPosition"
                  className="input"
                  value={formData.iasPosition}
                  onChange={(e) => setFormData({ ...formData, iasPosition: e.target.value })}
                >
                  <option value="">Select Position</option>
                  {iasPositions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default ManageUsers