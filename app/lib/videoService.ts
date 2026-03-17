import apiClient from "~/api/apiClient"

export interface Video {
  id: string
  procedure_type?: string
  title?: string
  total_video_time?: number
  video_url?: string
  created_at?: string
  updated_at?: string
}

export interface ApiResponse<T> {
  status: boolean
  message?: string
  data: T
  errors?: Record<string, string[]>
}

export interface CreateVideoData {
  procedure_type: string
  title: string
  total_video_time: number
  video_url: string
}

export interface UpdateVideoData extends Partial<CreateVideoData> {}

export async function getVideos(): Promise<Video[]> {
  const response = await apiClient.get<ApiResponse<Video[]>>("/videos")
  if (!response.data.status) {
    throw new Error(response.data.message || "Failed to fetch videos")
  }
  return response.data.data
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
