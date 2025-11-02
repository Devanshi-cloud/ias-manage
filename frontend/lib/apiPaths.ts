export const API_PATHS = {
  // Auth
  LOGIN: "/auth/login",
  SIGNUP: "/auth/signup",

  // Tasks
  TASKS: "/tasks",
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
  UPDATE_TASK_STATUS: (id: string) => `/tasks/${id}/status`,
  UPDATE_TASK_CHECKLIST: (id: string) => `/tasks/${id}/todo`,
  DASHBOARD_DATA: "/tasks/dashboard-data",
  USER_DASHBOARD_DATA: "/tasks/user-dashboard-data",

  // Users
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,

  // Reports
  EXPORT_TASKS: "/reports/export/tasks",
  EXPORT_USERS: "/reports/export/users",
}
