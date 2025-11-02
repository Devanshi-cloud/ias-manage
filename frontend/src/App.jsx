import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./routes/PrivateRoute"

// Auth Pages
import Login from "./pages/Auth/Login"
import SignUp from "./pages/Auth/SignUp"

// Admin Pages
import AdminDashboard from "./pages/Admin/Dashboard"
import CreateTask from "./pages/Admin/CreateTask"
import ManageTasks from "./pages/Admin/ManageTasks"
import ManageUsers from "./pages/Admin/ManageUsers"

// User Pages
import UserDashboard from "./pages/User/UserDashboard"
import MyTasks from "./pages/User/MyTasks"
import ViewTaskDetail from "./pages/User/ViewTaskDetail"

import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/create-task"
            element={
              <PrivateRoute role="admin">
                <CreateTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-tasks"
            element={
              <PrivateRoute role="admin">
                <ManageTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/manage-users"
            element={
              <PrivateRoute role="admin">
                <ManageUsers />
              </PrivateRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute role="member">
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/my-tasks"
            element={
              <PrivateRoute role="member">
                <MyTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/user/task/:id"
            element={
              <PrivateRoute role="member">
                <ViewTaskDetail />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
