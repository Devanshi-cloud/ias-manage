import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { Edit, Trash2, Download, Eye, Users as UsersIcon } from "lucide-react"
import { formatDate, getPriorityColor, getStatusColor } from "../../utils/helper"
import { filterOptions } from "../../utils/data"

const HeadManageTasks = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filter, setFilter] = useState("All")
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)

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
    fetchTasks()
  }, [navigate])

  useEffect(() => {
    if (filter === "All") {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === filter))
    }
  }, [filter, tasks])

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_TASKS)
      setTasks(response.data.tasks || [])
      setFilteredTasks(response.data.tasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await axiosInstance.delete(API_PATHS.DELETE_TASK(taskId))
        fetchTasks()
      } catch (error) {
        console.error("Error deleting task:", error)
        alert("Failed to delete task")
      }
    }
  }

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPORT_TASKS, {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "tasks_report.xlsx")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error("Error exporting tasks:", error)
      alert("Failed to export tasks")
    }
  }

  const viewTaskDetails = (task) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  const renderAssignedUsers = (assignedTo) => {
    if (!assignedTo || assignedTo.length === 0) {
      return <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>Unassigned</span>
    }

    // Handle both array and single object cases
    const users = Array.isArray(assignedTo) ? assignedTo : [assignedTo]

    if (users.length === 1) {
      const user = users[0]
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {user.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt={user.name}
              style={{ width: "24px", height: "24px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <div
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "0.75rem",
                fontWeight: "600"
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <span>{user.name}</span>
        </div>
      )
    }

    // Multiple users - show avatars stacked
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{ display: "flex", marginLeft: "0" }}>
          {users.slice(0, 3).map((user, index) => (
            user.profileImageUrl ? (
              <img
                key={user._id}
                src={user.profileImageUrl}
                alt={user.name}
                title={user.name}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginLeft: index > 0 ? "-8px" : "0",
                  border: "2px solid white",
                  position: "relative",
                  zIndex: users.length - index
                }}
              />
            ) : (
              <div
                key={user._id}
                title={user.name}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "0.75rem",
                  fontWeight: "600",
                  marginLeft: index > 0 ? "-8px" : "0",
                  border: "2px solid white",
                  position: "relative",
                  zIndex: users.length - index
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            )
          ))}
        </div>
        <span style={{ fontSize: "0.875rem" }}>
          {users.length > 3 ? `${users.length} users` : users.map(u => u.name.split(' ')[0]).join(', ')}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading tasks...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text)" }}>Manage Tasks</h1>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleExport}
              className="btn btn-secondary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Download size={16} />
              Export Tasks
            </button>
            <button onClick={() => navigate("/head/create-task")} className="btn btn-primary">
              Create New Task
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className="btn"
              style={{
                backgroundColor: filter === option.value ? "var(--primary)" : "white",
                color: filter === option.value ? "white" : "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Tasks Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td style={{ fontWeight: "600" }}>{task.title}</td>
                    <td>{renderAssignedUsers(task.assignedTo)}</td>
                    <td>
                      <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
                    </td>
                    <td>{formatDate(task.dueDate)}</td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "100px",
                            height: "8px",
                            backgroundColor: "var(--border)",
                            borderRadius: "4px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${task.progress || 0}%`,
                              height: "100%",
                              backgroundColor: "var(--success)",
                              transition: "width 0.3s",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>{task.progress || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => viewTaskDetails(task)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => navigate(`/head/edit-task/${task._id}`)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
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
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Details Modal */}
      {showModal && selectedTask && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>{selectedTask.title}</h2>

            <div style={{ marginBottom: "1rem" }}>
              <strong>Description:</strong>
              <p style={{ marginTop: "0.5rem", color: "var(--text-light)" }}>
                {selectedTask.description || "No description"}
              </p>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <strong>Assigned To:</strong>
              <div style={{ marginTop: "0.5rem" }}>
                {selectedTask.assignedTo && selectedTask.assignedTo.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {(Array.isArray(selectedTask.assignedTo) ? selectedTask.assignedTo : [selectedTask.assignedTo]).map((user) => (
                      <div key={user._id} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt={user.name}
                            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              backgroundColor: "var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "0.875rem",
                              fontWeight: "600"
                            }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{user.name}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span style={{ color: "var(--text-light)" }}>Unassigned</span>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <strong>Priority:</strong>
                <p>
                  <span className={`badge ${getPriorityColor(selectedTask.priority)}`}>{selectedTask.priority}</span>
                </p>
              </div>
              <div>
                <strong>Status:</strong>
                <p>
                  <span className={`badge ${getStatusColor(selectedTask.status)}`}>{selectedTask.status}</span>
                </p>
              </div>
              <div>
                <strong>Due Date:</strong>
                <p>{formatDate(selectedTask.dueDate)}</p>
              </div>
              <div>
                <strong>Progress:</strong>
                <p>{selectedTask.progress || 0}%</p>
              </div>
            </div>

            {selectedTask.todoChecklist && selectedTask.todoChecklist.length > 0 && (
              <div style={{ marginBottom: "1rem" }}>
                <strong>Checklist:</strong>
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                  {selectedTask.todoChecklist.map((item, index) => (
                    <li key={index} style={{ textDecoration: item.completed ? "line-through" : "none" }}>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button onClick={() => setShowModal(false)} className="btn btn-primary" style={{ width: "100%" }}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default HeadManageTasks