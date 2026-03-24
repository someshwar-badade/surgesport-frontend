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