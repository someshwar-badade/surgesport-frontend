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
import type { PhaseAnnotation, EventAnnotation, Annotation } from "~/types/annotation.type"

// Mock video data for 10 min duration - updated to match new Video interface
const mockVideo = {
  id: "1",
  procedure_type: "Endoscopy",
  title: "Sample Endoscopy Video",
  total_video_time: 600, // 10 minutes in seconds
  video_url: "https://example.com/sample-video.mp4",
  created_at: "2024-01-01T09:00:00Z",
  updated_at: "2024-01-01T09:00:00Z",
}

// Mock video ID - in a real app this would come from route params
const videoId = "1"

// Convert new annotation types to old Annotation format for compatibility
const convertToLegacyAnnotations = (
  phases: PhaseAnnotation[],
  events: EventAnnotation[]
): Annotation[] => {
  const legacyAnnotations: Annotation[] = []

  // Convert phases
  phases.forEach(phase => {
    legacyAnnotations.push({
      id: phase.id.toString(),
      video_id: videoId,
      timestamp: new Date().toISOString(),
      time: phase.start_time,
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      category: "phases",
      phaseName: phase.phase_name,
      endTime: phase.end_time,
      duration: phase.end_time ? phase.end_time - phase.start_time : undefined,
      createdAt: phase.created_at || new Date().toISOString(),
      updatedAt: phase.updated_at || new Date().toISOString(),
    })
  })

  // Convert events
  events.forEach(event => {
    legacyAnnotations.push({
      id: event.id.toString(),
      video_id: videoId,
      timestamp: new Date().toISOString(),
      time: 0, // Events don't have time in the new API
      x: event.x_position,
      y: event.y_position,
      xPercent: 0,
      yPercent: 0,
      category: "events",
      eventName: event.event_type,
      createdAt: event.created_at || new Date().toISOString(),
      updatedAt: event.updated_at || new Date().toISOString(),
    })
  })

  return legacyAnnotations
}

export default function ViewAnnotation() {
  const [videoDuration, setVideoDuration] = useState(600) // Default to 10 minutes
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined)
  const [annotations, setAnnotations] = useState<{
    phases: PhaseAnnotation[]
    events: EventAnnotation[]
  }>({
    phases: [],
    events: []
  })
  const [loading, setLoading] = useState(true)

  // Convert new annotation types to old Annotation format for compatibility
  const convertToLegacyAnnotations = (
    phases: PhaseAnnotation[],
    events: EventAnnotation[]
  ): Annotation[] => {
    const legacyAnnotations: Annotation[] = []

    // Convert phases
    phases.forEach(phase => {
      legacyAnnotations.push({
        id: phase.id.toString(),
        video_id: videoId,
        timestamp: new Date().toISOString(),
        time: phase.start_time,
        x: 0,
        y: 0,
        xPercent: 0,
        yPercent: 0,
        category: "phases",
        phaseName: phase.phase_name,
        endTime: phase.end_time,
        duration: phase.end_time ? phase.end_time - phase.start_time : undefined,
        createdAt: phase.created_at || new Date().toISOString(),
        updatedAt: phase.updated_at || new Date().toISOString(),
      })
    })

    // Convert events
    events.forEach(event => {
      legacyAnnotations.push({
        id: event.id.toString(),
        video_id: videoId,
        timestamp: new Date().toISOString(),
        time: 0, // Events don't have time in the new API
        x: event.x_position,
        y: event.y_position,
        xPercent: 0,
        yPercent: 0,
        category: "events",
        eventName: event.event_type,
        createdAt: event.created_at || new Date().toISOString(),
        updatedAt: event.updated_at || new Date().toISOString(),
      })
    })

    return legacyAnnotations
  }

  const legacyAnnotations = convertToLegacyAnnotations(annotations.phases, annotations.events)

  useEffect(() => {
    const loadAnnotations = async () => {
      try {
        let data = await getAnnotationsByVideoId(videoId)

        // Initialize sample data if no annotations exist
        if (data.phases.length === 0 && data.events.length === 0) {
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
              annotations={legacyAnnotations}
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
                  {/* <VideoDetails video={mockVideo} /> */}
                </TabsContent>
                <TabsContent key="annotations" value="annotations">
                  <AnnotationDetails
                    annotations={legacyAnnotations}
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
