"use client"

import Link from "next/link"
import { formatDate, getStatusColor, getPriorityColor } from "@/lib/helper"

interface TaskCardProps {
  task: any
  onStatusChange?: (id: string, status: string) => void
  showActions?: boolean
}

export default function TaskCard({ task, onStatusChange, showActions = true }: TaskCardProps) {
  return (
    <div className="card" style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
        <div>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.5rem" }}>{task.title}</h3>
          <p style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>{task.description}</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <span className={`badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
          <span className={`badge ${getStatusColor(task.status)}`}>{task.status}</span>
        </div>
      </div>

      <div
        style={{ display: "flex", gap: "1rem", fontSize: "0.875rem", color: "var(--text-light)", marginBottom: "1rem" }}
      >
        <span>Due: {formatDate(task.dueDate)}</span>
        {task.assignedTo && <span>Assigned to: {task.assignedTo.name}</span>}
      </div>

      {showActions && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            href={`/admin/manage-tasks?edit=${task._id}`}
            className="btn btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}
          >
            Edit
          </Link>
          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="input"
              style={{ width: "auto", fontSize: "0.875rem", padding: "0.375rem 0.75rem" }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          )}
        </div>
      )}
    </div>
  )
}
