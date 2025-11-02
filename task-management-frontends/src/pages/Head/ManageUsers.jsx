"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { Download, User } from "lucide-react"
import { useNavigate } from "react-router-dom"

const HeadManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/login")
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== "head") {
      navigate("/user/dashboard")
      return
    }
    fetchUsers()
  }, [navigate])

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


  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        await axiosInstance.delete(`${API_PATHS.DELETE_USER}/${userId}`);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user");
      }
    }
  };

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
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text)" }}>Manage Users</h1>
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
                            src={user.profileImageUrl || "/placeholder.svg"}
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
                      <button onClick={() => handleDelete(user._id)} className="btn btn-danger">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default HeadManageUsers