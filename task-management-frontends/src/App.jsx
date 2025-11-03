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
import EditTask from "./pages/Admin/EditTask"

// User Pages
import UserDashboard from "./pages/User/UserDashboard"
import MyTasks from "./pages/User/MyTasks"
import ViewTaskDetail from "./pages/User/ViewTaskDetail"
import UserProfile from "./pages/User/UserProfile"

// Head Pages
import HeadDashboard from "./pages/Head/Dashboard"
import HeadCreateTask from "./pages/Head/CreateTask"
import HeadManageTasks from "./pages/Head/ManageTasks"
import HeadManageUsers from "./pages/Head/ManageUsers"

// VP Pages
import VPDashboard from "./pages/VP/Dashboard"
import VPCreateTask from "./pages/VP/CreateTask"
import VPManageTasks from "./pages/VP/ManageTasks"
import VPManageUsers from "./pages/VP/ManageUsers"

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
          <Route
            path="/admin/edit-task/:id"
            element={
              <PrivateRoute role="admin">
                <EditTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <PrivateRoute role="admin">
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* VP Routes */}
          <Route
            path="/vp/dashboard"
            element={
              <PrivateRoute role="vp">
                <VPDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/vp/create-task"
            element={
              <PrivateRoute role="vp">
                <VPCreateTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/vp/manage-tasks"
            element={
              <PrivateRoute role="vp">
                <VPManageTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/vp/manage-users"
            element={
              <PrivateRoute role="vp">
                <VPManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/vp/profile"
            element={
              <PrivateRoute role="vp">
                <UserProfile />
              </PrivateRoute>
            }
          />

          {/* Head Routes */}
          <Route
            path="/head/dashboard"
            element={
              <PrivateRoute role="head">
                <HeadDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/head/create-task"
            element={
              <PrivateRoute role="head">
                <HeadCreateTask />
              </PrivateRoute>
            }
          />
          <Route
            path="/head/manage-tasks"
            element={
              <PrivateRoute role="head">
                <HeadManageTasks />
              </PrivateRoute>
            }
          />
          <Route
            path="/head/manage-users"
            element={
              <PrivateRoute role="head">
                <HeadManageUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/head/profile"
            element={
              <PrivateRoute role="head">
                <UserProfile />
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
          <Route
            path="/user/profile"
            element={
              <PrivateRoute role="member">
                <UserProfile />
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