"use client"
import { useNavigate } from "react-router-dom"
import { Calendar, User, CheckCircle2 } from "lucide-react"
import { formatDate, getPriorityColor, getStatusColor, isOverdue } from "../utils/helper"

const TaskCard = ({ task, onClick }) => {
  const navigate = useNavigate()
  const overdue = isOverdue(task.dueDate, task.status)

  const handleClick = () => {
    if (onClick) {
      onClick(task)
    } else {
      navigate(`/user/task/${task._id}`)
    }
  }

  return (
    <div
      className="card"
      style={{ cursor: "pointer", transition: "transform 0.2s", border: overdue ? "2px solid var(--danger)" : "none" }}
      onClick={handleClick}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: "600", color: "var(--text)" }}>{task.title}</h3>
        <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
      </div>

      <p style={{ color: "var(--text-light)", fontSize: "0.875rem", marginBottom: "1rem" }}>
        {task.description?.substring(0, 100)}...
      </p>

      <div
        style={{ display: "flex", gap: "1rem", marginBottom: "1rem", fontSize: "0.875rem", color: "var(--text-light)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <Calendar size={16} />
          <span>{formatDate(task.dueDate)}</span>
        </div>
        {task.assignedTo && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            <User size={16} />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
        {task.todoChecklist && task.todoChecklist.length > 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              fontSize: "0.875rem",
              color: "var(--text-light)",
            }}
          >
            <CheckCircle2 size={16} />
            <span>
              {task.todoChecklist.filter((item) => item.completed).length}/{task.todoChecklist.length}
            </span>
          </div>
        )}
      </div>

      {overdue && (
        <div style={{ marginTop: "0.5rem", color: "var(--danger)", fontSize: "0.75rem", fontWeight: "600" }}>
          ⚠️ OVERDUE
        </div>
      )}
    </div>
  )
}

export default TaskCard
