import apiClient from "~/api/apiClient"

export interface Video {
  id: number
  video_id: string
  procedure_type: string
  total_video_time: string
  first_camera_entry_time: string
  final_camera_exit_time: string
  camera_exit_body_time: string
  camera_enter_body_timestamp: string
  camera_exit_body_timestamp: string
  osat_score: number
  createdAt: string
  updatedAt?: string
}

export interface CreateVideoData {
  video_id: string
  procedure_type: string
  total_video_time: string
  first_camera_entry_time: string
  final_camera_exit_time: string
  camera_exit_body_time?: string
  camera_enter_body_timestamp?: string
  camera_exit_body_timestamp?: string
  osat_score: number
}

export interface UpdateVideoData extends Partial<CreateVideoData> {}

export async function getVideos(): Promise<Video[]> {
  const response = await apiClient.get<Video[]>("/videos")
  return response.data
}

export async function getVideoById(id: number): Promise<Video> {
  const response = await apiClient.get<Video>(`/videos/${id}`)
  return response.data
}

export async function createVideo(data: CreateVideoData): Promise<Video> {
  const response = await apiClient.post<Video>("/videos", data)
  return response.data
}

export async function updateVideo(id: number, data: UpdateVideoData): Promise<Video> {
  const response = await apiClient.put<Video>(`/videos/${id}`, data)
  return response.data
}

export async function deleteVideo(id: number): Promise<void> {
  await apiClient.delete(`/videos/${id}`)
}
