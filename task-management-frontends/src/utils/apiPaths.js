const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

export const API_PATHS = {
  // Auth
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  UPDATE_PROFILE: (id) => `${API_BASE_URL}/users/${id}`,
  UPLOAD_IMAGE: `${API_BASE_URL}/auth/upload-image`,

  // Users
  GET_USERS: `${API_BASE_URL}/users`,
  GET_USER_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  DELETE_USER: `${API_BASE_URL}/users`,
  UPDATE_USER: (id) => `${API_BASE_URL}/users/${id}`,

  // Tasks
  GET_TASKS: `${API_BASE_URL}/tasks`,
  GET_TASK_BY_ID: (id) => `${API_BASE_URL}/tasks/${id}`,
  CREATE_TASK: `${API_BASE_URL}/tasks`,
  UPDATE_TASK: (id) => `${API_BASE_URL}/tasks/${id}`,
  DELETE_TASK: (id) => `${API_BASE_URL}/tasks/${id}`,
  UPDATE_TASK_STATUS: (id) => `${API_BASE_URL}/tasks/${id}/status`,
  UPDATE_TASK_CHECKLIST: (id) => `${API_BASE_URL}/tasks/${id}/todo`,
  DASHBOARD_DATA: `${API_BASE_URL}/tasks/dashboard-data`,
  USER_DASHBOARD_DATA: `${API_BASE_URL}/tasks/user-dashboard-data`,

  // Reports
  EXPORT_TASKS: `${API_BASE_URL}/reports/export/tasks`,
  EXPORT_USERS: `${API_BASE_URL}/reports/export/users`,
  DEPARTMENT_DASHBOARD_DATA: `${API_BASE_URL}/tasks/department-dashboard-data`,
}
