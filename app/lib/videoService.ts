import apiClient from "~/api/apiClient"
import type { ApiResponse } from "~/types/apis/apiResponse.type"
import type {
  CreateVideoData,
  UpdateVideoData,
  Video
} from "~/types/videos/video.type"
import { extractList } from "~/utils/helpers/extractListHelper"

// 🔹 Get all videos
export async function getVideos(): Promise<Video[]> {
  const res = await apiClient.get<ApiResponse<unknown>>("/videos")

  if (!res.data.status) {
    throw new Error(res.data.message || "Failed to fetch videos")
  }

  return extractList<Video>(res.data.data)
}

// 🔹 Get single video
export async function getVideoById(id: string): Promise<Video> {
  const res = await apiClient.get<ApiResponse<Video>>(`/videos/${id}`)

  if (!res.data.status) {
    throw new Error(res.data.message || "Video not found")
  }

  return res.data.data
}

// 🔹 Create video
export async function createVideo(data: CreateVideoData): Promise<Video> {
  const res = await apiClient.post<ApiResponse<Video>>("/videos", data)

  if (!res.data.status) {
    throw new Error(res.data.message || "Failed to create video")
  }

  return res.data.data
}

// 🔹 Update video
export async function updateVideo(id: string, data: UpdateVideoData): Promise<Video> {
  const res = await apiClient.put<ApiResponse<Video>>(`/videos/${id}`, data)

  if (!res.data.status) {
    throw new Error(res.data.message || "Failed to update video")
  }

  return res.data.data
}

// 🔹 Delete video
export async function deleteVideo(id: string): Promise<boolean> {
  const res = await apiClient.delete<ApiResponse<null>>(`/videos/${id}`)

  if (!res.data.status) {
    throw new Error(res.data.message || "Failed to delete video")
  }

  return true
}