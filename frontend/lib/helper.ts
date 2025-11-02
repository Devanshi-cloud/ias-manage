export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "badge-pending"
    case "in-progress":
      return "badge-progress"
    case "completed":
      return "badge-completed"
    default:
      return "badge-pending"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "badge-low"
    case "medium":
      return "badge-medium"
    case "high":
      return "badge-high"
    default:
      return "badge-medium"
  }
}

export const calculateProgress = (checklist: any[]) => {
  if (!checklist || checklist.length === 0) return 0
  const completed = checklist.filter((item) => item.completed).length
  return Math.round((completed / checklist.length) * 100)
}
