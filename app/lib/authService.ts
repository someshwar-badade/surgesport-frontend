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
}

export interface AuthResponse {
  token: string
  user: User
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

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/login", credentials)
  return response.data
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/register", data)
  return response.data
}

export async function logout(): Promise<void> {
  await apiClient.post("/logout")
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<User>("/me")
  return response.data
}

export async function forgotPassword(data: ForgotPasswordData): Promise<void> {
  await apiClient.post("/forgot-password", data)
}

export async function resetPassword(data: ResetPasswordData): Promise<void> {
  await apiClient.post("/reset-password", data)
}