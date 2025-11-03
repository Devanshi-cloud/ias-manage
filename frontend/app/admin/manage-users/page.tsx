"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import axiosInstance from "@/lib/axiosInstance"
import { API_PATHS } from "@/lib/apiPaths"

export default function ManageUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(user)
    if (userData.role !== "admin") {
      router.push("/user/dashboard")
      return
    }

    fetchUsers()
  }, [router])

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.USERS)
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: "1200px", margin: "2rem auto", padding: "0 1rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "2rem" }}>Manage Users</h1>

        <div className="card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--border)" }}>
                <th style={{ padding: "1rem", textAlign: "left" }}>Name</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Email</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Role</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>IAS Position</th>
                <th style={{ padding: "1rem", textAlign: "left" }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "1rem" }}>{user.name}</td>
                  <td style={{ padding: "1rem" }}>{user.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span className={`badge ${user.role === "admin" ? "badge-high" : "badge-low"}`}>{user.role}</span>
                  </td>
                  <td style={{ padding: "1rem" }}>{user.iasPosition || "N/A"}</td>
                  <td style={{ padding: "1rem" }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
