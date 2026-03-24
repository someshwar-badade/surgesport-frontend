import * as React from "react"
import { useParams, useNavigate } from "react-router"
import { SiteHeader } from "~/components/site-header"
import { getVideoById } from "~/lib/videoService"
import type { Video } from "~/types/videos/video.type"

export default function ViewVideo() {
  const { id } = useParams()
  const [video, setVideo] = React.useState<Video | null>(null)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!id) return
    getVideoById(id).then((v) => {
      if (v) setVideo(v)
    })
  }, [id])

  if (!video) return <div>Loading...</div>

  return (
    <div>
              <SiteHeader
                breadcrumbs={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Videos", href: "/videos" },
                  { label: "Video Details" },
                ]}
              />
              <div className="w-full flex-1 p-6">
    <div className="space-y-4">
      <div className="rounded bg-white p-4 shadow">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium">Video ID</dt>
            <dd>{video.id}</dd>
          </div>
          <div>
            <dt className="font-medium">Procedure Type</dt>
            <dd>{video.procedure?.name}</dd>
          </div>
          <div>
            <dt className="font-medium">Total Video Time</dt>
            <dd>{video.total_video_time}</dd>
          </div>
          <div>
            <dt className="font-medium">OSAT Score</dt>
            <dd>{video.osat_score}</dd>
          </div>
          <div>
            <dt className="font-medium">First Camera Entry</dt>
            <dd>{video.first_camera_entry_time}</dd>
          </div>
          <div>
            <dt className="font-medium">Final Camera Exit</dt>
            <dd>{video.final_camera_exit_time}</dd>
          </div>
          
          <div>
            <dt className="font-medium">Camera Enter Body Timestamp</dt>
            <dd>{video.camera_enter_body_timestamp}</dd>
          </div>
          <div>
            <dt className="font-medium">Camera Exit Body Timestamp</dt>
            <dd>{video.camera_exit_body_timestamp}</dd>
          </div>
          {/* <div className="col-span-full">
            <dt className="font-medium">Created At</dt>
            <dd>{new Date(video.createdAt).toLocaleString()}</dd>
          </div> */}
        </dl>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/videos/${video.id}/edit`)}
          className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Edit
        </button>
        <button
          onClick={() => navigate("/videos")}
          className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
        >
          Back
        </button>
      </div>
    </div>
    </div>
    </div>
  )
}
