import apiClient from "~/api/apiClient"
import type { PhaseAnnotation, EventAnnotation } from "~/types/annotation.type"

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface AnnotationsByType {
  phases: PhaseAnnotation[]
  events: EventAnnotation[]
}

export async function getAnnotationsByVideoId(videoId: string, types: string[] = ['phases', 'events']): Promise<AnnotationsByType> {
  const typesParam = types.join(',')
  const response = await apiClient.get<ApiResponse<AnnotationsByType>>(`/videos/${videoId}/annotations?types=${typesParam}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch annotations")
  }
  return response.data.data
}