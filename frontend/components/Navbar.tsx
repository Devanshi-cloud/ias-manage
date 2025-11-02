"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Navbar() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/login")
  }

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {}

  return (
    <nav style={{ background: "var(--primary)", color: "white", padding: "1rem 2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Task Manager</h1>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          {user.role === "admin" ? (
            <>
              <Link href="/admin/dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
              </Link>
              <Link href="/admin/create-task" style={{ color: "white", textDecoration: "none" }}>
                Create Task
              </Link>
              <Link href="/admin/manage-tasks" style={{ color: "white", textDecoration: "none" }}>
                Manage Tasks
              </Link>
              <Link href="/admin/manage-users" style={{ color: "white", textDecoration: "none" }}>
                Manage Users
              </Link>
            </>
          ) : (
            <>
              <Link href="/user/dashboard" style={{ color: "white", textDecoration: "none" }}>
                Dashboard
              </Link>
              <Link href="/user/my-tasks" style={{ color: "white", textDecoration: "none" }}>
                My Tasks
              </Link>
            </>
          )}
          <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
