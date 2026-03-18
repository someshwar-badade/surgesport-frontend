import apiClient from "~/api/apiClient"

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface PhaseAnnotation {
  id: number
  phase_name: string
  start_time: number
  end_time?: number
  created_at?: string
  updated_at?: string
}

export interface CreatePhaseAnnotationData {
  phase_name: string
  start_time: number
  end_time: number
}

export interface UpdatePhaseAnnotationData extends Partial<CreatePhaseAnnotationData> {}

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