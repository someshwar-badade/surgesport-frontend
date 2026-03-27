import * as React from "react"
import { Link, useNavigate } from "react-router"
import { getAnnotatorAnnotations } from "~/lib/annotationService"
import type { Video } from "~/lib/annotationService"
import { AnnotationsTable } from "~/components/annotations/AnnotationsTable"
import { useToast } from "~/components/ui/toast"
import { SiteHeader } from "~/components/site-header"
import { Button } from "~/components/ui/button"

export default function VideoList() {
  const [videos, setVideos] = React.useState<Video[]>([])
  const [loading, setLoading] = React.useState(true)
  const toast = useToast()
  const navigate = useNavigate()

  React.useEffect(() => {
    getAnnotatorAnnotations().then((data) => {
      setVideos(data)
      setLoading(false)
    })
  }, [])

  

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Annotations" },
        ]}
      />
      <div className="w-full flex-1 p-6">
        <div className="mb-4 flex items-center justify-end">
          <Button
            asChild
            className="rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            
          </Button>
        </div>
        <AnnotationsTable
          videos={videos}
          onView={(id) => navigate(`/videos/${id}`)}
         
        />
      </div>
    </div>
  )
}
