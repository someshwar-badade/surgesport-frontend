import apiClient from "~/api/apiClient"
import type { Annotation, AnnotationsByType } from "~/types/annotation.type"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type { BleedingAnnotation } from "~/types/bleedings/bleedings.type"
import type { EventAnnotation } from "~/types/events/events.type"
import type { InstrumentationAnnotation } from "~/types/instruments/instruments.type"
import type { PhaseAnnotation } from "~/types/phases/phases.type"

export interface Video {
  id: string
  procedure_id?: number | string
  procedure?: {id: number | string, name: string} 
  title?: string
  total_video_time?: string
  first_camera_entry_time?: string
  final_camera_exit_time?: string
  camera_enter_body_timestamp?: string
  camera_exit_body_timestamp?: string
  osat_score?: number
  video_url?: string
  created_at?: string
  updated_at?: string
  total_video_time_formatted?: string
  first_camera_entry_time_formatted?: string
  final_camera_exit_time_formatted?: string
  annotations: {
  id: number,
  video_id: string,
  phases_count: number,
  events_count: number,
  bleeds_count: number,
  instruments_count: number,
  anomalies_count: number

}
}


export async function getAnnotationsByVideoId(
  videoId: string,
  types: string[] = ["phases", "events", "bleeds", "instrumentation","anomaly"]
): Promise<AnnotationsByType> {
  const typesParam = types.join(",")
  try {
    const response = await apiClient.get<ApiResponse<AnnotationsByType>>(
      `/videos/${videoId}/annotations?types=${typesParam}`
    )

    if (!response.data.status) {
      throw new Error(response.data.message || "Failed to fetch annotations")
    }

    return {
      phases: response.data.data.phases ?? [],
      events: response.data.data.events ?? [],
      bleeds: response.data.data.bleeds ?? [],
      instrumentation: response.data.data.instrumentation ?? [],
      anomaly: response.data.data.anomaly ?? [],
    }
  } catch (error) {
    // Fallback sample data for local dev when API is unavailable
    return {
      phases: [],
      events: [],
      bleeds: [],
      instrumentation: [],
      anomaly: [],
    }
  }
}

export async function createPhaseAnnotation(
  videoId: string,
  data: Partial<PhaseAnnotation>
): Promise<PhaseAnnotation> {
  const response = await apiClient.post<ApiResponse<PhaseAnnotation>>(
    `/videos/${videoId}/phases`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create phase annotation")
  }
  return response.data.data
}

export async function createEventAnnotation(
  videoId: string,
  data: Partial<EventAnnotation>
): Promise<EventAnnotation> {
  const response = await apiClient.post<ApiResponse<EventAnnotation>>(
    `/videos/${videoId}/events`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create event annotation")
  }
  return response.data.data
}

export async function createBleedingAnnotation(
  videoId: string,
  data: Partial<BleedingAnnotation>
): Promise<BleedingAnnotation> {
  const response = await apiClient.post<ApiResponse<BleedingAnnotation>>(
    `/videos/${videoId}/bleedings`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create bleeding annotation")
  }
  return response.data.data
}

export async function createInstrumentationAnnotation(
  videoId: string,
  data: Partial<InstrumentationAnnotation>
): Promise<InstrumentationAnnotation> {
  const response = await apiClient.post<ApiResponse<InstrumentationAnnotation>>(
    `/videos/${videoId}/instruments`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create instrumentation annotation")
  }
  return response.data.data
}

export async function createAnomalyAnnotation(
  videoId: string,
  data: any
): Promise<Annotation> {
  const response = await apiClient.post<ApiResponse<Annotation>>(
    `/videos/${videoId}/anomalies`,
    data
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create anomaly annotation")
  }
  return response.data.data
}

// export async function createAnnotation(videoId: string, type: string, data: any): Promise<any> {
//   const response = await apiClient.post<ApiResponse<any>>(`/videos/${videoId}/annotations`, { type, data })
//   if (!response.data.status) {
//     throw new Error(response.data.message || "Failed to create annotation")
//   }
//   return response.data.data
// }

export async function updateAnnotation(
  videoId: string,
  annotationId: number,
  type: string,
  data: any
): Promise<any> {
  const response = await apiClient.put<ApiResponse<any>>(
    `/videos/${videoId}/annotations/${annotationId}`,
    { type, data }
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update annotation")
  }
  return response.data.data
}

export async function deleteAnnotation(
  videoId: string,
  annotationId: number,
  category: string
): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(
    `/videos/${videoId}/${category}/${annotationId}`
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete annotation")
  }
}

export async function getAnnotation(videoId: string, annotationId: number): Promise<any> {
  const response = await apiClient.get<ApiResponse<any>>(
    `/videos/${videoId}/annotations/${annotationId}`
  )
  if (!response.data.status) {
    throw new Error(response.data.message || "Annotation not found")
  }
  return response.data.data
}

export async function getAnnotatorAnnotations(): Promise<Video[]> {
  const response = await apiClient.get<ApiResponse<unknown>>(
    `/annotator/annotations`
  )
  if (!response.data.status) {
      throw new Error(response.data.message || "Failed to fetch videos")
    }
  
    const payload = response.data.data
    console.log("Raw annotations payload:", payload) // Debug log
    // Normalize response payload to an array of videos.
    if (Array.isArray(payload)) {
      return payload as Video[]
    }
  
    if (payload && typeof payload === "object") {
      // Some APIs wrap list data in a `videos` or `data` key
      if (Array.isArray((payload as any).videos)) {
        return (payload as any).videos as Video[]
      }
      if (Array.isArray((payload as any).data)) {
        return (payload as any).data as Video[]
      }
    }
  
    // Fallback: return empty list and log to help debugging
    console.warn("Unexpected videos payload format", payload)
    return [];
}

export async function createAnnotation(videoId: string): Promise<{ id: string }> {
  const response = await apiClient.post<ApiResponse<{ id: string }>>(
    `/videos/${videoId}/annotations`,
    {
      video_id: videoId, // optional (you can remove if backend doesn't need it)
    }
  )

  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create annotation")
  }

  return response.data.data
}


