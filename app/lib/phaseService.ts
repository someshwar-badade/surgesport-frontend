import apiClient from "~/api/apiClient"

export interface PhaseAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  phaseName: string
  endTime?: number
  duration?: number
  note?: string
  created_at: string
  updated_at: string
}

export interface CreatePhaseAnnotationData {
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  phaseName: string
  endTime?: number
  duration?: number
  note?: string
}

export interface UpdatePhaseAnnotationData extends Partial<CreatePhaseAnnotationData> {}

export async function getPhaseAnnotations(videoId: number): Promise<PhaseAnnotation[]> {
  const response = await apiClient.get<PhaseAnnotation[]>(`/videos/${videoId}/phases`)
  return response.data
}

export async function getPhaseAnnotation(videoId: number, phaseId: number): Promise<PhaseAnnotation> {
  const response = await apiClient.get<PhaseAnnotation>(`/videos/${videoId}/phases/${phaseId}`)
  return response.data
}

export async function createPhaseAnnotation(videoId: number, data: CreatePhaseAnnotationData): Promise<PhaseAnnotation> {
  const response = await apiClient.post<PhaseAnnotation>(`/videos/${videoId}/phases`, data)
  return response.data
}

export async function updatePhaseAnnotation(videoId: number, phaseId: number, data: UpdatePhaseAnnotationData): Promise<PhaseAnnotation> {
  const response = await apiClient.put<PhaseAnnotation>(`/videos/${videoId}/phases/${phaseId}`, data)
  return response.data
}

export async function deletePhaseAnnotation(videoId: number, phaseId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}/phases/${phaseId}`)
}