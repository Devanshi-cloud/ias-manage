"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import StatCard from "../../components/StatCard"
import TaskCard from "../../components/TaskCard"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

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
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading dashboard...</p>
        </div>
      </>
    )
  }

  const { statistics, charts, recentTasks } = dashboardData || {}

  const statusData = charts?.taskDistribution
    ? [
        { name: "Pending", value: charts.taskDistribution.Pending },
        { name: "In Progress", value: charts.taskDistribution.InProgress },
        { name: "Completed", value: charts.taskDistribution.Completed },
      ]
    : []

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"]

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text)" }}>
          My Dashboard
        </h1>

        {/* Statistics Cards */}
        <div className="dashboard-grid">
          <StatCard title="Total Tasks" value={statistics?.totalTasks || 0} icon={ListTodo} color="var(--primary)" />
          <StatCard title="Pending Tasks" value={statistics?.pendingTasks || 0} icon={Clock} color="var(--warning)" />
          <StatCard
            title="Completed Tasks"
            value={statistics?.completedTasks || 0}
            icon={CheckCircle2}
            color="var(--success)"
          />
          <StatCard
            title="Overdue Tasks"
            value={statistics?.overdueTasks || 0}
            icon={AlertCircle}
            color="var(--danger)"
          />
        </div>

        {/* Task Distribution Chart */}
        <div className="card" style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Task Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Tasks */}
        <div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Tasks</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
            {recentTasks && recentTasks.length > 0 ? (
              recentTasks.slice(0, 6).map((task) => <TaskCard key={task._id} task={task} />)
            ) : (
              <p style={{ color: "var(--text-light)" }}>No tasks assigned yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDashboard
