"use client"

import { createContext, useState, useContext, useEffect, type ReactNode } from "react"

interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "member"
  profileImageUrl?: string
  token: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<User>
  register: (userData: any) => Promise<User>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  loading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    const userData = await response.json()
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (userData: any) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    const newUser = await response.json()
    localStorage.setItem("user", JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/login"
  }

  const updateUser = (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData } as User
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
