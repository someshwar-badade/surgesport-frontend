import { useState } from "react"
import apiClient from "~/api/apiClient"
import { useAuth } from "~/context/authContext"
import type { LoginData, RegisterData, ApiError } from "~/types/auth.type"

const useAuthActions = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const { user, login, logout } = useAuth()

  const userLogin = async (data: LoginData) => {
    try {
      setLoading(true)
      setError(null)

      const res = await apiClient.post("/login", data)

      login(res.data)
      return res.data
    } catch (err) {
      const error = err as ApiError
      setError(
        error.response?.data?.message ||
          error.response?.message ||
          "Login failed"
      )
      return null
    } finally {
      setLoading(false)
    }
  }

  const userRegister = async (data: RegisterData) => {
    try {
      setLoading(true)
      setError(null)

      const res = await apiClient.post("/register", data)
      return res.data
    } catch (err) {
      const error = err as ApiError
      setError(
        error.response?.data?.message ||
          error.response?.message ||
          "Register failed"
      )
    } finally {
      setLoading(false)
    }
  }

  const userLogout = async () => {
    try {
      await apiClient.post("/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logout()
      window.location.href = "/login"
    }
  }

  const forgotPassword = async (email: string) => {
    const res = await apiClient.post("/forgot-password", {
      email,
    })
    return res.data
  }

  return {
    userLogin,
    userRegister,
    userLogout,
    user,
    forgotPassword,
    loading,
    error,
  }
}

export default useAuthActions
