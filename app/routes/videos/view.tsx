import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { AnnotationTimeline } from "~/components/videos/AnnotationTimeline"
import { useState, useEffect } from "react"
import { getAnnotationsByVideoId } from "~/lib/annotationService"
import { initializeSampleAnnotations } from "~/lib/sampleData"
import type { Annotation } from "~/types/annotation.type"

// Mock video data for 10 min duration
const mockVideo = {
  id: "1",
  video_id: "VID-001",
  procedure_type: "Type A",
  total_video_time: "00:10:00",
  first_camera_entry_time: "2024-01-01T10:00:00Z",
  final_camera_exit_time: "2024-01-01T10:10:00Z",
  camera_exit_body_time: "",
  camera_enter_body_timestamp: "",
  camera_exit_body_timestamp: "",
  osat_score: 85,
  createdAt: "2024-01-01T09:00:00Z",
}

export default function ViewAnnotation() {
  const [videoDuration, setVideoDuration] = useState(600) // Default to 10 minutes
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined)
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [loading, setLoading] = useState(true)

  // Mock video ID - in a real app this would come from route params
  const videoId = "1"

  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        let data = await getAnnotationsByVideoId(videoId)

        // Initialize sample data if no annotations exist
        if (data.length === 0) {
          await initializeSampleAnnotations()
          data = await getAnnotationsByVideoId(videoId)
        }

        setAnnotations(data)
      } catch (error) {
        console.error("Failed to load annotations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadAnnotations()
  }, [videoId])

  const handleDurationChange = (duration: number) => {
    setVideoDuration(duration)
  }

  const handleAnnotationClick = (time: number) => {
    setSeekTime(time)
  }
  return (
    <>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "View Annotation" },
        ]}
      />

      <div className="w-full flex-1 space-y-4 p-6">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[65%_35%]">
          {/* Video Player Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-full">
                <VideoPlayer onDurationChange={handleDurationChange} seekTime={seekTime} />
              </div>
            </div>
            {/* Timeline below video */}
            <AnnotationTimeline
              annotations={annotations}
              videoDuration={videoDuration}
              onAnnotationClick={handleAnnotationClick}
            />
          </div>

          <Card className="h-full">
            <CardContent>
              <Tabs defaultValue="video_details" className="w-full">
                <TabsList className="inline-flex h-10 w-max min-w-full items-center justify-start rounded-md bg-muted p-1 text-muted-foreground">
                  <TabsTrigger value="video_details">Video Details</TabsTrigger>
                  <TabsTrigger value="annotations">Annotations</TabsTrigger>
                </TabsList>

                <TabsContent
                  key="video_details"
                  value="video_details"
                  className="space-y-4"
                >
                  <VideoDetails video={mockVideo} />
                </TabsContent>
                <TabsContent key="annotations" value="annotations">
                  <AnnotationDetails
                    annotations={annotations}
                    isViewMode={true}
                    videoId={videoId}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
