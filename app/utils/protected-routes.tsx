import { useContext } from "react"
import { Navigate } from "react-router"
import { AuthContext, useAuth } from "~/context/authContext"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
