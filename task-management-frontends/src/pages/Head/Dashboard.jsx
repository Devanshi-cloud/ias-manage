"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../../components/Navbar"
import StatCard from "../../components/StatCard"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const HeadDashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify user is Head
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

    fetchDashboardData()
  }, [navigate])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DEPARTMENT_DASHBOARD_DATA)
      setDashboardData(response.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type) => {
    try {
      const url = type === "tasks" ? API_PATHS.EXPORT_TASKS : API_PATHS.EXPORT_USERS
      const response = await axiosInstance.get(url, { responseType: "blob" })
      const blob = new Blob([response.data])
      const link = document.createElement("a")
      link.href = window.URL.createObjectURL(blob)
      link.download = `${type}-report.xlsx`
      link.click()
    } catch (error) {
      console.error("Error exporting:", error)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Department Dashboard</h1>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={() => handleExport("tasks")} className="btn btn-primary">
              Export Tasks
            </button>
            <button onClick={() => handleExport("users")} className="btn btn-secondary">
              Export Users
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard title="Total Tasks" value={dashboardData?.statistics?.totalTasks || 0} icon={ListTodo} color="var(--primary)" />
          <StatCard title="Pending" value={dashboardData?.statistics?.pendingTasks || 0} icon={Clock} color="var(--warning)" />
          <StatCard title="In Progress" value={dashboardData?.statistics?.inProgressTasks || 0} icon={Clock} color="var(--primary)" />
          <StatCard title="Completed" value={dashboardData?.statistics?.completedTasks || 0} icon={CheckCircle2} color="var(--success)" />
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Department Tasks</h2>
          {dashboardData?.recentTasks?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {dashboardData.recentTasks.map((task) => (
                <div key={task._id} style={{ padding: "1rem", background: "var(--secondary)", borderRadius: "0.5rem" }}>
                  <h3 style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{task.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-light)" }}>
                    Status: {task.status} | Priority: {task.priority}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--text-light)" }}>No recent tasks</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default HeadDashboard