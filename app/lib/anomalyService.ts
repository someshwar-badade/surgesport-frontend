import apiClient from "~/api/apiClient"

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface AnomalyAnnotation {
  id: number
  timestamp: number
  description: string
  x_position: number
  y_position: number
  type?: string
  severity?: string
  created_at?: string
  updated_at?: string
}

export interface CreateAnomalyAnnotationData {
  timestamp: number
  description: string
  x_position: number
  y_position: number
  type?: string
  severity?: string
}

export interface UpdateAnomalyAnnotationData extends Partial<CreateAnomalyAnnotationData> {}

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