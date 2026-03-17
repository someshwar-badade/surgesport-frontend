import apiClient from "~/api/apiClient"

export interface BleedingAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  severity: "mild" | "moderate" | "severe"
  interventionTime?: number
  note?: string
  created_at: string
  updated_at: string
}

export interface CreateBleedingAnnotationData {
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  severity: "mild" | "moderate" | "severe"
  interventionTime?: number
  note?: string
}

export interface UpdateBleedingAnnotationData extends Partial<CreateBleedingAnnotationData> {}

export async function getBleedingAnnotations(videoId: number): Promise<BleedingAnnotation[]> {
  const response = await apiClient.get<BleedingAnnotation[]>(`/videos/${videoId}/bleedings`)
  return response.data
}

export async function getBleedingAnnotation(videoId: number, bleedingId: number): Promise<BleedingAnnotation> {
  const response = await apiClient.get<BleedingAnnotation>(`/videos/${videoId}/bleedings/${bleedingId}`)
  return response.data
}

export async function createBleedingAnnotation(videoId: number, data: CreateBleedingAnnotationData): Promise<BleedingAnnotation> {
  const response = await apiClient.post<BleedingAnnotation>(`/videos/${videoId}/bleedings`, data)
  return response.data
}

export async function updateBleedingAnnotation(videoId: number, bleedingId: number, data: UpdateBleedingAnnotationData): Promise<BleedingAnnotation> {
  const response = await apiClient.put<BleedingAnnotation>(`/videos/${videoId}/bleedings/${bleedingId}`, data)
  return response.data
}

export async function deleteBleedingAnnotation(videoId: number, bleedingId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}/bleedings/${bleedingId}`)
}