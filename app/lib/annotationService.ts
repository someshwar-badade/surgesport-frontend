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

export async function createAnnotation(videoId: string, type: string, data: any): Promise<any> {
  const response = await apiClient.post<ApiResponse<any>>(`/videos/${videoId}/annotations`, { type, data })
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create annotation")
  } 
    return response.data.data
}

export async function updateAnnotation(videoId: string, annotationId: number, type: string, data: any): Promise<any> {
  const response = await apiClient.put<ApiResponse<any>>(`/videos/${videoId}/annotations/${annotationId}`, { type, data })
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update annotation")
  }
  return response.data.data
}

export async function deleteAnnotation(videoId: string, annotationId: number): Promise<void> {
    const response = await apiClient.delete<ApiResponse<null>>(`/videos/${videoId}/annotations/${annotationId}`)
    if (!response.data.status) {
        throw new Error(response.data.message || "Failed to delete annotation") 
    }
}

export async function getAnnotation(videoId: string, annotationId: number): Promise<any> {
  const response = await apiClient.get<ApiResponse<any>>(`/videos/${videoId}/annotations/${annotationId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Annotation not found")
  }
  return response.data.data
}

