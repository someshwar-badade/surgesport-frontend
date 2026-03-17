import apiClient from "~/api/apiClient"

export interface InstrumentationAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  instrument: string
  action: "inserted" | "removed" | "adjusted" | "malfunctioned"
  duration?: number
  note?: string
  created_at: string
  updated_at: string
}

export interface CreateInstrumentationAnnotationData {
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  instrument: string
  action: "inserted" | "removed" | "adjusted" | "malfunctioned"
  duration?: number
  note?: string
}

export interface UpdateInstrumentationAnnotationData extends Partial<CreateInstrumentationAnnotationData> {}

export async function getInstrumentationAnnotations(videoId: number): Promise<InstrumentationAnnotation[]> {
  const response = await apiClient.get<InstrumentationAnnotation[]>(`/videos/${videoId}/instrumentations`)
  return response.data
}

export async function getInstrumentationAnnotation(videoId: number, instrumentationId: number): Promise<InstrumentationAnnotation> {
  const response = await apiClient.get<InstrumentationAnnotation>(`/videos/${videoId}/instrumentations/${instrumentationId}`)
  return response.data
}

export async function createInstrumentationAnnotation(videoId: number, data: CreateInstrumentationAnnotationData): Promise<InstrumentationAnnotation> {
  const response = await apiClient.post<InstrumentationAnnotation>(`/videos/${videoId}/instrumentations`, data)
  return response.data
}

export async function updateInstrumentationAnnotation(videoId: number, instrumentationId: number, data: UpdateInstrumentationAnnotationData): Promise<InstrumentationAnnotation> {
  const response = await apiClient.put<InstrumentationAnnotation>(`/videos/${videoId}/instrumentations/${instrumentationId}`, data)
  return response.data
}

export async function deleteInstrumentationAnnotation(videoId: number, instrumentationId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}/instrumentations/${instrumentationId}`)
}