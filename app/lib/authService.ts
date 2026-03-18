import apiClient from "~/api/apiClient"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
}

export interface User {
  id: number
  name: string
  email: string
  role_id?: number
}

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface LoginResponse {
  token: string
}

export interface RegisterResponse {
  user: User
  token: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  email: string
  token: string
  password: string
  password_confirmation: string
}

export async function login(credentials: LoginCredentials): Promise<string> {
  const response = await apiClient.post<ApiResponse<LoginResponse>>("/login", credentials)
  if (!response.data.status) {
    throw new Error(response.data.message || "Login failed")
  }
  return response.data.data.token
}

export async function register(data: RegisterData): Promise<{ user: User; token: string }> {
  const response = await apiClient.post<ApiResponse<RegisterResponse>>("/register", data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Registration failed")
  }
  return response.data.data
}

export async function logout(): Promise<void> {
  await apiClient.post("/logout")
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>("/me")
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to get user data")
  }
  return response.data.data
}

export async function forgotPassword(data: ForgotPasswordData): Promise<void> {
  const response = await apiClient.post<ApiResponse<null>>("/forgot-password", data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to send password reset email")
  }
}

export async function resetPassword(data: ResetPasswordData): Promise<void> {
  const response = await apiClient.post<ApiResponse<null>>("/reset-password", data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to reset password")
  }
}