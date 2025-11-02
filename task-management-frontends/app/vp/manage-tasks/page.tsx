"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import TaskCard from "@/components/TaskCard"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/apiPaths"

export default function ManageTasks() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("edit")

  const [tasks, setTasks] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingTask, setEditingTask] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    status: "pending",
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(user)
    // Allow admin, vp, and head to access this page
    if (userData.role !== "admin" && userData.role !== "vp" && userData.role !== "head") {
      router.push("/user/dashboard") // Redirect regular members
      return
    }

    fetchTasks()
    fetchUsers()
  }, [router])

  useEffect(() => {
    if (editId && tasks.length > 0) {
      const task = tasks.find((t) => t._id === editId)
      if (task) {
        handleEdit(task)
      }
    }
  }, [editId, tasks])

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS)
      setTasks(response.data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleEdit = (task: any) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
      assignedTo: task.assignedTo?._id || "",
      status: task.status,
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axiosInstance.put(API_PATHS.TASK_BY_ID(editingTask._id), formData)
      setShowEditModal(false)
      fetchTasks()
      // Remove edit query param
      router.push("/admin/manage-tasks")
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await axiosInstance.delete(API_PATHS.TASK_BY_ID(id))
      fetchTasks()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_STATUS(id), { status })
      fetchTasks()
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Manage Tasks</h1>

        {tasks.length > 0 ? (
          <div>
            {tasks.map((task) => (
              <div key={task._id} style={{ marginBottom: "1rem" }}>
                <TaskCard task={task} onStatusChange={handleStatusChange} />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleEdit(task)}
                    className="btn btn-primary"
                    style={{ fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="btn btn-danger"
                    style={{ fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-light)" }}>No tasks found</p>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div className="card" style={{ maxWidth: "600px", width: "90%", maxHeight: "90vh", overflow: "auto" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Edit Task</h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assign To</label>
                <select
                  className="input"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  required
                >
                  <option value="">Select User</option>
                  {users.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false)
                    router.push("/admin/manage-tasks")
                  }}
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
    </div>
  )
}
