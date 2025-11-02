import { format, formatDistanceToNow, isPast } from "date-fns"

export const formatDate = (date) => {
  if (!date) return "N/A"
  return format(new Date(date), "MMM dd, yyyy")
}

export const formatDateTime = (date) => {
  if (!date) return "N/A"
  return format(new Date(date), "MMM dd, yyyy hh:mm a")
}

export const getRelativeTime = (date) => {
  if (!date) return "N/A"
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const isOverdue = (dueDate, status) => {
  if (status === "Completed") return false
  return isPast(new Date(dueDate))
}

export const getPriorityColor = (priority) => {
  const colors = {
    Low: "badge-low",
    Medium: "badge-medium",
    High: "badge-high",
  }
  return colors[priority] || "badge-low"
}

export const getStatusColor = (status) => {
  const colors = {
    Pending: "badge-pending",
    "In Progress": "badge-progress",
    Completed: "badge-completed",
  }
  return colors[status] || "badge-pending"
}

export const calculateProgress = (checklist) => {
  if (!checklist || checklist.length === 0) return 0
  const completed = checklist.filter((item) => item.completed).length
  return Math.round((completed / checklist.length) * 100)
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}
