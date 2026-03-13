import * as React from "react"
import { Link, useNavigate } from "react-router"
import { getVideos, deleteVideo } from "~/lib/videoService"
import type { Video } from "~/lib/videoService"
import { VideoTable } from "~/components/videos/VideoTable"
import { useToast } from "~/components/ui/toast"
import { SiteHeader } from "~/components/site-header"
import { Button } from "~/components/ui/button"

export default function VideoList() {
  const [videos, setVideos] = React.useState<Video[]>([])
  const [loading, setLoading] = React.useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  React.useEffect(() => {
    getVideos().then((data) => {
      setVideos(data)
      setLoading(false)
    })
  }, [])

  const handleDelete = async (id: string) => {
    const ok = globalThis.confirm("Are you sure you want to delete this video?")
    if (!ok) return
    await deleteVideo(id)
    setVideos((v) => v.filter((x) => x.id !== id))
    toast.addToast({
      title: "Deleted",
      description: "Video was removed",
      variant: "success",
    })
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Videos" },
        ]}
      />
      <div className="w-full flex-1 p-6">
        <div className="mb-4 flex items-center justify-end">
          <Button
            asChild
            className="rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            <Link to="/videos/create">+ Create Video</Link>
          </Button>
        </div>
        <VideoTable
          videos={videos}
          onView={(id) => navigate(`/videos/${id}`)}
          onEdit={(id) => navigate(`/videos/${id}/edit`)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  )
}
