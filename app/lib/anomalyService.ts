import apiClient from "~/api/apiClient"

export interface AnomalyAnnotation {
  id: number
  video_id: number
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  type: "anatomical" | "pathological" | "iatrogenic" | "other"
  description: string
  severity: "low" | "medium" | "high"
  note?: string
  created_at: string
  updated_at: string
}

export interface CreateAnomalyAnnotationData {
  timestamp: string
  time: number
  x: number
  y: number
  xPercent: number
  yPercent: number
  type: "anatomical" | "pathological" | "iatrogenic" | "other"
  description: string
  severity: "low" | "medium" | "high"
  note?: string
}

export interface UpdateAnomalyAnnotationData extends Partial<CreateAnomalyAnnotationData> {}

export async function getAnomalyAnnotations(videoId: number): Promise<AnomalyAnnotation[]> {
  const response = await apiClient.get<AnomalyAnnotation[]>(`/videos/${videoId}/anomalies`)
  return response.data
}

export async function getAnomalyAnnotation(videoId: number, anomalyId: number): Promise<AnomalyAnnotation> {
  const response = await apiClient.get<AnomalyAnnotation>(`/videos/${videoId}/anomalies/${anomalyId}`)
  return response.data
}

export async function createAnomalyAnnotation(videoId: number, data: CreateAnomalyAnnotationData): Promise<AnomalyAnnotation> {
  const response = await apiClient.post<AnomalyAnnotation>(`/videos/${videoId}/anomalies`, data)
  return response.data
}

export async function updateAnomalyAnnotation(videoId: number, anomalyId: number, data: UpdateAnomalyAnnotationData): Promise<AnomalyAnnotation> {
  const response = await apiClient.put<AnomalyAnnotation>(`/videos/${videoId}/anomalies/${anomalyId}`, data)
  return response.data
}

export async function deleteAnomalyAnnotation(videoId: number, anomalyId: number): Promise<void> {
  await apiClient.delete(`/videos/${videoId}/anomalies/${anomalyId}`)
}