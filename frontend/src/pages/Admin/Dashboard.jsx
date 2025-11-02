"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import StatCard from "../../components/StatCard"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { ListTodo, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { formatDate } from "../../utils/helper"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD_DATA)
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

  // Prepare data for charts
  const statusData = charts?.taskDistribution
    ? [
        { name: "Pending", value: charts.taskDistribution.Pending },
        { name: "In Progress", value: charts.taskDistribution.InProgress },
        { name: "Completed", value: charts.taskDistribution.Completed },
      ]
    : []

  const priorityData = charts?.taskPriorityLevels
    ? [
        { name: "Low", value: charts.taskPriorityLevels.Low },
        { name: "Medium", value: charts.taskPriorityLevels.Medium },
        { name: "High", value: charts.taskPriorityLevels.High },
      ]
    : []

  const COLORS = ["#f59e0b", "#3b82f6", "#10b981"]

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text)" }}>
          Admin Dashboard
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

        {/* Charts */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          {/* Status Distribution */}
          <div className="card">
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Task Status Distribution</h2>
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

          {/* Priority Distribution */}
          <div className="card">
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Task Priority Levels</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Recent Tasks</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks && recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <tr key={task._id}>
                      <td>{task.title}</td>
                      <td>
                        <span className={`badge badge-${task.status.toLowerCase().replace(" ", "-")}`}>
                          {task.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${task.priority.toLowerCase()}`}>{task.priority}</span>
                      </td>
                      <td>{formatDate(task.dueDate)}</td>
                      <td>{formatDate(task.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No tasks found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
