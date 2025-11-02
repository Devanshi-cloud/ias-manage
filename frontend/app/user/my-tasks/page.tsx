"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { formatDate, getStatusColor, getPriorityColor, calculateProgress } from "@/lib/helper"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/apiPaths"

export default function MyTasks() {
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchTasks()
  }, [router])

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
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>My Tasks</h1>

        {tasks.length > 0 ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            {tasks.map((task) => (
              <div key={task._id} className="card">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>{task.title}</h3>
                    <p style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>{task.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                    <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
                    Due: {formatDate(task.dueDate)}
                  </p>
                  {task.checklist && task.checklist.length > 0 && (
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.875rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>Progress</span>
                        <span>{calculateProgress(task.checklist)}%</span>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "8px",
                          background: "var(--border)",
                          borderRadius: "4px",
                          overflow: "hidden",
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
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link
                    href={`/user/view-task/${task._id}`}
                    className="btn btn-primary"
                    style={{ fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}
                  >
                    View Details
                  </Link>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="input"
                    style={{ width: "auto", fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "var(--text-light)" }}>No tasks assigned to you</p>
        )}
      </div>
    </div>
  )
}
