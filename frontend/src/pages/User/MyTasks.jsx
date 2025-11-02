"use client"

import { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import TaskCard from "../../components/TaskCard"
import axiosInstance from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPaths"
import { filterOptions } from "../../utils/data"

const MyTasks = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filter, setFilter] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (filter === "All") {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter((task) => task.status === filter))
    }
  }, [filter, tasks])

  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GET_TASKS)
      setTasks(response.data.tasks || [])
      setFilteredTasks(response.data.tasks || [])
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading tasks...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "2rem", color: "var(--text)" }}>My Tasks</h1>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className="btn"
              style={{
                backgroundColor: filter === option.value ? "var(--primary)" : "white",
                color: filter === option.value ? "white" : "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task._id} task={task} />)
          ) : (
            <p style={{ color: "var(--text-light)", gridColumn: "1 / -1", textAlign: "center", padding: "2rem" }}>
              No tasks found
            </p>
          )}
        </div>
      </div>
    </>
  )
}

export default MyTasks
