"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { ArrowLeft, Calendar, User, CheckCircle2, Circle } from "lucide-react"
import { formatDate, getPriorityColor, isOverdue } from "../../utils/helper"
import { statusOptions } from "../../utils/data"

const ViewTaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_TASK_BY_ID(id))
      setTask(response.data)
    } catch (error) {
      console.error("Error fetching task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_STATUS(id), { status: newStatus })
      fetchTask()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    } finally {
      setUpdating(false)
    }
  }

  const handleChecklistToggle = async (index) => {
    const updatedChecklist = [...task.todoChecklist]
    updatedChecklist[index].completed = !updatedChecklist[index].completed

    setUpdating(true)
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_CHECKLIST(id), {
        todoChecklist: updatedChecklist,
      })
      fetchTask()
    } catch (error) {
      console.error("Error updating checklist:", error)
      alert("Failed to update checklist")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading task...</p>
        </div>
      </>
    )
  }

  if (!task) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Task not found</p>
        </div>
      </>
    )
  }

  const overdue = isOverdue(task.dueDate, task.status)

  return (
    <>
      <Navbar />
      <div className="container">
        <button
          onClick={() => navigate("/user/my-tasks")}
          className="btn btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}
        >
          <ArrowLeft size={16} />
          Back to Tasks
        </button>

        <div className="card" style={{ maxWidth: "900px", margin: "0 auto" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem", color: "var(--text)" }}>
                {task.title}
              </h1>
              {overdue && (
                <div style={{ color: "var(--danger)", fontSize: "0.875rem", fontWeight: "600" }}>
                  ⚠️ This task is overdue
                </div>
              )}
            </div>
            <span
              className={`badge ${getPriorityColor(task.priority)}`}
              style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
            >
              {task.priority}
            </span>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Description</h3>
            <p style={{ color: "var(--text-light)", lineHeight: "1.6" }}>
              {task.description || "No description provided"}
            </p>
          </div>

          {/* Task Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div>
              <h4 style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>Status</h4>
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="input"
                disabled={updating}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h4 style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>Due Date</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={16} />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>Assigned To</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={16} />
                <span>{task.assignedTo?.name || "Unassigned"}</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>Progress</h4>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div
                  style={{
                    flex: 1,
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
                <span style={{ fontSize: "0.875rem", fontWeight: "600" }}>{task.progress || 0}%</span>
              </div>
            </div>
          </div>

          {/* Checklist */}
          {task.todoChecklist && task.todoChecklist.length > 0 && (
            <div style={{ marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem" }}>
                Checklist ({task.todoChecklist.filter((item) => item.completed).length}/{task.todoChecklist.length})
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {task.todoChecklist.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      backgroundColor: item.completed ? "var(--background)" : "white",
                      border: "1px solid var(--border)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                    onClick={() => handleChecklistToggle(index)}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={20} style={{ color: "var(--success)", flexShrink: 0 }} />
                    ) : (
                      <Circle size={20} style={{ color: "var(--text-light)", flexShrink: 0 }} />
                    )}
                    <span
                      style={{
                        textDecoration: item.completed ? "line-through" : "none",
                        color: item.completed ? "var(--text-light)" : "var(--text)",
                      }}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {task.attachments && (
            <div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem" }}>Attachments</h3>
              <a
                href={task.attachments}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--primary)", textDecoration: "underline" }}
              >
                View Attachment
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ViewTaskDetail
