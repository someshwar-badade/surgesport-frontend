import apiClient from "~/api/apiClient"

//prpcedire interface
export interface Procedure {
  id: number
  name: string
}

export interface Video {
  id: string
  procedure_id?: number | string
  procedure?: Procedure
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
}

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface CreateVideoData {
  procedure_id: number
  title: string
  total_video_time: string
  video_url: string
  first_camera_entry_time?: string
  final_camera_exit_time?: string
  camera_enter_body_timestamp?: string
  camera_exit_body_timestamp?: string
  osat_score?: number
}

export interface UpdateVideoData extends Partial<CreateVideoData> {}

export async function getVideos(): Promise<Video[]> {
  const response = await apiClient.get<ApiResponse<unknown>>("/videos")
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch videos")
  }

  const payload = response.data.data

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
  return []
}

export async function getVideoById(id: string): Promise<Video> {
  const response = await apiClient.get<ApiResponse<Video>>(`/videos/${id}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Video not found")
  }
  return response.data.data
}

export async function createVideo(data: CreateVideoData): Promise<Video> {
  const response = await apiClient.post<ApiResponse<Video>>("/videos", data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to create video")
  }
  return response.data.data
}

export async function updateVideo(id: string, data: UpdateVideoData): Promise<Video> {
  const response = await apiClient.put<ApiResponse<Video>>(`/videos/${id}`, data)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to update video")
  }
  return response.data.data
}

export async function deleteVideo(id: string): Promise<void> {
  const response = await apiClient.delete<ApiResponse<null>>(`/videos/${id}`)
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to delete video")
  }
}
