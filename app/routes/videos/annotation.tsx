import { useState, useEffect } from "react"
import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { NavLink } from "react-router"
import { Badge } from "~/components/ui/badge"
import { getVideos, type Video } from "~/lib/videoService"
import {
  createPhaseAnnotation,
  createEventAnnotation,
  createBleedingAnnotation,
  createInstrumentationAnnotation,
  createAnomalyAnnotation,
} from "~/lib/annotationService"
import type { Annotation } from "~/types/annotation.type"

export default function Annotation() {
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [capture, setCapture] = useState<any>(null)
  const [selectedAnnotationType, setSelectedAnnotationType] = useState<string>("phases")

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
            timestamp: annotation.time,
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
