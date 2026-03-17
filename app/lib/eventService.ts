import apiClient from "~/api/apiClient"

export interface EventAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  eventName: string
  note?: string
  created_at: string
  updated_at: string
}

export interface CreateEventAnnotationData {
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  eventName: string
  note?: string
}

export interface UpdateEventAnnotationData extends Partial<CreateEventAnnotationData> {}

export async function getEventAnnotations(videoId: number): Promise<EventAnnotation[]> {
  const response = await apiClient.get<EventAnnotation[]>(`/videos/${videoId}/events`)
  return response.data
}

export async function getEventAnnotation(videoId: number, eventId: number): Promise<EventAnnotation> {
  const response = await apiClient.get<EventAnnotation>(`/videos/${videoId}/events/${eventId}`)
  return response.data
}

export async function createEventAnnotation(videoId: number, data: CreateEventAnnotationData): Promise<EventAnnotation> {
  const response = await apiClient.post<EventAnnotation>(`/videos/${videoId}/events`, data)
  return response.data
}

export async function updateEventAnnotation(videoId: number, eventId: number, data: UpdateEventAnnotationData): Promise<EventAnnotation> {
  const response = await apiClient.put<EventAnnotation>(`/videos/${videoId}/events/${eventId}`, data)
  return response.data
}

export async function deleteEventAnnotation(videoId: number, eventId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}/events/${eventId}`)
}