import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { RegisterData, User, UserUpdateData, UserWithRole } from "~/types/auth.type"
import { extractList } from "~/utils/helpers/extractListHelper"

export async function getUsers(): Promise<User[]> {
  const response = await apiClient.get<ApiResponse<any>>(`/users/all`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch users")
  }

    return extractList<UserWithRole>(response.data.data)
  
}

export async function getUserById(userId: number): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>(`/users/${userId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "User not found")
  }
  return response.data.data
}

export async function createUser(data: RegisterData): Promise<User> {
  const response = await apiClient.post<ApiResponse<User>>(`/users/create`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create user")
  }
  return response.data.data
}

export async function updateUser(userId: number, data: RegisterData): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>(`/users/${userId}/update`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update user")
  }
  return response.data.data
}

export async function deleteUser(userId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/users/${userId}/delete`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete user")
  }
}