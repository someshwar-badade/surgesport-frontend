import * as React from "react"
import { useParams, useNavigate } from "react-router"
import { getVideoById, updateVideo } from "~/lib/videoService"
import { VideoForm } from "~/components/videos/VideoForm"
import { useToast } from "~/components/ui/toast"
import { SiteHeader } from "~/components/site-header"
import type { UpdateVideoData, Video } from "~/types/videos/video.type"

export default function EditVideo() {
  const { id } = useParams()
  const [video, setVideo] = React.useState<Video | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  const toDateTimeLocal = (value?: string | Date) => {
    if (!value) return ""

    const date = new Date(value)

    // Fix timezone offset
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - offset * 60000)

    return localDate.toISOString().slice(0, 16)
  }

  React.useEffect(() => {
    if (!id) return
    getVideoById(id).then((v) => {
      if (v) {
        //set formated times for display
        if (v.total_video_time_formatted) {
          v.total_video_time = v.total_video_time_formatted
        }
        if (v.first_camera_entry_time_formatted) {
          v.first_camera_entry_time = v.first_camera_entry_time_formatted
        }
        if (v.final_camera_exit_time_formatted) {
          v.final_camera_exit_time = v.final_camera_exit_time_formatted
        }
         if (v.camera_enter_body_timestamp) {
          v.camera_enter_body_timestamp = toDateTimeLocal(v.camera_enter_body_timestamp)
        }
         if (v.camera_exit_body_timestamp) {
          v.camera_exit_body_timestamp = toDateTimeLocal(v.camera_exit_body_timestamp)
        }
        //camera_enter_body_timestamp


        setVideo(v)
      }
    })
  }, [id])

  if (!video) return <div>Loading...</div>

  const handleSubmit = async (data: UpdateVideoData) => {
    await updateVideo(video.id, data)
    toast.addToast({
      title: "Updated",
      description: "Video updated",
      variant: "success",
    })
    navigate(`/videos/${video.id}`)
  }

  return (
    <div>
          <SiteHeader
            breadcrumbs={[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Videos", href: "/videos" },
              { label: "Edit Video" },
            ]}
          />
          <div className="w-full flex-1 p-6">
      
          <VideoForm
            initialData={video}
            onSubmit={handleSubmit}
            onCancel={() => navigate(`/videos/${video.id}`)}
          />
      </div>
    </div>
  )
}
