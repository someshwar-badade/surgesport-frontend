import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { CreateInstrumentationAnnotationData, InstrumentationAnnotation, UpdateInstrumentationAnnotationData } from "~/types/instruments/instruments.type"


export async function getInstrumentationAnnotations(videoId: string): Promise<InstrumentationAnnotation[]> {
  const response = await apiClient.get<ApiResponse<InstrumentationAnnotation[]>>(`/videos/${videoId}/instruments`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch instrumentation annotations")
  }
  return response.data.data
}

export async function getInstrumentationAnnotation(videoId: string, instrumentationId: number): Promise<InstrumentationAnnotation> {
  const response = await apiClient.get<ApiResponse<InstrumentationAnnotation>>(`/videos/${videoId}/instruments/${instrumentationId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Instrumentation annotation not found")
  }
  return response.data.data
}

export async function createInstrumentationAnnotation(videoId: string, data: CreateInstrumentationAnnotationData): Promise<InstrumentationAnnotation> {
  const response = await apiClient.post<ApiResponse<InstrumentationAnnotation>>(`/videos/${videoId}/instruments`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create instrumentation annotation")
  }
  return response.data.data
}

export async function updateInstrumentationAnnotation(videoId: string, instrumentationId: number, data: UpdateInstrumentationAnnotationData): Promise<InstrumentationAnnotation> {
  const response = await apiClient.put<ApiResponse<InstrumentationAnnotation>>(`/videos/${videoId}/instruments/${instrumentationId}`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update instrumentation annotation")
  }
  return response.data.data
}

export async function deleteInstrumentationAnnotation(videoId: string, instrumentationId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/videos/${videoId}/instruments/${instrumentationId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete instrumentation annotation")
  }
}