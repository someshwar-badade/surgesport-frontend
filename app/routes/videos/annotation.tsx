import { useState, useEffect } from "react"
import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { NavLink } from "react-router"
import { Badge } from "~/components/ui/badge"
import {
  createPhaseAnnotation,
  createEventAnnotation,
  createBleedingAnnotation,
  createInstrumentationAnnotation,
  createAnomalyAnnotation,
  getAnnotationsByVideoId,
  deleteAnnotation,
} from "~/lib/annotationService"
import type { Annotation } from "~/types/annotation.type"
import { getVideos } from "~/lib/videoService"
import type { Video } from "~/types/videos/video.type"

export default function Annotation() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [capture, setCapture] = useState<any>(null)
  const [selectedAnnotationType, setSelectedAnnotationType] = useState<string>("phases")
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [loadingAnnotations, setLoadingAnnotations] = useState(false)
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined)

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

  // Fetch annotations when video changes
  useEffect(() => {
    const loadAnnotations = async () => {
      if (!selectedVideo) {
        setAnnotations([])
        return
      }
      
      setLoadingAnnotations(true)
      // Clear existing annotations immediately when switching videos
      setAnnotations([])
      
      try {
        const data = await getAnnotationsByVideoId(selectedVideo.id)
        // Flatten all annotations by category into single array
        const allAnnotations: Annotation[] = [
          ...data.phases.map(p => ({
            id: `phase-${p.id}`,
            video_id: selectedVideo.id,
            timestamp: p.created_at || new Date().toISOString(),
            time: p.start_time,
            x: 0,
            y: 0,
            xPercent: 0,
            yPercent: 0,
            category: 'phases' as const,
            phaseName: p.phase_name,
            endTime: p.end_time,
            createdAt: p.created_at || new Date().toISOString(),
            updatedAt: p.updated_at || new Date().toISOString(),
          })),
          ...data.events.map(e => ({
            id: `event-${e.id}`,
            video_id: selectedVideo.id,
            timestamp: e.created_at || new Date().toISOString(),
            time: e.created_at,
            x: e.x_position,
            y: e.y_position,
            xPercent: (e.x_position / 1920) * 100,
            yPercent: (e.y_position / 1080) * 100,
            category: 'events' as const,
            eventName: e.event_type,
            createdAt: e.created_at || new Date().toISOString(),
            updatedAt: e.updated_at || new Date().toISOString(),
          })),
          ...data.bleeds.map(b => ({
            id: `bleed-${b.id}`,
            video_id: selectedVideo.id,
            timestamp: b.created_at || new Date().toISOString(),
            time: b.onset_time,
            x: b.x_position,
            y: b.y_position,
            xPercent: (b.x_position / 1920) * 100,
            yPercent: (b.y_position / 1080) * 100,
            category: 'bleeds' as const,
            severity: b.severity as 'mild' | 'moderate' | 'severe',
            interventionTime: b.intervention_time,
            createdAt: b.created_at || new Date().toISOString(),
            updatedAt: b.updated_at || new Date().toISOString(),
          })),
          ...data.instrumentation.map(i => ({
            id: `instrument-${i.id}`,
            video_id: selectedVideo.id,
            timestamp: i.created_at || new Date().toISOString(),
            time: i.start_time,
            x: i.x_position || 0,
            y: i.y_position || 0,
            xPercent: (i.x_position || 0) / 1920 * 100,
            yPercent: (i.y_position || 0) / 1080 * 100,
            category: 'instrumentation' as const,
            instrumentName: i.instrument_name,
            position: i.position as 'Left' | 'Center' | 'Right',
            endTime: i.end_time,
            createdAt: i.created_at || new Date().toISOString(),
            updatedAt: i.updated_at || new Date().toISOString(),
          })),
          ...(data.anomaly ? data.anomaly.map(a => ({
            id: `anomaly-${a.id}`,
            video_id: selectedVideo.id,
            timestamp: a.created_at || new Date().toISOString(),
            time: a.timestamp,
            x: a.x_position || 0,
            y: a.y_position || 0,
            xPercent: (a.x_position || 0) / 1920 * 100,
            yPercent: (a.y_position || 0) / 1080 * 100,
            category: 'anomaly' as const,
            description: a.description,
            createdAt: a.created_at || new Date().toISOString(),
            updatedAt: a.updated_at || new Date().toISOString(),
          })) : []),
        ]
        setAnnotations(allAnnotations)
      } catch (error) {
        console.error("Failed to load annotations", error)
        setAnnotations([])
      } finally {
        setLoadingAnnotations(false)
      }
    }

    loadAnnotations()
  }, [selectedVideo])

  const handleSaveAnnotation = async (annotation: any) => {
    if (!selectedVideo) {
      console.warn("No video selected; cannot persist annotation")
      return
    }

    try {
      switch (annotation.category) {
        case "phases":
          await createPhaseAnnotation(selectedVideo.id, {
            phase_name: annotation.phaseName,
            start_time: annotation.time,
            end_time: annotation.endTime,
          })
          break
        case "events":
          await createEventAnnotation(selectedVideo.id, {
            event_type: annotation.eventName,
            x_position: annotation.x,
            y_position: annotation.y,
          })
          break
        case "bleeds":
          await createBleedingAnnotation(selectedVideo.id, {
            onset_time: annotation.time,
            severity: annotation.severity,
            intervention_time: annotation.interventionTime,
            x_position: annotation.x,
            y_position: annotation.y,
          })
          break
        case "instrumentation":
          await createInstrumentationAnnotation(selectedVideo.id, {
            instrument_name : annotation.instrumentName,
            position: annotation.position,
            start_time: annotation.time,
            end_time: annotation.endTime,
            x_position: annotation.x,
            y_position: annotation.y,
          })
          break
        case "anomaly":
          await createAnomalyAnnotation(selectedVideo.id, {
            timestamp: annotation.time,
            description: annotation.description,
            x_position: annotation.x,
            y_position: annotation.y,
          })
          break
        default:
          console.warn("Unknown annotation category:", annotation.category)
      }
      console.log("Saved annotation to backend for video", selectedVideo.id)
    } catch (error) {
      console.error("Annotation save failed:", error)
    }
  }

  const handleClearCapture = () => {
    setCapture(null)
  }

  const handleDeleteAnnotation = async (annotationId: string) => {
    if (!selectedVideo) return

    try {
      console.log("Attempting to delete annotation", annotationId)
      // Extract category and numeric ID from annotation ID (e.g., "phase-123" -> "phases", 123)
      const parts = annotationId.split('-')
      const category = parts[0]
      const numericId = parseInt(parts[1])
      console.log("Parsed category:", category, "numericId:", numericId)
      if (isNaN(numericId)) return

      // Map singular category names to plural API endpoints
      const categoryMap: Record<string, string> = {
        'phase': 'phases',
        'event': 'events',
        'bleed':'bleedings',
        'instrument': 'instruments',
        'anomaly': 'anomalies',
      }
      
      const apiCategory = categoryMap[category] || category
     console.log(apiCategory,category,categoryMap)
      await deleteAnnotation(selectedVideo.id, numericId, apiCategory)
      
      // Remove from local state
      setAnnotations(prev => prev.filter(ann => ann.id !== annotationId))
      console.log("Annotation deleted successfully")
    } catch (error) {
      console.error("Failed to delete annotation", error)
    }
  }

  const handleAnnotationClick = (time: number) => {
    console.log("Seeking video to time:", time)
    setSeekTime(time)
  }

  return (
    <>
      <SiteHeader
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Annotation" },
        ]}
      />

      <div className="w-full flex-1 p-6">
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-[65%_35%]">
          {/* Video Player Column */}
          <div className="flex items-center justify-center">
            <div className="w-full">
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

                <NavLink to="/videos/annotation/view" className="text-blue-500 hover:underline">
                  Go to annotation timeline
                </NavLink>
                <p className="text-sm text-gray-500 mb-2">
                  Double-click the video to capture annotation (time & position) and save it in the “Annotations” tab.
                </p>
              </div>
              <VideoPlayer
                onCapture={setCapture}
                seekTime={seekTime}
                selectedAnnotationType={selectedAnnotationType}
                videoUrl={selectedVideo?.video_url}
              />
            </div>
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
                    capture={capture}
                    onSaveAnnotation={handleSaveAnnotation}
                    onClearCapture={handleClearCapture}
                    onAnnotationTypeChange={setSelectedAnnotationType}
                    annotations={annotations}
                    videoId={selectedVideo?.id}
                    onDeleteAnnotation={handleDeleteAnnotation}
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
