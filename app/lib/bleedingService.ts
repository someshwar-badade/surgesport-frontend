import apiClient from "~/api/apiClient"

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface BleedingAnnotation {
  id: number
  onset_time: number
  severity: string
  intervention_time?: number
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}

export interface CreateBleedingAnnotationData {
  onset_time: number
  severity: string
  intervention_time?: number
  x_position: number
  y_position: number
}

export interface UpdateBleedingAnnotationData extends Partial<CreateBleedingAnnotationData> {}

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