import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If specific role required, check if user has that role
  if (role) {
    if (Array.isArray(role)) {
      // Allow multiple roles
      if (!role.includes(user.role)) {
        const redirectPath = getRedirectPath(user.role)
        return <Navigate to={redirectPath} replace />
      }
    } else {
      // Single role
      if (user.role !== role) {
        const redirectPath = getRedirectPath(user.role)
        return <Navigate to={redirectPath} replace />
      }
    }
  }

  return children
}

function getRedirectPath(role) {
  switch(role) {
    case 'admin': return '/admin/dashboard'
    case 'vp': return '/vp/dashboard'
    case 'head': return '/head/dashboard'
    default: return '/user/dashboard'
  }
}

export default PrivateRoute;
