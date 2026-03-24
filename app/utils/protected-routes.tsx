import { useLocation, Navigate } from "react-router"
import { useAuth } from "~/context/authContext"
import { getDefaultRouteForRole, isPathAllowedForRole } from "~/lib/roles"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const roleId = user.role_id
  if (!isPathAllowedForRole(roleId as number, location.pathname)) {
    // Redirect users to the first page they can access.
    return <Navigate to={getDefaultRouteForRole(roleId)} replace />
  }

  return <>{children}</>
}
