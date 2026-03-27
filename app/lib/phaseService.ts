import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { CreatePhaseAnnotationData, PhaseAnnotation, UpdatePhaseAnnotationData } from "~/types/phases/phases.type"

export async function getPhaseAnnotations(videoId: string): Promise<PhaseAnnotation[]> {
  const response = await apiClient.get<ApiResponse<PhaseAnnotation[]>>(`/videos/${videoId}/phases`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch phase annotations")
  }
  return response.data.data
}

export async function getPhaseAnnotation(videoId: string, phaseId: number): Promise<PhaseAnnotation> {
  const response = await apiClient.get<ApiResponse<PhaseAnnotation>>(`/videos/${videoId}/phases/${phaseId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Phase annotation not found")
  }
  return response.data.data
}

export async function createPhaseAnnotation(videoId: string, data: CreatePhaseAnnotationData): Promise<PhaseAnnotation> {
  const response = await apiClient.post<ApiResponse<PhaseAnnotation>>(`/videos/${videoId}/phases`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create phase annotation")
  }
  return response.data.data
}

export async function updatePhaseAnnotation(videoId: string, phaseId: number, data: UpdatePhaseAnnotationData): Promise<PhaseAnnotation> {
  const response = await apiClient.put<ApiResponse<PhaseAnnotation>>(`/videos/${videoId}/phases/${phaseId}`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update phase annotation")
  }
  return response.data.data
}

export async function deletePhaseAnnotation(videoId: string, phaseId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/videos/${videoId}/phases/${phaseId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete phase annotation")
  }
}