import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { BleedingAnnotation, CreateBleedingAnnotationData, UpdateBleedingAnnotationData } from "~/types/bleedings/bleedings.type"

export async function getBleedingAnnotations(videoId: string): Promise<BleedingAnnotation[]> {
  const response = await apiClient.get<ApiResponse<BleedingAnnotation[]>>(`/videos/${videoId}/bleedings`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch bleeding annotations")
  }
  return response.data.data
}

export async function getBleedingAnnotation(videoId: string, bleedingId: number): Promise<BleedingAnnotation> {
  const response = await apiClient.get<ApiResponse<BleedingAnnotation>>(`/videos/${videoId}/bleedings/${bleedingId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Bleeding annotation not found")
  }
  return response.data.data
}

export async function createBleedingAnnotation(videoId: string, data: CreateBleedingAnnotationData): Promise<BleedingAnnotation> {
  const response = await apiClient.post<ApiResponse<BleedingAnnotation>>(`/videos/${videoId}/bleedings`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create bleeding annotation")
  }
  return response.data.data
}

export async function updateBleedingAnnotation(videoId: string, bleedingId: number, data: UpdateBleedingAnnotationData): Promise<BleedingAnnotation> {
  const response = await apiClient.put<ApiResponse<BleedingAnnotation>>(`/videos/${videoId}/bleedings/${bleedingId}`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update bleeding annotation")
  }
  return response.data.data
}

export async function deleteBleedingAnnotation(videoId: string, bleedingId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/videos/${videoId}/bleedings/${bleedingId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete bleeding annotation")
  }
}