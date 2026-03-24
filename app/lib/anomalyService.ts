import apiClient from "~/api/apiClient"
import type { AnomalyAnnotation, CreateAnomalyAnnotationData, UpdateAnomalyAnnotationData } from "~/types/anomalies/anomalies.type"
import type { ApiResponse } from "~/types/apis/apiResponse.type"

export async function getAnomalyAnnotations(videoId: string): Promise<AnomalyAnnotation[]> {
  const response = await apiClient.get<ApiResponse<AnomalyAnnotation[]>>(`/videos/${videoId}/anomalies`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch anomaly annotations")
  }
  return response.data.data
}

export async function getAnomalyAnnotation(videoId: string, anomalyId: number): Promise<AnomalyAnnotation> {
  const response = await apiClient.get<ApiResponse<AnomalyAnnotation>>(`/videos/${videoId}/anomalies/${anomalyId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Anomaly annotation not found")
  }
  return response.data.data
}

export async function createAnomalyAnnotation(videoId: string, data: CreateAnomalyAnnotationData): Promise<AnomalyAnnotation> {
  const response = await apiClient.post<ApiResponse<AnomalyAnnotation>>(`/videos/${videoId}/anomalies`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create anomaly annotation")
  }
  return response.data.data
}

export async function updateAnomalyAnnotation(videoId: string, anomalyId: number, data: UpdateAnomalyAnnotationData): Promise<AnomalyAnnotation> {
  const response = await apiClient.put<ApiResponse<AnomalyAnnotation>>(`/videos/${videoId}/anomalies/${anomalyId}`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update anomaly annotation")
  }
  return response.data.data
}

export async function deleteAnomalyAnnotation(videoId: string, anomalyId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/videos/${videoId}/anomalies/${anomalyId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete anomaly annotation")
  }
}