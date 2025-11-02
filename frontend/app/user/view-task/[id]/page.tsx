"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Navbar from "@/components/Navbar"
import { formatDate, getStatusColor, getPriorityColor, calculateProgress } from "@/lib/helper"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/apiPaths"

export default function ViewTaskDetail() {
  const router = useRouter()
  const params = useParams()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    if (params.id) {
      fetchTask()
    }
  }, [router, params.id])

  const fetchTask = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.TASK_BY_ID(params.id as string))
      setTask(response.data)
    } catch (error) {
      console.error("Error fetching task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChecklistToggle = async (index: number) => {
    if (!task) return

    const updatedChecklist = [...task.checklist]
    updatedChecklist[index].completed = !updatedChecklist[index].completed

    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_CHECKLIST(task._id), {
        checklist: updatedChecklist,
      })
      setTask({ ...task, checklist: updatedChecklist })
    } catch (error) {
      console.error("Error updating checklist:", error)
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      await axiosInstance.put(API_PATHS.UPDATE_TASK_STATUS(task._id), { status })
      setTask({ ...task, status })
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" }}>
        <button onClick={() => router.back()} className="btn btn-secondary" style={{ marginBottom: "1rem" }}>
          ← Back
        </button>

        <div className="card">
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1.5rem" }}
          >
            <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>{task.title}</h1>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
              <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Description</h3>
            <p style={{ color: "var(--text-light)" }}>{task.description}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Due Date</p>
              <p style={{ fontWeight: "600" }}>{formatDate(task.dueDate)}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>Assigned To</p>
              <p style={{ fontWeight: "600" }}>{task.assignedTo?.name || "Unassigned"}</p>
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Update Status</h3>
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="input"
              style={{ maxWidth: "200px" }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {task.checklist && task.checklist.length > 0 && (
            <div>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}
              >
                <h3 style={{ fontWeight: "600" }}>Checklist</h3>
                <span style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                  {calculateProgress(task.checklist)}% Complete
                </span>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "var(--border)",
                  borderRadius: "4px",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}
              >
                <div
                  style={{
                    width: `${calculateProgress(task.checklist)}%`,
                    height: "100%",
                    background: "var(--success)",
                    transition: "width 0.3s",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {task.checklist.map((item: any, index: number) => (
                  <label
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      background: item.completed ? "var(--success)" : "var(--secondary)",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(index)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                    <span style={{ textDecoration: item.completed ? "line-through" : "none" }}>{item.text}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
