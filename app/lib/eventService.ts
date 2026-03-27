import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { CreateEventAnnotationData, EventAnnotation, UpdateEventAnnotationData } from "~/types/events/events.type"

export async function getEventAnnotations(videoId: string): Promise<EventAnnotation[]> {
  const response = await apiClient.get<ApiResponse<EventAnnotation[]>>(`/videos/${videoId}/events`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch event annotations")
  }
  return response.data.data
}

export async function getEventAnnotation(videoId: string, eventId: number): Promise<EventAnnotation> {
  const response = await apiClient.get<ApiResponse<EventAnnotation>>(`/videos/${videoId}/events/${eventId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Event annotation not found")
  }
  return response.data.data
}

export async function createEventAnnotation(videoId: string, data: CreateEventAnnotationData): Promise<EventAnnotation> {
  const response = await apiClient.post<ApiResponse<EventAnnotation>>(`/videos/${videoId}/events`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create event annotation")
  }
  return response.data.data
}

export async function updateEventAnnotation(videoId: string, eventId: number, data: UpdateEventAnnotationData): Promise<EventAnnotation> {
  const response = await apiClient.put<ApiResponse<EventAnnotation>>(`/videos/${videoId}/events/${eventId}`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update event annotation")
  }
  return response.data.data
}

export async function deleteEventAnnotation(videoId: string, eventId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/videos/${videoId}/events/${eventId}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete event annotation")
  }
}