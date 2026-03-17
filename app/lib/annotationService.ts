import apiClient from "~/api/apiClient"
import type { Annotation } from "~/types/annotation.type"

export async function getAnnotationsByVideoId(videoId: number): Promise<Annotation[]> {
  const response = await apiClient.get<Annotation[]>(`/videos/${videoId}/annotations`)
  return response.data
}