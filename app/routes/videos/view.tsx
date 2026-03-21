import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { AnnotationTimeline } from "~/components/videos/AnnotationTimeline"
import { useState, useEffect } from "react"
import { getAnnotationsByVideoId } from "~/lib/annotationService"
import { getVideos, type Video } from "~/lib/videoService"
import type { PhaseAnnotation, EventAnnotation, BleedingAnnotation, InstrumentationAnnotation, Annotation,AnomalyAnnotation } from "~/types/annotation.type"

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

// Convert all annotation types to Annotation format for compatibility
const convertToLegacyAnnotations = (
  phases: PhaseAnnotation[],
  events: EventAnnotation[],
  bleeds: BleedingAnnotation[],
  instrumentation: InstrumentationAnnotation[],
  anomaly: AnomalyAnnotation[],
  videoId: string
): Annotation[] => {
  const legacyAnnotations: Annotation[] = []

  // Convert phases
  phases.forEach(phase => {
    legacyAnnotations.push({
      id: `phase-${phase.id}`,
      video_id: videoId,
      timestamp: phase.created_at || new Date().toISOString(),
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
      id: `event-${event.id}`,
      video_id: videoId,
      timestamp: event.created_at || new Date().toISOString(),
      time: event.timestamp,
      x: event.x_position,
      y: event.y_position,
      xPercent: (event.x_position / 1920) * 100,
      yPercent: (event.y_position / 1080) * 100,
      category: "events",
      eventName: event.event_type,
      createdAt: event.created_at || new Date().toISOString(),
      updatedAt: event.updated_at || new Date().toISOString(),
    })
  })

  // Convert bleeds
  bleeds.forEach(bleed => {
    legacyAnnotations.push({
      id: `bleed-${bleed.id}`,
      video_id: videoId,
      timestamp: bleed.created_at || new Date().toISOString(),
      time: bleed.onset_time,
      x: bleed.x_position,
      y: bleed.y_position,
      xPercent: (bleed.x_position / 1920) * 100,
      yPercent: (bleed.y_position / 1080) * 100,
      category: "bleeds",
      severity: bleed.severity as 'mild' | 'moderate' | 'severe',
      interventionTime: bleed.intervention_time,
      createdAt: bleed.created_at || new Date().toISOString(),
      updatedAt: bleed.updated_at || new Date().toISOString(),
    })
  })

  // Convert instrumentation
  instrumentation.forEach(inst => {
    legacyAnnotations.push({
      id: `instrument-${inst.id}`,
      video_id: videoId,
      timestamp: inst.created_at || new Date().toISOString(),
      time: inst.start_time,
      x: inst.x_position || 0,
      y: inst.y_position || 0,
      xPercent: (inst.x_position || 0) / 1920 * 100,
      yPercent: (inst.y_position || 0) / 1080 * 100,
      category: "instrumentation",
      instrumentName: inst.instrument_name,
      position: inst.position as 'Left' | 'Center' | 'Right',
      endTime: inst.end_time,
      createdAt: inst.created_at || new Date().toISOString(),
      updatedAt: inst.updated_at || new Date().toISOString(),
    })
  })

  // Convert anomalies
  anomaly.forEach(anom => {
    legacyAnnotations.push({
      id: `anomaly-${anom.id}`,
      video_id: videoId,
      timestamp: anom.created_at || new Date().toISOString(),
      time: anom.timestamp,
      x: anom.x_position || 0,
      y: anom.y_position || 0,
      xPercent: (anom.x_position || 0) / 1920 * 100,
      yPercent: (anom.y_position || 0) / 1080 * 100,
      category: "anomaly",
      description: anom.description,
      createdAt: anom.created_at || new Date().toISOString(),
      updatedAt: anom.updated_at || new Date().toISOString(),
    })
  })

  return legacyAnnotations
}

export default function ViewAnnotation() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [videoDuration, setVideoDuration] = useState(600) // Default to 10 minutes
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined)
  const [annotations, setAnnotations] = useState<{
    phases: PhaseAnnotation[]
    events: EventAnnotation[]
    bleeds: BleedingAnnotation[]
    instrumentation: InstrumentationAnnotation[]
    anomaly: AnomalyAnnotation[]
  }>({
    phases: [],
    events: [],
    bleeds: [],
    instrumentation: [],
    anomaly: [],
  })
  const [loading, setLoading] = useState(false)

  // Load videos on mount
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos()
        setVideos(data)
        if (!selectedVideo && data.length > 0) {
          setSelectedVideo(data[0])
        }
      } catch (error) {
        console.error("Failed to load videos", error)
      }
    }

    loadVideos()
  }, [])

  // Load annotations when video changes
  useEffect(() => {
    const loadAnnotations = async () => {
      if (!selectedVideo) return

      setLoading(true)
      try {
        const data = await getAnnotationsByVideoId(selectedVideo.id)
        setAnnotations(data)
      } catch (error) {
        console.error("Failed to load annotations:", error)
        setAnnotations({
          phases: [],
          events: [],
          bleeds: [],
          instrumentation: [],
          anomaly: [],
        })
      } finally {
        setLoading(false)
      }
    }

    loadAnnotations()
  }, [selectedVideo])

  const legacyAnnotations = convertToLegacyAnnotations(
    annotations.phases,
    annotations.events,
    annotations.bleeds,
    annotations.instrumentation,
      annotations.anomaly,
    selectedVideo?.id || "1"
  )

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
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2">
                <label htmlFor="videoSelect" className="text-sm font-medium">
                  Select Video:
                </label>
                <select
                  id="videoSelect"
                  className="rounded border px-2 py-1 text-sm"
                  value={selectedVideo?.id || ""}
                  onChange={(e) => {
                    const selected = videos.find((v) => v.id === e.target.value)
                    setSelectedVideo(selected || null)
                  }}
                >
                  <option value="" disabled>
                    -- Choose a video --
                  </option>
                  {videos.map((video) => (
                    <option key={video.id} value={video.id}>
                      {video.title ?? `Video ${video.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full">
                <VideoPlayer 
                  onDurationChange={handleDurationChange} 
                  seekTime={seekTime}
                  videoUrl={selectedVideo?.video_url}
                />
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
                  <VideoDetails video={selectedVideo ?? undefined} />
                </TabsContent>
                <TabsContent key="annotations" value="annotations">
                  <AnnotationDetails
                    annotations={legacyAnnotations}
                    isViewMode={true}
                    videoId={selectedVideo?.id || "1"}
                    onAnnotationClick={handleAnnotationClick}
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
