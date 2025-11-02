import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { PlusCircle, Trash2, X } from "lucide-react"
import { priorityOptions } from "../../utils/data"

const VPCreateTask = () => {
  const [users, setUsers] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: [],
    attachments: "",
    todoChecklist: [],
  })
  const [selectedUsers, setSelectedUsers] = useState([])
  const [newTodo, setNewTodo] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      navigate("/login")
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== "vp") {
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
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleUserToggle = (userId) => {
    const isSelected = selectedUsers.some(u => u._id === userId)
    let newSelectedUsers

    if (isSelected) {
      newSelectedUsers = selectedUsers.filter(u => u._id !== userId)
    } else {
      const user = users.find(u => u._id === userId)
      newSelectedUsers = [...selectedUsers, user]
    }

    setSelectedUsers(newSelectedUsers)
    setFormData({ ...formData, assignedTo: newSelectedUsers.map(u => u._id) })
  }

  const removeUser = (userId) => {
    const newSelectedUsers = selectedUsers.filter(u => u._id !== userId)
    setSelectedUsers(newSelectedUsers)
    setFormData({ ...formData, assignedTo: newSelectedUsers.map(u => u._id) })
  }

  const addTodoItem = () => {
    if (newTodo.trim()) {
      setFormData({
        ...formData,
        todoChecklist: [...formData.todoChecklist, { text: newTodo, completed: false }],
      })
      setNewTodo("")
    }
  }

  const removeTodoItem = (index) => {
    const updatedChecklist = formData.todoChecklist.filter((_, i) => i !== index)
    setFormData({ ...formData, todoChecklist: updatedChecklist })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (formData.assignedTo.length === 0) {
      setError("Please assign the task to at least one user")
      return
    }

    setLoading(true)

    try {
      await axiosInstance.post(API_PATHS.CREATE_TASK, formData)
      setSuccess("Task created successfully!")
      setTimeout(() => {
        navigate("/vp/manage-tasks")
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text)" }}>
          Create New Task
        </h1>

        <div className="card" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Task Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="input"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter task title"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="input"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter task description"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label htmlFor="priority">Priority *</label>
                <select
                  id="priority"
                  name="priority"
                  className="input"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dueDate">Due Date *</label>
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  className="input"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Assign To * (Select multiple users)</label>
              
              {/* Selected Users Display */}
              {selectedUsers.length > 0 && (
                <div style={{ 
                  display: "flex", 
                  flexWrap: "wrap", 
                  gap: "0.5rem", 
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  backgroundColor: "var(--background)",
                  borderRadius: "0.375rem"
                }}>
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.375rem 0.75rem",
                        backgroundColor: "var(--primary)",
                        color: "white",
                        borderRadius: "9999px",
                        fontSize: "0.875rem"
                      }}
                    >
                      <span>{user.name}</span>
                      <button
                        type="button"
                        onClick={() => removeUser(user._id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "white",
                          cursor: "pointer",
                          padding: "0",
                          display: "flex",
                          alignItems: "center"
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* User Selection List */}
              <div style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid var(--border)",
                borderRadius: "0.375rem",
                padding: "0.5rem"
              }}>
                {users.map((user) => {
                  const isSelected = selectedUsers.some(u => u._id === user._id)
                  return (
                    <label
                      key={user._id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem",
                        cursor: "pointer",
                        borderRadius: "0.375rem",
                        backgroundColor: isSelected ? "var(--background)" : "transparent",
                        transition: "background-color 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "var(--background)"
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleUserToggle(user._id)}
                        style={{ cursor: "pointer" }}
                      />
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
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
                        <div>
                          <div style={{ fontWeight: "500" }}>{user.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-light)" }}>{user.email}</div>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
              <small style={{ color: "var(--text-light)", fontSize: "0.75rem", marginTop: "0.5rem", display: "block" }}>
                Select one or more users to assign this task
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Attachments URL</label>
              <input
                type="text"
                id="attachments"
                name="attachments"
                className="input"
                value={formData.attachments}
                onChange={handleChange}
                placeholder="Enter attachment URL"
              />
            </div>

            <div className="form-group">
              <label>Todo Checklist</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <input
                  type="text"
                  className="input"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a todo item"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTodoItem())}
                />
                <button
                  type="button"
                  onClick={addTodoItem}
                  className="btn btn-primary"
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <PlusCircle size={16} />
                  Add
                </button>
              </div>

              {formData.todoChecklist.length > 0 && (
                <div style={{ marginTop: "1rem" }}>
                  {formData.todoChecklist.map((todo, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.5rem",
                        backgroundColor: "var(--background)",
                        borderRadius: "0.25rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>{todo.text}</span>
                      <button
                        type="button"
                        onClick={() => removeTodoItem(index)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Creating..." : "Create Task"}
              </button>
              <button type="button" onClick={() => navigate("/vp/manage-tasks")} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default VPCreateTask