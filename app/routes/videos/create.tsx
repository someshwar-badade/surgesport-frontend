import * as React from "react"
import { useNavigate } from "react-router"
import { createVideo } from "~/lib/videoService"
import { VideoForm } from "~/components/videos/VideoForm"
import { useToast } from "~/components/ui/toast"
import { SiteHeader } from "~/components/site-header"

export default function CreateVideo() {
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (data: any) => {
    await createVideo(data)
    toast.addToast({
      title: "Created",
      description: "Video added successfully",
      variant: "success",
    })
    navigate("/videos")
  }

  return (
    <div>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Videos", href: "/videos" },
          { label: "Create Video" },
        ]}
      />
      <div className="w-full flex-1 p-6">
        <VideoForm
          onSubmit={handleSubmit}
          onCancel={() => navigate("/videos")}
        />
      </div>
    </div>
  )
}
