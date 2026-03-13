import * as React from "react"
import { useParams, useNavigate } from "react-router"
import { getVideoById, updateVideo } from "~/lib/videoService"
import type { Video } from "~/lib/videoService"
import { VideoForm } from "~/components/videos/VideoForm"
import { useToast } from "~/components/ui/toast"

export default function EditVideo() {
  const { id } = useParams()
  const [video, setVideo] = React.useState<Video | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  React.useEffect(() => {
    if (!id) return
    getVideoById(id).then((v) => {
      if (v) setVideo(v)
    })
  }, [id])

  if (!video) return <div>Loading...</div>

  const handleSubmit = async (data: any) => {
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
      <h1 className="mb-4 text-2xl font-semibold">Edit Video</h1>
      <VideoForm
        initialData={video}
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/videos/${video.id}`)}
      />
    </div>
  )
}
