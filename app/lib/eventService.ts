import apiClient from "~/api/apiClient"

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface EventAnnotation {
  id: number
  event_type: string
  x_position: number
  y_position: number
  created_at?: string
  updated_at?: string
}

export interface CreateEventAnnotationData {
  event_type: string
  x_position: number
  y_position: number
}

export interface UpdateEventAnnotationData extends Partial<CreateEventAnnotationData> {}

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