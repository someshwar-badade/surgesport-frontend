import { SiteHeader } from "~/components/site-header"
import VideoPlayer from "~/components/video-player"
import { VideoDetails } from "~/components/videos/VideoDetails"
import { AnnotationDetails } from "~/components/videos/AnnotationDetails"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Card, CardContent } from "~/components/ui/card"
import { AnnotationTimeline } from "~/components/videos/AnnotationTimeline"
import { useState } from "react"

// Sample annotation data for a 10-minute video, filling all time with annotation
const sampleAnnotations = [
  // 0-60s: Phase
  {
    id: "1",
    timestamp: "2024-01-01T10:00:00Z",
    time: 0,
    x: 100,
    y: 200,
    xPercent: 10,
    yPercent: 20,
    category: "phases" as const,
    phaseName: "Preparation",
    endTime: 60,
    duration: 60,
  },
  // 60-120s: Phase
  {
    id: "2",
    timestamp: "2024-01-01T10:01:00Z",
    time: 60,
    x: 120,
    y: 220,
    xPercent: 20,
    yPercent: 30,
    category: "phases" as const,
    phaseName: "Incision",
    endTime: 120,
    duration: 60,
  },
  // 120-180s: Event
  {
    id: "3",
    timestamp: "2024-01-01T10:02:00Z",
    time: 120,
    x: 140,
    y: 240,
    xPercent: 30,
    yPercent: 40,
    category: "events" as const,
    eventName: "Bleeding Started",
  },
  // 180-240s: Bleed
  {
    id: "4",
    timestamp: "2024-01-01T10:03:00Z",
    time: 180,
    x: 160,
    y: 260,
    xPercent: 40,
    yPercent: 50,
    category: "bleeds" as const,
    interventionTime: 200,
    severity: "moderate" as const,
  },
  // 240-300s: Instrumentation
  {
    id: "5",
    timestamp: "2024-01-01T10:04:00Z",
    time: 240,
    x: 180,
    y: 280,
    xPercent: 50,
    yPercent: 60,
    category: "instrumentation" as const,
    instrumentName: "Scalpel",
    position: "Center" as const,
    endTime: 300,
    duration: 60,
  },
  // 300-360s: Anomaly
  {
    id: "6",
    timestamp: "2024-01-01T10:05:00Z",
    time: 300,
    x: 200,
    y: 300,
    xPercent: 60,
    yPercent: 70,
    category: "anomaly" as const,
    description: "Unexpected tissue response",
    note: "Monitor closely",
  },
  // 360-420s: Phase
  {
    id: "7",
    timestamp: "2024-01-01T10:06:00Z",
    time: 360,
    x: 220,
    y: 320,
    xPercent: 70,
    yPercent: 80,
    category: "phases" as const,
    phaseName: "Dissection",
    endTime: 420,
    duration: 60,
  },
  // 420-480s: Event
  {
    id: "8",
    timestamp: "2024-01-01T10:07:00Z",
    time: 420,
    x: 240,
    y: 340,
    xPercent: 80,
    yPercent: 90,
    category: "events" as const,
    eventName: "Suturing Started",
  },
  // 480-540s: Instrumentation
  {
    id: "9",
    timestamp: "2024-01-01T10:08:00Z",
    time: 480,
    x: 260,
    y: 360,
    xPercent: 90,
    yPercent: 95,
    category: "instrumentation" as const,
    instrumentName: "Needle Holder",
    position: "Left" as const,
    endTime: 540,
    duration: 60,
  },
  // 540-600s: Phase
  {
    id: "10",
    timestamp: "2024-01-01T10:09:00Z",
    time: 540,
    x: 280,
    y: 380,
    xPercent: 95,
    yPercent: 99,
    category: "phases" as const,
    phaseName: "Closure",
    endTime: 600,
    duration: 60,
  },
]

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
              annotations={sampleAnnotations}
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
                    annotations={sampleAnnotations}
                    isViewMode={true}
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
