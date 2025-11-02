"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import StatCard from "@/components/StatCard"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/apiPaths"

export default function DepartmentDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== "vp" && userData.role !== "head") {
      // Redirect if not VP or Head
      if (userData.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/dashboard")
      }
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DEPARTMENT_DASHBOARD_DATA)
      setDashboardData(response.data)
    } catch (error) {
      console.error("Error fetching department dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: "tasks" | "users") => {
    try {
      // For department dashboard, export should be department-specific
      const url = type === "tasks" ? API_PATHS.EXPORT_DEPARTMENT_TASKS : API_PATHS.EXPORT_DEPARTMENT_USERS // These paths need to be defined
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
              Export Department Tasks
            </button>
            <button onClick={() => handleExport("users")} className="btn btn-secondary">
              Export Department Users
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
          <StatCard title="Total Tasks" value={dashboardData?.statistics?.totalTasks || 0} icon="📋" color="var(--primary)" />
          <StatCard title="Pending" value={dashboardData?.statistics?.pendingTasks || 0} icon="⏳" color="var(--warning)" />
          <StatCard title="In Progress" value={dashboardData?.statistics?.inProgressTasks || 0} icon="🔄" color="var(--primary)" />
          <StatCard title="Completed" value={dashboardData?.statistics?.completedTasks || 0} icon="✅" color="var(--success)" />
        </div>

        <div className="card">
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Tasks</h2>
          {dashboardData?.recentTasks?.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {dashboardData.recentTasks.map((task: any) => (
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
