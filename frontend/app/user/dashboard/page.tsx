"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import StatCard from "@/components/StatCard"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/apiPaths"

export default function UserDashboard() {
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USER_DASHBOARD_DATA)
      setDashboardData(response.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>My Dashboard</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard title="My Tasks" value={dashboardData?.totalTasks || 0} icon="📋" color="var(--primary)" />
          <StatCard title="Pending" value={dashboardData?.pendingTasks || 0} icon="⏳" color="var(--warning)" />
          <StatCard title="In Progress" value={dashboardData?.inProgressTasks || 0} icon="🔄" color="var(--primary)" />
          <StatCard title="Completed" value={dashboardData?.completedTasks || 0} icon="✅" color="var(--success)" />
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
