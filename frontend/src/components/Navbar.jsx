"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { LogOut, User, LayoutDashboard, ListTodo, Users, PlusCircle } from "lucide-react"

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link
          to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          TaskManager
        </Link>
      </div>

      <div className="navbar-menu">
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" className="navbar-link">
              <LayoutDashboard size={18} style={{ display: "inline", marginRight: "0.25rem" }} />
              Dashboard
            </Link>
            <Link to="/admin/create-task" className="navbar-link">
              <PlusCircle size={18} style={{ display: "inline", marginRight: "0.25rem" }} />
              Create Task
            </Link>
            <Link to="/admin/manage-tasks" className="navbar-link">
              <ListTodo size={18} style={{ display: "inline", marginRight: "0.25rem" }} />
              Manage Tasks
            </Link>
            <Link to="/admin/manage-users" className="navbar-link">
              <Users size={18} style={{ display: "inline", marginRight: "0.25rem" }} />
              Manage Users
            </Link>
          </>
        ) : (
          <>
            <Link to="/user/dashboard" className="navbar-link">
              <LayoutDashboard size={18} style={{ display: "inline", marginRight: "0.25rem" }} />
              Dashboard
            </Link>
            <Link to="/user/my-tasks" className="navbar-link">
              <ListTodo size={18} style={{ display: "inline", marginRight: "0.25rem" }} />
              My Tasks
            </Link>
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--text-light)", fontSize: "0.875rem" }}>
            <User size={16} style={{ display: "inline", marginRight: "0.25rem" }} />
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
