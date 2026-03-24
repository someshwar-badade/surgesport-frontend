import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type";
import type { ForgotPasswordData, LoginCredentials, LoginResponse, RegisterData, RegisterResponse, ResetPasswordData, User } from "~/types/auth.type";

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